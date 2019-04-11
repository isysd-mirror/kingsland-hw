// node -r esm secp256k1-sign.js 7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34
import * as elliptic from 'elliptic'
import * as CryptoJS from 'cryptojs'

const ec = new elliptic.ec('secp256k1')
let PRIVKEY

// generate or read private key
if (process.argv.length > 2) {
  PRIVKEY = ec.keyFromPrivate(process.argv[2])
} else {
  PRIVKEY = ec.genKeyPair()
}

function signData (data, privkey) {
  /*
   * Sign the data using ECDSA format and the given private key.
   */
  let keypair = ec.keyFromPrivate(privkey)
  let signature = keypair.sign(data)
  return [signature.r.toString(16), signature.s.toString(16)]
}

function decompressPublicKey (pkc) {
  /*
   * Split the string in two and use those as the parameters for the curve point.
   */
  let x = pkc.substring(0, 64)
  let y = parseInt(pkc.substring(64))
  return ec.curve.pointFromX(x, y)
}

function verifySignature (data, pubkey, sig) {
  /*
   * Get the keypair for the given public key.
   * Then use the keypair to verify the ECDSA signature matches the data.
   */
  let point = decompressPublicKey(pubkey)
  let keypair = ec.keyPair({pub: point})
  return keypair.verify(data, {r: sig[0], s: sig[1]})
}

class Transaction {
  constructor (from, to, value, fee, dateCreated, data, senderPubKey) {
    this.from = from
    this.to = to
    this.value = value
    this.fee = fee
    this.dateCreated = dateCreated
    this.data = data
    this.senderPubKey = senderPubKey
  }

  calcaulteTransactoinHash () {
    // Yo! this is not safely reproducable!
    // JSON does not guarantee things like whitespace or ordering.
    let transactionDataJSON = JSON.stringify(this)
    this.transactionHash = CryptoJS.SHA256(transactionDataJSON).toString()
  }

  sign (privkey) {
    this.senderSignature = signData(this.transactionHash, privkey)
  }

  verify () {
    return verifySignature(this.transactionHash, this.senderPubKey, this.senderSignature)
  }
}

function testClass () {
  let transaction = new Transaction('c3293572dbe6ebc60de4a20ed0e21446cae66b17', 'f51362b7351ef62253a227a77751ad9b2302f911', 25000, 10, '2018-02-10T17:53:48.972Z', 'Send to Bob', 'c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1')
  transaction.sign(PRIVKEY)
  console.log(transaction.senderSignature)
  if (transaction.verify()) {
    console.log('valid signature')
    process.exit(0)
  } else {
    console.log('invalid signature')
    process.exit(1)
  }
}

testClass()
