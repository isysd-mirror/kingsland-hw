#!/bin/bash
#password=$1
password='p@$$w0rd~3'
#message=$2
message='exercise-cryptography'

# pkcs7 pad the message
pkcs7message=$(echo "console.log(Buffer.from(require('pkcs7').pad(Buffer.from('$message'))).toString('utf8'))" | node)

# generate random 256 bit (32 byte) salt
#salt=$(od -vN 64 -An -tx1 /dev/urandom | tr -d " \n")
salt='7b07a2977a473e84fc30d463a2333bcfea6cb3400b16bec4e17fe981c925ba4f'

# generate random 256 bit iv
#iv=$(od -vN 32 -An -tx1 /dev/urandom | tr -d " \n")
iv="433e0d8557a800a40c1d3b54f6636ff5"

# requires node > 10.5
dkey=$(echo "require('crypto').scrypt('$password', '$salt', 64, {blockSize: 16, maxmem: 256 * 1024 * 1024}, (e, k) => {console.log(k.toString('hex'))})" | node)
ekey=${dkey:0:64}
hkey=${dkey:64:64}

# aes encrypt
cipher=$(echo -n $pkcs7message | openssl enc -e -aes-256-cbc -K $ekey -iv $iv -nopad -out /tmp/message.enc)
hexcipher=$(echo $cipher | xxd -ps -c 80 /tmp/message.enc)
#cipher=$(printf "var cipher = require('crypto').createCipheriv('aes-256-cbc', Buffer.from('$ekey', 'hex'), Buffer.from('$iv', 'hex')); console.log(cipher.update(\`$message\`, 'utf8', 'hex') + cipher.final('hex'));" | node)

# >:-( y u no match example?

# generate hmac using sha256
hmac=$(printf $message | openssl dgst -sha256 -hmac $hkey | grep -o "[a-f0-9]*$")
echo "console.log(JSON.stringify({'scrypt': {'dklen': 64, 'salt': '$salt', 'n': 16384, 'r': 16, 'p': 1}, 'aes': \`$hexcipher\`, 'iv': '$iv', 'mac': '$hmac'}, null, '\t'))" | node

# begin decryption process. Pretend loading json because laziness.

# skip recalculating hmac... it is exactly the same as ^^^

# decrypt
dmessage=$(openssl enc -d -aes-256-cbc -K $ekey -iv $iv -nopad -in /tmp/message.enc)

# unpad
checkmessage=$(echo "console.log(Buffer.from(require('pkcs7').unpad(Buffer.from('$dmessage'))).toString('utf8'))" | node)

if [ "$checkmessage" == "$message" ]; then
  echo "Decrypted message matched!";
  exit 0;
else
  echo "Decrypted message did not match..."
  exit 1
fi