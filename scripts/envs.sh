#!/bin/bash

envs_dirname=".envs"

echo $dirname

if [ ! -d "$envs_dirname" ]; then
  echo "not exists $envs_dirname"
  exit 1
fi

for filename in `ls -a ${envs_dirname}`; do
  if [[ "$filename" != *.local ]]; then
    continue
  fi

  env_local=$filename
  env=${env_local/".local"/""}

  if [ -e "$env_dirname/$env" ]; then
    continue
  fi

  cp $envs_dirname/$env_local $envs_dirname/$env
done

exit 0;