# Online Reservation System

Tato ukázková aplikace implementuje komplexní rezervační systém pro správu ubytovacích kapacit.
Je postavena čistě na standardní knihovně Pythonu a poskytuje několik způsobů využití:

- JSON úložiště pro data o zákaznících, objektech, jednotkách, rezervacích a platbách
- Servisní vrstvu s obchodní logikou pro výpočet cen, ověřování dostupnosti, reporty a správu waitlistu
- HTTP API založené na `http.server`, které umožňuje správu dat přes REST rozhraní
- Příkazovou řádku pro bootstrap ukázkových dat, výpis rezervací a spuštění serveru

## Struktura

```
reservation_system/
├── api/http.py           # HTTP server a REST endpointy
├── cli.py                # Vstupní bod pro příkazovou řádku
├── models.py             # Doménové datové třídy
├── services/             # Obchodní logika (rezervace, reporty, waitlist)
├── storage.py            # JSON úložiště a bootstrap ukázkových dat
└── tests/                # Jednotkové testy v repozitáři (adresář `tests/`)
```

## Rychlý start

```bash
python -m reservation_system.cli bootstrap
python -m reservation_system.cli list
python -m reservation_system.cli serve --host 0.0.0.0 --port 8080
```

Po spuštění serveru je možné pracovat s API např. pomocí `curl`:

```bash
curl http://localhost:8080/properties
```

## Testy

Jednotkové testy pokrývají klíčové části obchodní logiky:

```bash
pytest tests/test_reservation_service.py
```
