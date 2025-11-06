"""Command line utilities for the reservation system."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .api.http import create_server
from .storage import ReservationStorage, bootstrap_demo_data


def _storage(path: str | None) -> ReservationStorage:
    storage_path = Path(path or "./data/reservations.json").expanduser().resolve()
    return ReservationStorage(storage_path)


def command_bootstrap(args: argparse.Namespace) -> None:
    storage = _storage(args.storage)
    bootstrap_demo_data(storage)
    print(f"Demo data written to {storage._path}")


def command_list_reservations(args: argparse.Namespace) -> None:
    storage = _storage(args.storage)
    reservations = storage.list_reservations()
    output = [reservation.__dict__ for reservation in reservations]
    print(json.dumps(output, indent=2, default=str))


def command_server(args: argparse.Namespace) -> None:
    storage = _storage(args.storage)
    bootstrap_demo_data(storage)
    server = create_server(storage._path, host=args.host, port=args.port)
    print(f"Starting server on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down server...")
        server.shutdown()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Reservation system utilities")
    parser.add_argument("--storage", help="Path to storage JSON file")

    subparsers = parser.add_subparsers(dest="command", required=True)

    bootstrap_parser = subparsers.add_parser("bootstrap", help="Create demo data")
    bootstrap_parser.set_defaults(func=command_bootstrap)

    list_parser = subparsers.add_parser("list", help="List reservations")
    list_parser.set_defaults(func=command_list_reservations)

    server_parser = subparsers.add_parser("serve", help="Start HTTP server")
    server_parser.add_argument("--host", default="127.0.0.1")
    server_parser.add_argument("--port", default=8080, type=int)
    server_parser.set_defaults(func=command_server)

    return parser


def main(argv: list[str] | None = None) -> Any:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    main()
