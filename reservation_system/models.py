"""Domain models for the reservation system."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import Dict, List, Optional
import uuid


def _generate_id() -> str:
    """Return a random UUID4 identifier."""
    return str(uuid.uuid4())


@dataclass
class Customer:
    """Represents a customer within the booking platform."""

    full_name: str
    email: str
    phone_number: Optional[str] = None
    id: str = field(default_factory=_generate_id)

    def __post_init__(self) -> None:
        self.email = self.email.lower().strip()
        if not self.full_name:
            raise ValueError("Customer name must not be empty")
        if "@" not in self.email:
            raise ValueError("Customer email must contain '@'")


@dataclass
class Property:
    """Represents a hotel, guest house or any bookable property."""

    name: str
    address: str
    description: Optional[str] = None
    id: str = field(default_factory=_generate_id)

    def __post_init__(self) -> None:
        if not self.name:
            raise ValueError("Property must have a name")
        if not self.address:
            raise ValueError("Property must have an address")


@dataclass
class Unit:
    """A unit is an individual room or apartment available for booking."""

    property_id: str
    name: str
    capacity: int
    price_per_night: float
    amenities: List[str] = field(default_factory=list)
    id: str = field(default_factory=_generate_id)

    def __post_init__(self) -> None:
        if self.capacity <= 0:
            raise ValueError("Unit capacity must be greater than zero")
        if self.price_per_night <= 0:
            raise ValueError("Price per night must be positive")


@dataclass
class AddOn:
    """Additional services that can be attached to reservations."""

    name: str
    price: float
    description: Optional[str] = None
    id: str = field(default_factory=_generate_id)

    def __post_init__(self) -> None:
        if self.price < 0:
            raise ValueError("Add-on price cannot be negative")


@dataclass
class Reservation:
    """Represents a customer reservation for a particular unit."""

    customer_id: str
    unit_id: str
    check_in: date
    check_out: date
    adults: int
    children: int = 0
    status: str = "confirmed"
    addons: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    id: str = field(default_factory=_generate_id)

    def __post_init__(self) -> None:
        if self.check_in >= self.check_out:
            raise ValueError("Check-out date must be after check-in date")
        if self.adults <= 0:
            raise ValueError("Reservation must include at least one adult")
        if self.status not in {"confirmed", "cancelled"}:
            raise ValueError("Unsupported reservation status")

    @property
    def nights(self) -> int:
        return (self.check_out - self.check_in).days


@dataclass
class Payment:
    """Payment details for reservations."""

    reservation_id: str
    amount: float
    currency: str = "USD"
    status: str = "pending"
    transaction_reference: Optional[str] = None
    paid_at: Optional[datetime] = None
    id: str = field(default_factory=_generate_id)

    def mark_paid(self, reference: str) -> None:
        self.transaction_reference = reference
        self.status = "paid"
        self.paid_at = datetime.utcnow()

    def mark_refunded(self) -> None:
        if self.status != "paid":
            raise ValueError("Only paid payments can be refunded")
        self.status = "refunded"
        self.transaction_reference = None
        self.paid_at = None


@dataclass
class RatePlan:
    """Represents a pricing strategy for a unit."""

    unit_id: str
    name: str
    base_price: float
    min_nights: int = 1
    max_nights: Optional[int] = None
    weekend_surcharge: float = 0.0
    id: str = field(default_factory=_generate_id)

    def price_for(self, check_in: date, check_out: date) -> float:
        nights = (check_out - check_in).days
        if nights < self.min_nights:
            raise ValueError("Reservation does not meet minimum night requirement")
        if self.max_nights and nights > self.max_nights:
            raise ValueError("Reservation exceeds maximum night requirement")

        total = 0.0
        current = check_in
        while current < check_out:
            total += self.base_price
            if current.weekday() >= 4:  # Friday (4), Saturday (5), Sunday (6)
                total += self.weekend_surcharge
            current += timedelta(days=1)
        return round(total, 2)


@dataclass
class InventorySnapshot:
    """Cached snapshot of unit availability for faster searching."""

    unit_id: str
    date: date
    is_available: bool
    generated_at: datetime = field(default_factory=datetime.utcnow)
    id: str = field(default_factory=_generate_id)


@dataclass
class WaitlistEntry:
    """Represents a customer waiting for availability on a sold-out unit."""

    unit_id: str
    customer_id: str
    desired_check_in: date
    desired_check_out: date
    created_at: datetime = field(default_factory=datetime.utcnow)
    notified: bool = False
    id: str = field(default_factory=_generate_id)


@dataclass
class AuditLogEntry:
    """Simple audit log describing system events."""

    event_type: str
    payload: Dict[str, str]
    created_at: datetime = field(default_factory=datetime.utcnow)
    id: str = field(default_factory=_generate_id)


__all__ = [
    "Customer",
    "Property",
    "Unit",
    "AddOn",
    "Reservation",
    "Payment",
    "RatePlan",
    "InventorySnapshot",
    "WaitlistEntry",
    "AuditLogEntry",
]
