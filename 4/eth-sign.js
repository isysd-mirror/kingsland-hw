// node -r esm eth-sign.js 97ddae0f3a25b92268175400149d65d6887b9cefaf28ea2c078e05cdc15a3c0a exercise-cryptography
import { ecrecover, ecsign, fromRpcSig, hashPersonalMessage, privateToAddress, toRpcSig, addHexPrefix } from 'ethereumjs-util'

// Cache privkey since this is just for homework. not safe!
const privkey = Buffer.from(process.argv[2], 'hex')
// Cache the message to be signed
const message = process.argv[3]
const messbuff = Buffer.from(message)

// Generate an address for the key
const addr = privateToAddress(privkey)

// hash the message
const hm = hashPersonalMessage(messbuff)

// sign the hash
const ecsig = ecsign(hm, privkey, 1)

// get merged signature for rpc and homework
const rpcsig = toRpcSig(ecsig.v, ecsig.r, ecsig.s, 1)

// print the ecdsa and merged sig, along with message
console.log({signature: rpcsig, message: message, r: ecsig.r.toString('hex'), s: ecsig.s.toString('hex'), v: ecsig.v})

