from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path

from reservation_system.services.reservation_service import (
    ReservationConflictError,
    ReservationService,
)
from reservation_system.storage import ReservationStorage, bootstrap_demo_data


def create_service(tmp_path: Path) -> ReservationService:
    storage = ReservationStorage(tmp_path / "reservations.json")
    bootstrap_demo_data(storage)
    return ReservationService(storage)


def test_create_reservation_success(tmp_path):
    service = create_service(tmp_path)
    storage = service._storage  # type: ignore[attr-defined]
    customer = storage.list_customers()[0]
    unit = storage.list_units()[0]

    today = date.today() + timedelta(days=10)
    reservation = service.create_reservation(
        customer_id=customer.id,
        unit_id=unit.id,
        check_in=today,
        check_out=today + timedelta(days=2),
        adults=2,
    )

    assert reservation.id
    assert storage.find_reservation(reservation.id)


def test_conflict_detection(tmp_path):
    service = create_service(tmp_path)
    storage = service._storage  # type: ignore[attr-defined]
    customer = storage.list_customers()[0]
    unit = storage.list_units()[0]

    existing = storage.list_reservations()[0]

    try:
        service.create_reservation(
            customer_id=customer.id,
            unit_id=unit.id,
            check_in=existing.check_in,
            check_out=existing.check_out,
            adults=2,
        )
    except ReservationConflictError:
        pass
    else:
        raise AssertionError("Expected ReservationConflictError")


def test_price_quote_uses_rate_plan(tmp_path):
    service = create_service(tmp_path)
    storage = service._storage  # type: ignore[attr-defined]
    unit = storage.list_units()[0]

    today = date.today() + timedelta(days=30)
    quote = service.price_quote(
        unit_id=unit.id,
        check_in=today,
        check_out=today + timedelta(days=3),
    )

    assert quote > 0


def test_occupancy_report_counts_days(tmp_path):
    service = create_service(tmp_path)
    storage = service._storage  # type: ignore[attr-defined]
    property_id = storage.list_properties()[0].id

    today = date.today()
    report = service.occupancy_report(
        property_id=property_id,
        start=today,
        end=today + timedelta(days=5),
    )

    assert len(report) == 5
    assert any(day["occupied"] > 0 for day in report.values())
