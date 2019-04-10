// node -r esm escp256k1-key.js ed512a493cc8bdd0e5d1c31fe39fd6ddb9a045ab57fb1e9aa50000d767795c2d
import * as elliptic from 'elliptic'
import * as ripemd160 from 'ripemd160'
const RIPEMD160 = ripemd160.default

const ec = new elliptic.ec('secp256k1')
let keypair

// generate or read private key
if (process.argv.length > 2) {
  keypair = ec.keyFromPrivate(process.argv[2]);
  console.log(new RIPEMD160().update(keypair.getPublic('hex')).digest('hex'))
} else {
  keypair = ec.genKeyPair();
  console.log(keypair.getPrivate("hex"))
  console.log(keypair.getPublic("hex"))
  console.log(keypair.getPublic().encodeCompressed('hex'))
  console.log(new RIPEMD160().update(keypair.getPublic('hex')).digest('hex'))
}
