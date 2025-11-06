"""Persistence layer for the reservation system."""
from __future__ import annotations

import json
from dataclasses import asdict
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List, Optional

from . import models


class StorageError(RuntimeError):
    """Raised when the storage layer encounters an unrecoverable error."""


def _serialize_datetime(value: datetime) -> str:
    return value.isoformat()


def _deserialize_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _serialize_date(value: date) -> str:
    return value.isoformat()


def _deserialize_date(value: str) -> date:
    return date.fromisoformat(value)


class ReservationStorage:
    """Simple JSON file-backed storage for reservations."""

    def __init__(self, path: Path) -> None:
        self._path = path
        self._path.parent.mkdir(parents=True, exist_ok=True)
        if not self._path.exists():
            self._initialize()

    # ------------------------------------------------------------------
    # Serialization helpers
    # ------------------------------------------------------------------
    def _initialize(self) -> None:
        empty_state = {
            "customers": [],
            "properties": [],
            "units": [],
            "rate_plans": [],
            "addons": [],
            "reservations": [],
            "payments": [],
            "inventory_snapshots": [],
            "waitlist_entries": [],
            "audit_log": [],
        }
        self._path.write_text(json.dumps(empty_state, indent=2))

    def _read_state(self) -> Dict[str, List[Dict[str, object]]]:
        try:
            return json.loads(self._path.read_text())
        except json.JSONDecodeError as exc:
            raise StorageError("Could not read storage file") from exc

    def _write_state(self, state: Dict[str, List[Dict[str, object]]]) -> None:
        tmp_path = self._path.with_suffix(".tmp")
        tmp_path.write_text(json.dumps(state, indent=2, sort_keys=True))
        tmp_path.replace(self._path)

    # ------------------------------------------------------------------
    # Conversion helpers
    # ------------------------------------------------------------------
    def _encode(self, obj: object) -> Dict[str, object]:
        payload = asdict(obj)
        for key, value in list(payload.items()):
            if isinstance(value, datetime):
                payload[key] = _serialize_datetime(value)
            elif isinstance(value, date):
                payload[key] = _serialize_date(value)
        return payload

    def _decode(self, cls, payload: Dict[str, object]):
        for key, value in list(payload.items()):
            if key.endswith("_at") and isinstance(value, str):
                payload[key] = _deserialize_datetime(value)
            if key.startswith("check_") and isinstance(value, str):
                payload[key] = _deserialize_date(value)
            if key in {"date"} and isinstance(value, str):
                payload[key] = _deserialize_date(value)
        return cls(**payload)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def list_customers(self) -> List[models.Customer]:
        return [
            self._decode(models.Customer, payload)
            for payload in self._read_state()["customers"]
        ]

    def list_properties(self) -> List[models.Property]:
        return [
            self._decode(models.Property, payload)
            for payload in self._read_state()["properties"]
        ]

    def list_units(self) -> List[models.Unit]:
        return [
            self._decode(models.Unit, payload)
            for payload in self._read_state()["units"]
        ]

    def list_rate_plans(self) -> List[models.RatePlan]:
        return [
            self._decode(models.RatePlan, payload)
            for payload in self._read_state()["rate_plans"]
        ]

    def list_addons(self) -> List[models.AddOn]:
        return [
            self._decode(models.AddOn, payload)
            for payload in self._read_state()["addons"]
        ]

    def list_reservations(self) -> List[models.Reservation]:
        return [
            self._decode(models.Reservation, payload)
            for payload in self._read_state()["reservations"]
        ]

    def list_payments(self) -> List[models.Payment]:
        return [
            self._decode(models.Payment, payload)
            for payload in self._read_state()["payments"]
        ]

    def list_waitlist_entries(self) -> List[models.WaitlistEntry]:
        return [
            self._decode(models.WaitlistEntry, payload)
            for payload in self._read_state()["waitlist_entries"]
        ]

    def list_inventory_snapshots(self) -> List[models.InventorySnapshot]:
        return [
            self._decode(models.InventorySnapshot, payload)
            for payload in self._read_state()["inventory_snapshots"]
        ]

    def list_audit_log(self) -> List[models.AuditLogEntry]:
        return [
            self._decode(models.AuditLogEntry, payload)
            for payload in self._read_state()["audit_log"]
        ]

    def _append(self, key: str, obj: object) -> None:
        state = self._read_state()
        state[key].append(self._encode(obj))
        self._write_state(state)

    def save_customer(self, customer: models.Customer) -> models.Customer:
        self._append("customers", customer)
        return customer

    def save_property(self, property_: models.Property) -> models.Property:
        self._append("properties", property_)
        return property_

    def save_unit(self, unit: models.Unit) -> models.Unit:
        self._append("units", unit)
        return unit

    def save_rate_plan(self, rate_plan: models.RatePlan) -> models.RatePlan:
        self._append("rate_plans", rate_plan)
        return rate_plan

    def save_addon(self, addon: models.AddOn) -> models.AddOn:
        self._append("addons", addon)
        return addon

    def save_reservation(self, reservation: models.Reservation) -> models.Reservation:
        self._append("reservations", reservation)
        return reservation

    def save_payment(self, payment: models.Payment) -> models.Payment:
        self._append("payments", payment)
        return payment

    def save_waitlist_entry(self, entry: models.WaitlistEntry) -> models.WaitlistEntry:
        self._append("waitlist_entries", entry)
        return entry

    def save_inventory_snapshot(
        self, snapshot: models.InventorySnapshot
    ) -> models.InventorySnapshot:
        self._append("inventory_snapshots", snapshot)
        return snapshot

    def save_audit_log(self, entry: models.AuditLogEntry) -> models.AuditLogEntry:
        self._append("audit_log", entry)
        return entry

    def replace_reservations(self, reservations: Iterable[models.Reservation]) -> None:
        state = self._read_state()
        state["reservations"] = [self._encode(res) for res in reservations]
        self._write_state(state)

    def replace_payments(self, payments: Iterable[models.Payment]) -> None:
        state = self._read_state()
        state["payments"] = [self._encode(payment) for payment in payments]
        self._write_state(state)

    def find_reservation(self, reservation_id: str) -> Optional[models.Reservation]:
        for reservation in self.list_reservations():
            if reservation.id == reservation_id:
                return reservation
        return None

    def find_unit(self, unit_id: str) -> Optional[models.Unit]:
        for unit in self.list_units():
            if unit.id == unit_id:
                return unit
        return None

    def find_property(self, property_id: str) -> Optional[models.Property]:
        for property_ in self.list_properties():
            if property_.id == property_id:
                return property_
        return None

    def find_rate_plans(self, unit_id: str) -> List[models.RatePlan]:
        return [
            rate_plan
            for rate_plan in self.list_rate_plans()
            if rate_plan.unit_id == unit_id
        ]

    def find_customer(self, customer_id: str) -> Optional[models.Customer]:
        for customer in self.list_customers():
            if customer.id == customer_id:
                return customer
        return None

    def delete_reservation(self, reservation_id: str) -> bool:
        reservations = [
            res for res in self.list_reservations() if res.id != reservation_id
        ]
        if len(reservations) == len(self.list_reservations()):
            return False
        self.replace_reservations(reservations)
        return True

    def upsert_payment(self, payment: models.Payment) -> models.Payment:
        payments = [p for p in self.list_payments() if p.id != payment.id]
        payments.append(payment)
        self.replace_payments(payments)
        return payment


