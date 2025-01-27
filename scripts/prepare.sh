#!/bin/bash

if [ ! -e ".env" ]; then cp .env.temp .env; fi
if npm ls husky > /dev/null 2>&1; then husky; fi
