#!/bin/sh
# Formats each file the agent edits so it never needs a separate formatting pass.
file=$(jq -r '.file_path // empty')
root=$(pwd)

case "$file" in
  "$root"/*) ;;
  *) echo '{}'; exit 0 ;;
esac

if [ -f "$file" ] && [ -x node_modules/.bin/prettier ]; then
  node_modules/.bin/prettier --write --ignore-unknown --log-level silent "$file" >/dev/null 2>&1
fi

echo '{}'
exit 0
