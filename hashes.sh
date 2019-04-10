#!/bin/bash
# first argument is message to hash
message=$1
printf $message | sha384sum
printf $message | sha512sum
printf $message | sha3sum -a 512
echo "console.log(require('keccak')('keccak512').update('$message').digest().toString('hex'))" | node
printf $message | whirlpooldeep
