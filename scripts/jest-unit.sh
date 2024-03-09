# !/bin/bash

app="$1"
args=("$@")

cmd="npx jest --config ./apps/$app/test/jest.json"

for i in "${!args[@]}"; do
  if (( i == 0 )); then
    continue
  fi

  opt="${args[i]}"

  if [ "$opt" == "--watch" ]; then
    cmd="$cmd $opt apps/$app"
  else
    cmd="$cmd $opt"
  fi
done

node ./scripts/jest.mjs

eval "$cmd"

exit 0