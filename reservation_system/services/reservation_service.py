"""Business logic for managing reservations."""
from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from typing import Dict, Iterable, List, Optional, Tuple

from .. import models
from ..storage import ReservationStorage


class ReservationConflictError(RuntimeError):
    """Raised when attempting to create an overlapping reservation."""


class ReservationService:
    """Service layer responsible for reservation workflow."""

    def __init__(self, storage: ReservationStorage) -> None:
        self._storage = storage

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------
    def _reservations_for_unit(self, unit_id: str) -> List[models.Reservation]:
        return [
            res for res in self._storage.list_reservations() if res.unit_id == unit_id
        ]

    def _date_range(self, start: date, end: date) -> Iterable[date]:
        current = start
        while current < end:
            yield current
            current += timedelta(days=1)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def check_availability(
        self, unit_id: str, check_in: date, check_out: date
    ) -> bool:
        for reservation in self._reservations_for_unit(unit_id):
            if reservation.status != "confirmed":
                continue
            if not (check_out <= reservation.check_in or check_in >= reservation.check_out):
                return False
        return True

    def next_available_date(self, unit_id: str, after: date) -> Optional[date]:
        reservations = [
            res
            for res in self._reservations_for_unit(unit_id)
            if res.status == "confirmed"
        ]
        if not reservations:
            return after

        reservations.sort(key=lambda res: res.check_in)
        current = after
        while True:
            conflict = next(
                (
                    res
                    for res in reservations
                    if not (current < res.check_in or current >= res.check_out)
                ),
                None,
            )
            if not conflict:
                return current
            current = conflict.check_out

    def price_quote(self, unit_id: str, check_in: date, check_out: date) -> float:
        rate_plans = self._storage.find_rate_plans(unit_id)
        if not rate_plans:
            unit = self._storage.find_unit(unit_id)
            if not unit:
                raise ValueError("Unknown unit")
            return unit.price_per_night * (check_out - check_in).days

        cheapest = min(
            (
                rate_plan.price_for(check_in, check_out)
                for rate_plan in rate_plans
            ),
            default=None,
        )
        if cheapest is None:
            raise ValueError("No rate plans available")
        return cheapest

    def create_reservation(
        self,
        customer_id: str,
        unit_id: str,
        check_in: date,
        check_out: date,
        adults: int,
        children: int = 0,
        addons: Optional[List[str]] = None,
    ) -> models.Reservation:
        if not self._storage.find_customer(customer_id):
            raise ValueError("Unknown customer")
        if not self._storage.find_unit(unit_id):
            raise ValueError("Unknown unit")

        if not self.check_availability(unit_id, check_in, check_out):
            raise ReservationConflictError("Selected unit is not available for dates")

        reservation = models.Reservation(
            customer_id=customer_id,
            unit_id=unit_id,
            check_in=check_in,
            check_out=check_out,
            adults=adults,
            children=children,
            addons=addons or [],
        )
        self._storage.save_reservation(reservation)
        self._storage.save_audit_log(
            models.AuditLogEntry(
                event_type="reservation_created",
                payload={"reservation_id": reservation.id},
            )
        )
        return reservation

    def cancel_reservation(self, reservation_id: str) -> bool:
        reservation = self._storage.find_reservation(reservation_id)
        if not reservation:
            return False
        if reservation.status == "cancelled":
            return True

        reservation.status = "cancelled"
        reservations = [
            reservation if res.id == reservation_id else res
            for res in self._storage.list_reservations()
        ]
        self._storage.replace_reservations(reservations)
        self._storage.save_audit_log(
            models.AuditLogEntry(
                event_type="reservation_cancelled",
                payload={"reservation_id": reservation_id},
            )
        )
        return True

    def attach_payment(
        self, reservation_id: str, amount: float, currency: str = "USD"
    ) -> models.Payment:
        reservation = self._storage.find_reservation(reservation_id)
        if not reservation:
            raise ValueError("Reservation does not exist")

        payment = models.Payment(
            reservation_id=reservation_id,
            amount=amount,
            currency=currency,
            status="pending",
        )
        self._storage.save_payment(payment)
        self._storage.save_audit_log(
            models.AuditLogEntry(
                event_type="payment_attached",
                payload={"payment_id": payment.id, "reservation_id": reservation_id},
            )
        )
        return payment

    def mark_payment_paid(self, payment_id: str, reference: str) -> models.Payment:
        payment = next((p for p in self._storage.list_payments() if p.id == payment_id), None)
        if not payment:
            raise ValueError("Payment not found")
        payment.mark_paid(reference)
        self._storage.upsert_payment(payment)
        self._storage.save_audit_log(
            models.AuditLogEntry(
                event_type="payment_marked_paid",
                payload={"payment_id": payment.id},
            )
        )
        return payment

    def occupancy_report(
        self, property_id: str, start: date, end: date
    ) -> Dict[date, Dict[str, int]]:
        units = [unit for unit in self._storage.list_units() if unit.property_id == property_id]
        unit_ids = {unit.id for unit in units}
        reservations = [
            res
            for res in self._storage.list_reservations()
            if res.unit_id in unit_ids and res.status == "confirmed"
        ]

        report: Dict[date, Dict[str, int]] = {}
        for day in self._date_range(start, end):
            report[day] = {"occupied": 0, "available": len(units)}

        for reservation in reservations:
            for day in self._date_range(reservation.check_in, reservation.check_out):
                if day not in report:
                    continue
                report[day]["occupied"] += 1
                report[day]["available"] -= 1
        return report

    def availability_calendar(
        self, property_id: str, month: int, year: int
    ) -> Dict[str, Dict[str, str]]:
        units = [unit for unit in self._storage.list_units() if unit.property_id == property_id]
        calendar: Dict[str, Dict[str, str]] = {}

        start = date(year, month, 1)
        if month == 12:
            end = date(year + 1, 1, 1)
        else:
            end = date(year, month + 1, 1)

        for unit in units:
            calendar[unit.name] = {}
            for day in self._date_range(start, end):
                calendar[unit.name][day.isoformat()] = "available"

            for reservation in self._reservations_for_unit(unit.id):
                if reservation.status != "confirmed":
                    continue
                for day in self._date_range(reservation.check_in, reservation.check_out):
                    if start <= day < end:
                        calendar[unit.name][day.isoformat()] = "occupied"
        return calendar

    def waitlist_customers(self, unit_id: str) -> List[models.WaitlistEntry]:
        return [
            entry for entry in self._storage.list_waitlist_entries() if entry.unit_id == unit_id
        ]

    def add_to_waitlist(
        self,
        unit_id: str,
        customer_id: str,
        desired_check_in: date,
        desired_check_out: date,
    ) -> models.WaitlistEntry:
        entry = models.WaitlistEntry(
            unit_id=unit_id,
            customer_id=customer_id,
            desired_check_in=desired_check_in,
            desired_check_out=desired_check_out,
        )
        self._storage.save_waitlist_entry(entry)
        self._storage.save_audit_log(
            models.AuditLogEntry(
                event_type="waitlist_joined",
                payload={"waitlist_id": entry.id},
            )
        )
        return entry

    def waitlist_notifications(
        self,
    ) -> List[Tuple[models.WaitlistEntry, Optional[models.Reservation]]]:
        notifications: List[Tuple[models.WaitlistEntry, Optional[models.Reservation]]] = []
        entries = [entry for entry in self._storage.list_waitlist_entries() if not entry.notified]
        for entry in entries:
            reservations = [
                res
                for res in self._reservations_for_unit(entry.unit_id)
                if res.status == "confirmed"
            ]
            available = True
            for res in reservations:
                if not (
                    entry.desired_check_out <= res.check_in
                    or entry.desired_check_in >= res.check_out
                ):
                    available = False
                    break
            if available:
                notifications.append((entry, reservations[0] if reservations else None))
        return notifications

    def revenue_summary(self, property_id: str, start: date, end: date) -> Dict[str, float]:
        units = [unit for unit in self._storage.list_units() if unit.property_id == property_id]
        unit_ids = {unit.id for unit in units}
        reservations = [
            res
            for res in self._storage.list_reservations()
            if res.unit_id in unit_ids and res.status == "confirmed"
        ]

        payments = [
            payment
            for payment in self._storage.list_payments()
            if self._storage.find_reservation(payment.reservation_id) in reservations
            and payment.status == "paid"
            and payment.paid_at
            and start <= payment.paid_at.date() <= end
        ]

        totals: Dict[str, float] = defaultdict(float)
        for payment in payments:
            totals[payment.currency] += payment.amount
        return dict(totals)
