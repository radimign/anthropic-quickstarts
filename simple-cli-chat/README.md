# Simple CLI Chat

Tento minimalistický příklad ukazuje, jak rychle spustit konverzační aplikaci v příkazové řádce s využitím API Anthropic. Stačí nastavit API klíč a můžete okamžitě začít chatovat s Claude.

## Požadavky

- Python 3.9 nebo novější
- Účet u Anthropic a platný `ANTHROPIC_API_KEY`

## Instalace

1. Přejděte do složky projektu a vytvořte si virtuální prostředí (doporučeno):
   ```bash
   cd simple-cli-chat
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Nainstalujte závislosti:
   ```bash
   pip install -r requirements.txt
   ```

## Konfigurace

Nastavte proměnnou prostředí s API klíčem:

```bash
export ANTHROPIC_API_KEY="vás-api-klic"
```

## Spuštění

Aplikaci spustíte příkazem:

```bash
python main.py
```

Poté můžete psát zprávy. Zadejte `konec`, `exit` nebo `quit`, pokud chcete konverzaci ukončit.

## Poznámky

- Výchozí model je `claude-3-sonnet-20240229`, ale můžete jej změnit úpravou souboru `main.py`.
- V ukázce se uchovává kontext konverzace, takže Claude navazuje na předchozí zprávy.
- Pokud nechcete, aby se příkazy ukládaly do historie shellu, použijte `env ANTHROPIC_API_KEY=... python main.py`.
