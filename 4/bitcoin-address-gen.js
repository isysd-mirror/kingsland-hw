import * as bitcoin from 'bitcoinjs-lib'

let keypair
let wif

if (process.argv.length > 2) {
  // generate address from wif
  // node -r esm bitcoin-address-gen.js L17YaLyqLeypMcunpw7JJsGTgjwoyfKEH1bzifjjK72YwGDu6QmH

  wif = process.argv[2]
  keypair = bitcoin.ECPair.fromWIF(wif)

  // print address
  console.log(bitcoin.payments.p2pkh({ pubkey: keypair.publicKey }).address)

} else {
  // generate rando address and output keypair details
  // node -r esm bitcoin-address-gen.js

  keypair = bitcoin.ECPair.makeRandom()
  wif = keypair.toWIF()

  console.log(`wif: ${wif}`)

  const pubkey = keypair.publicKey.toString('hex')

  console.log(`pubkey: ${pubkey}`)

  // print address
  console.log(`address: ${bitcoin.payments.p2pkh({ pubkey: keypair.publicKey }).address}`)
}
