"""Single Source of Truth katalog 8 menu resmi, harga, dan alias Mie Ayam Surabaya."""

from dataclasses import dataclass
from typing import Dict, List, Optional
from app.core.config import settings


@dataclass(frozen=True)
class MenuSpec:
    """Definisi satu item menu resmi."""

    code: str
    name: str
    category: str
    price: int
    aliases: tuple[str, ...]


def get_official_menu_specs() -> tuple[MenuSpec, ...]:
    """Mengembalikan 8 item menu resmi dengan harga Air Mineral yang configurable."""
    return (
        MenuSpec(
            code="MA",
            name="Mie Ayam",
            category="Makanan",
            price=20000,
            aliases=("ma", "mie ayam", "mie ayam biasa", "mie biasa", "mie ayam original"),
        ),
        MenuSpec(
            code="MP",
            name="Mie Ayam Pangsit",
            category="Makanan",
            price=25000,
            aliases=("mp", "map", "mie pangsit", "mie ayam pangsit"),
        ),
        MenuSpec(
            code="MB",
            name="Mie Ayam Bakso",
            category="Makanan",
            price=25000,
            aliases=("mb", "mab", "mie bakso", "mie ayam bakso"),
        ),
        MenuSpec(
            code="MK",
            name="Mie Ayam Komplit",
            category="Makanan",
            price=30000,
            aliases=("mk", "mak", "komplit", "mie komplit", "mie ayam komplit"),
        ),
        MenuSpec(
            code="es teh",
            name="Es Teh",
            category="Minuman",
            price=5000,
            aliases=("es teh", "esteh", "es teh manis"),
        ),
        MenuSpec(
            code="teh hangat",
            name="Teh Hangat",
            category="Minuman",
            price=5000,
            aliases=("teh hangat", "teh", "teh panas"),
        ),
        MenuSpec(
            code="es teler",
            name="Es Teler",
            category="Minuman",
            price=20000,
            aliases=("es teler", "esteler", "teler", "es teler istimewa"),
        ),
        MenuSpec(
            code="air mineral",
            name="Air Mineral",
            category="Minuman",
            price=int(settings.AIR_MINERAL_PRICE),
            aliases=("air mineral", "mineral", "aqua"),
        ),
    )


def get_menu_catalog() -> Dict[str, Dict]:
    """Mengembalikan mapping kode standar -> detail menu resmi."""
    return {
        item.code: {
            "code": item.code,
            "name": item.name,
            "category": item.category,
            "price": item.price,
            "aliases": list(item.aliases),
        }
        for item in get_official_menu_specs()
    }


def get_alias_index() -> Dict[str, MenuSpec]:
    """Membangun index lookup cepat dari alias ternormalisasi -> MenuSpec."""
    index: Dict[str, MenuSpec] = {}
    for item in get_official_menu_specs():
        index[item.code.lower()] = item
        index[item.name.lower()] = item
        for alias in item.aliases:
            index[alias.lower()] = item
    return index


def lookup_menu_by_code_or_name(key: str) -> Optional[MenuSpec]:
    """Mencari MenuSpec secara exact dari kode atau alias ternormalisasi."""
    if not key:
        return None
    return get_alias_index().get(key.strip().lower())


def get_prompt_catalog_text() -> str:
    """Format daftar menu dan harga resmi untuk prompt text-only Gemini."""
    lines: List[str] = []
    for item in get_official_menu_specs():
        alias_str = ", ".join(item.aliases)
        lines.append(
            f"- Kode: `{item.code}` | Nama Resmi: {item.name} | Kategori: {item.category} "
            f"| Harga: Rp{item.price:,} | Alias: {alias_str}"
        )
    return "\n".join(lines)
