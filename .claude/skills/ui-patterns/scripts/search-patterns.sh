#!/bin/bash
# search-patterns.sh — Search index.yaml by keyword
# Usage: ./search-patterns.sh <keyword>
# Returns: matching pattern IDs, names, categories, and file paths

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INDEX="$SCRIPT_DIR/../index.yaml"

if [ -z "$1" ]; then
  echo "Usage: $0 <keyword>"
  echo "Example: $0 stat"
  exit 1
fi

KEYWORD="$1"

if [ ! -f "$INDEX" ]; then
  echo "Error: index.yaml not found at $INDEX"
  exit 1
fi

# Check if there are any patterns
PATTERN_COUNT=$(grep -c "^  - id:" "$INDEX" 2>/dev/null || echo "0")

if [ "$PATTERN_COUNT" -eq 0 ]; then
  echo "Pattern directory is empty. No patterns to search."
  echo "Add patterns via the ui-patterns skill intake flow."
  exit 0
fi

# Search for keyword in tags, name, or category fields
echo "Searching for: $KEYWORD"
echo "---"

# Simple grep approach — works for small-to-medium index files
# For large indexes (1000+ patterns), consider using yq or python
grep -i "$KEYWORD" "$INDEX" | grep -E "(id:|name:|category:|file:)" | while read -r line; do
  echo "$line"
done

echo "---"
echo "Found in index. Open matched pattern files for full details."
