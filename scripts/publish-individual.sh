#!/usr/bin/env bash
# publish-individual.sh — Publish a single skill as a standalone npm package
#
# Usage: ./scripts/publish-individual.sh <skill-path> [--dry-run]
#
# Example:
#   ./scripts/publish-individual.sh skills/literature/search/arxiv-api --dry-run
#   ./scripts/publish-individual.sh skills/analysis/econometrics/stata-regression

set -euo pipefail

SKILL_PATH="${1:-}"
DRY_RUN="${2:-}"

if [ -z "$SKILL_PATH" ]; then
  echo "Usage: ./scripts/publish-individual.sh <skill-path> [--dry-run]"
  echo ""
  echo "Publishes a single skill directory as @wentorai/<skill-name> on npm."
  echo "The skill must have a valid SKILL.md with frontmatter."
  exit 1
fi

# Validate skill exists
if [ ! -f "$SKILL_PATH/SKILL.md" ]; then
  echo "Error: $SKILL_PATH/SKILL.md not found"
  exit 1
fi

# Extract skill name from frontmatter
SKILL_NAME=$(head -20 "$SKILL_PATH/SKILL.md" | grep "^name:" | sed 's/name: *//' | tr -d '"' | tr -d "'")
if [ -z "$SKILL_NAME" ]; then
  echo "Error: Could not extract skill name from frontmatter"
  exit 1
fi

echo "Publishing skill: $SKILL_NAME"
echo "Source: $SKILL_PATH"

# Create temp package directory
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

cp -r "$SKILL_PATH"/* "$TMPDIR/"

# Generate minimal package.json
cat > "$TMPDIR/package.json" <<PKGJSON
{
  "name": "@wentorai/$SKILL_NAME",
  "version": "1.0.0",
  "description": "Academic research skill: $SKILL_NAME",
  "files": ["SKILL.md"],
  "keywords": ["agent-skills", "openclaw", "academic", "research"],
  "license": "MIT",
  "homepage": "https://github.com/wentorai/research-plugins",
  "repository": {
    "type": "git",
    "url": "https://github.com/wentorai/research-plugins",
    "directory": "$SKILL_PATH"
  }
}
PKGJSON

cd "$TMPDIR"

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "[dry-run] npm pack:"
  npm pack --dry-run 2>&1
else
  npm publish --access public
  echo "Published @wentorai/$SKILL_NAME@1.0.0"
fi
