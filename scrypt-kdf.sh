#!/bin/bash
password=$1
#password='p@$$w0rd~3'
# generate random 256 bit (32 byte) salt
salt=$(od -vN 32 -An -tx1 /dev/urandom | tr -d " \n")
#salt='7b07a2977a473e84fc30d463a2333bcfea6cb3400b16bec4e17fe981c925ba4f'
# requires node > 10.5
echo $salt
echo "require('crypto').scrypt('$password', '$salt', 32, {blockSize: 16, maxmem: 256 * 1024 * 1024}, (e, k) => {console.log(k.toString('hex'))})" | node
