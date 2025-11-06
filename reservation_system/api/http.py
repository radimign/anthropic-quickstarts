"""Lightweight HTTP API exposing reservation functionality."""
from __future__ import annotations

import json
from dataclasses import asdict
from datetime import date, datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Tuple
from urllib.parse import parse_qs, urlparse

from .. import models
from ..services.reservation_service import (
    ReservationConflictError,
    ReservationService,
)
from ..storage import ReservationStorage


class JSONEncoder(json.JSONEncoder):
    def default(self, obj: Any) -> Any:  # noqa: D401 - docstring inherited
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        if hasattr(obj, "__dict__"):
            return asdict(obj)
        return super().default(obj)


def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: Dict[str, Any]) -> None:
    body = json.dumps(payload, cls=JSONEncoder).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class ReservationHandler(BaseHTTPRequestHandler):
    """HTTP request handler implementing a simple REST-ish API."""

    def __init__(self, *args, storage_path: Path, **kwargs) -> None:
        self._storage = ReservationStorage(storage_path)
        self._service = ReservationService(self._storage)
        super().__init__(*args, **kwargs)

    # Disable logging from BaseHTTPRequestHandler to keep console tidy
    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003 - part of API
        return

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _not_found(self) -> None:
        _json_response(self, HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def _bad_request(self, message: str) -> None:
        _json_response(self, HTTPStatus.BAD_REQUEST, {"error": message})

    def _parse_body(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        data = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(data.decode() or "{}")
        except json.JSONDecodeError:
            raise ValueError("Request body must be valid JSON")

    def _parse_path(self) -> Tuple[str, Dict[str, Any]]:
        parsed = urlparse(self.path)
        return parsed.path, {k: v[0] for k, v in parse_qs(parsed.query).items()}

    # ------------------------------------------------------------------
    # HTTP verbs
    # ------------------------------------------------------------------
    def do_GET(self) -> None:  # noqa: N802 - part of http.server API
        path, query = self._parse_path()
        if path == "/properties":
            _json_response(
                self,
                HTTPStatus.OK,
                {"items": [asdict(property_) for property_ in self._storage.list_properties()]},
            )
            return

        if path == "/units":
            property_id = query.get("property_id")
            units = [
                unit
                for unit in self._storage.list_units()
                if property_id in (None, unit.property_id)
            ]
            _json_response(
                self,
                HTTPStatus.OK,
                {"items": [asdict(unit) for unit in units]},
            )
            return

        if path == "/reservations":
            customer_id = query.get("customer_id")
            reservations = [
                reservation
                for reservation in self._storage.list_reservations()
                if customer_id in (None, reservation.customer_id)
            ]
            _json_response(
                self,
                HTTPStatus.OK,
                {"items": [asdict(reservation) for reservation in reservations]},
            )
            return

        if path == "/reports/occupancy":
            property_id = query.get("property_id")
            start = query.get("start")
            end = query.get("end")
            if not property_id or not start or not end:
                self._bad_request("Missing property_id, start or end parameters")
                return
            report = self._service.occupancy_report(
                property_id=property_id,
                start=date.fromisoformat(start),
                end=date.fromisoformat(end),
            )
            serialized = {
                key.isoformat(): value
                for key, value in sorted(report.items(), key=lambda item: item[0])
            }
            _json_response(self, HTTPStatus.OK, {"report": serialized})
            return

        self._not_found()

    def do_POST(self) -> None:  # noqa: N802 - part of http.server API
        path, _ = self._parse_path()
        try:
            body = self._parse_body()
        except ValueError as exc:
            self._bad_request(str(exc))
            return

        if path == "/customers":
            try:
                customer = models.Customer(
                    full_name=body["full_name"],
                    email=body["email"],
                    phone_number=body.get("phone_number"),
                )
            except (KeyError, ValueError) as exc:
                self._bad_request(str(exc))
                return
            self._storage.save_customer(customer)
            _json_response(self, HTTPStatus.CREATED, asdict(customer))
            return

        if path == "/properties":
            try:
                property_ = models.Property(
                    name=body["name"],
                    address=body["address"],
                    description=body.get("description"),
                )
            except (KeyError, ValueError) as exc:
                self._bad_request(str(exc))
                return
            self._storage.save_property(property_)
            _json_response(self, HTTPStatus.CREATED, asdict(property_))
            return

        if path == "/units":
            try:
                unit = models.Unit(
                    property_id=body["property_id"],
                    name=body["name"],
                    capacity=int(body["capacity"]),
                    price_per_night=float(body["price_per_night"]),
                    amenities=body.get("amenities", []),
                )
            except (KeyError, ValueError) as exc:
                self._bad_request(str(exc))
                return
            if not self._storage.find_property(unit.property_id):
                self._bad_request("Unknown property_id")
                return
            self._storage.save_unit(unit)
            _json_response(self, HTTPStatus.CREATED, asdict(unit))
            return

        if path == "/reservations":
            try:
                reservation = self._service.create_reservation(
                    customer_id=body["customer_id"],
                    unit_id=body["unit_id"],
                    check_in=date.fromisoformat(body["check_in"]),
                    check_out=date.fromisoformat(body["check_out"]),
                    adults=int(body["adults"]),
                    children=int(body.get("children", 0)),
                    addons=body.get("addons"),
                )
            except (KeyError, ValueError, ReservationConflictError) as exc:
                self._bad_request(str(exc))
                return
            _json_response(self, HTTPStatus.CREATED, asdict(reservation))
            return

        self._not_found()

    def do_DELETE(self) -> None:  # noqa: N802 - part of http.server API
        path, _ = self._parse_path()
        if path.startswith("/reservations/"):
            reservation_id = path.split("/")[-1]
            if not reservation_id:
                self._bad_request("Reservation ID missing in URL")
                return
            if self._service.cancel_reservation(reservation_id):
                _json_response(self, HTTPStatus.NO_CONTENT, {})
            else:
                self._not_found()
            return
        self._not_found()


def create_server(storage_path: Path, host: str = "127.0.0.1", port: int = 8080) -> ThreadingHTTPServer:
    """Create an HTTP server ready to serve API requests."""

    def handler(*args, **kwargs):  # type: ignore[no-untyped-def]
        return ReservationHandler(*args, storage_path=storage_path, **kwargs)

    return ThreadingHTTPServer((host, port), handler)
