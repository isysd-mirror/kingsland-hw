#!/bin/bash
# first argument is message to hash
message=$1
key=$2
printf $message | openssl dgst -sha512 -hmac $2