def bootstrap_demo_data(storage: ReservationStorage) -> None:
    """Populate storage with sample data for experimentation."""

    if storage.list_properties():
        return

    property_ = storage.save_property(
        models.Property(
            name="Hotel Central",
            address="123 Main Street, Prague",
            description="Modern hotel in the heart of the city",
        )
    )
    deluxe = storage.save_unit(
        models.Unit(
            property_id=property_.id,
            name="Deluxe Room",
            capacity=2,
            price_per_night=120.0,
            amenities=["WiFi", "Breakfast", "Air Conditioning"],
        )
    )
    suite = storage.save_unit(
        models.Unit(
            property_id=property_.id,
            name="Executive Suite",
            capacity=4,
            price_per_night=250.0,
            amenities=["WiFi", "Breakfast", "Balcony", "Kitchenette"],
        )
    )

    storage.save_rate_plan(
        models.RatePlan(
            unit_id=deluxe.id,
            name="Standard",
            base_price=120.0,
            weekend_surcharge=20.0,
        )
    )
    storage.save_rate_plan(
        models.RatePlan(
            unit_id=suite.id,
            name="Flexible",
            base_price=260.0,
            min_nights=2,
            weekend_surcharge=35.0,
        )
    )

    breakfast = storage.save_addon(
        models.AddOn(name="Breakfast", price=12.0, description="Buffet breakfast")
    )
    parking = storage.save_addon(
        models.AddOn(name="Parking", price=15.0, description="Underground parking")
    )

    customer = storage.save_customer(
        models.Customer(full_name="Anna Novak", email="anna@example.com")
    )

    today = date.today()
    storage.save_reservation(
        models.Reservation(
            customer_id=customer.id,
            unit_id=deluxe.id,
            check_in=today,
            check_out=today + timedelta(days=3),
            adults=2,
            addons=[breakfast.id, parking.id],
        )
    )

    storage.save_audit_log(
        models.AuditLogEntry(
            event_type="bootstrap_completed",
            payload={"property_id": property_.id},
        )
    )
