#!/bin/bash
# hmac.sh blockchain devcamp
# first argument is message to hash
message=$1
# second argument is the key
key=$2
printf $message | openssl dgst -sha512 -hmac $2 | grep -o "[a-f0-9]*$"
