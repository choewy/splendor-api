# !/bin/bash

args=("$@")
cmd="npx jest --config ./apps/$1/test/jest-e2e.json"

for i in "${!args[@]}"; do
  if (( i == 0 )); then
    continue
  fi

  opt="${args[i]}"
  cmd="$cmd $opt"
done

node ./scripts/jest.mjs

eval "$cmd"

exit 0