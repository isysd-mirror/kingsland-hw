#!/bin/bash
# hashes.sh blockchain
# first argument is message to hash
message=$1
printf $message | sha384sum | grep -o "^[a-f0-9]*"
printf $message | sha512sum | grep -o "^[a-f0-9]*"
printf $message | sha3sum -a 512 | grep -o "^[a-f0-9]*"
echo "console.log(require('keccak')('keccak512').update('$message').digest().toString('hex'))" | node
printf $message | whirlpooldeep
