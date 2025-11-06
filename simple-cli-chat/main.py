"""Jednoduchá konverzační aplikace pro příkazovou řádku.

Skript otevře relaci s modelem Claude a umožní vést dialog v reálném čase.
"""

import os
import sys
from typing import List, Dict

from anthropic import Anthropic, APIError
from dotenv import load_dotenv

SYSTEM_MESSAGE = "Jsi přívětivý a nápomocný asistent." 
MODEL_NAME = "claude-3-sonnet-20240229"
MAX_TOKENS = 512


def read_api_key() -> str:
    """Vrátí API klíč načtený z proměnné prostředí."""
    load_dotenv()
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Nebyl nalezen ANTHROPIC_API_KEY. Nastavte proměnnou prostředí nebo přidejte hodnotu do .env souboru."
        )
    return api_key


def create_client() -> Anthropic:
    """Inicializuje klienta Anthropic."""
    api_key = read_api_key()
    return Anthropic(api_key=api_key)


def render_assistant_response(text: str) -> None:
    """Vypíše odpověď asistenta s jednoduchým formátováním."""
    print("\nClaude:\n------")
    print(text)
    print("------\n")


def main() -> None:
    print("Vítejte v ukázkové CLI aplikaci pro chat s Claude. Napište zprávu a potvrďte Enterem.")
    print("Zadejte 'konec', 'quit' nebo 'exit' pro ukončení.\n")

    try:
        client = create_client()
    except RuntimeError as exc:
        print(exc)
        sys.exit(1)

    conversation: List[Dict[str, str]] = []

    while True:
        try:
            user_message = input("Vy: ")
        except (EOFError, KeyboardInterrupt):
            print("\nUkončuji...")
            break

        if user_message.strip().lower() in {"konec", "quit", "exit"}:
            print("Na shledanou!")
            break

        conversation.append({"role": "user", "content": user_message})

        try:
            response = client.messages.create(
                model=MODEL_NAME,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_MESSAGE,
                messages=conversation,
            )
        except APIError as error:
            print(f"Došlo k chybě API: {error}")
            conversation.pop()
            continue

        text_segments = [segment.text for segment in response.content if hasattr(segment, "text")]
        reply_text = "\n".join(text_segments).strip()
        if not reply_text:
            reply_text = "(Model nevrátil žádný text.)"

        render_assistant_response(reply_text)
        conversation.append({"role": "assistant", "content": reply_text})


if __name__ == "__main__":
    main()
