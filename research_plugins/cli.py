"""CLI entry point for research-plugins."""

import argparse
import json
import sys
from pathlib import Path


def get_package_root() -> Path:
    return Path(__file__).parent.parent


def cmd_list(args: argparse.Namespace) -> None:
    root = get_package_root()
    skills_dir = root / "skills"
    count = 0
    for skill_md in skills_dir.rglob("SKILL.md"):
        rel = skill_md.relative_to(root)
        parts = rel.parts  # skills/{cat}/{subcat}/{name}/SKILL.md
        if len(parts) >= 4:
            print(f"  {parts[1]}/{parts[2]}/{parts[3]}")
            count += 1
    print(f"\nTotal: {count} skills")


def cmd_info(args: argparse.Namespace) -> None:
    root = get_package_root()
    catalog = root / "catalog.json"
    if catalog.exists():
        data = json.loads(catalog.read_text())
        print(json.dumps(data["counts"], indent=2))
    else:
        print("Run 'node scripts/catalog.ts' first to generate catalog.json")


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="research-plugins",
        description="Research Plugins CLI",
    )
    sub = parser.add_subparsers(dest="command")
    sub.add_parser("list", help="List all skills")
    sub.add_parser("info", help="Show catalog info")

    args = parser.parse_args()
    if args.command == "list":
        cmd_list(args)
    elif args.command == "info":
        cmd_info(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
