/*
 * Valid but not working example
 *
 * node -r esm eth-sig-verify.js {"address":"0xa44f70834a711f0df388ab016465f2eeb255ded0","msg":"Message for signing","sig":"0x6f0156091cbe912f2d5d1215cc3cd81c0963c8839b93af60e0921b61a19c54300c71006dd93f3508c432daca21db0095f4b16542782b7986f48a5d0ae3c583d401","version":"1"}
 *
 * Invalid but not working example
 *
 * node -r esm eth-sig-verify.js {"address":"0xa44f70834a711f0df388ab016465f2eeb255ded0","msg":"Tampered message","sig":"0x6f0156091cbe912f2d5d1215cc3cd81c0963c8839b93af60e0921b61a19c54300c71006dd93f3508c432daca21db0095f4b16542782b7986f48a5d0ae3c583d401","version":"1"}
 *
 * Valid working example
 *
 * node -r esm eth-sig-verify.js '{"sig":"0xd6c8f04a7d74265585359fa58f6e99daa1060f82486677b4857a54e8f74e5623119254a637420a52939a224d67f4ef9bc58e164ca3733dea75c350dea83bebe526","msg":"Tampered Message","address":"0xa44f70834a711F0DF388ab016465f2eEb255dEd0","version":1}'
 */
import { toBuffer, ecrecover, pubToAddress, toChecksumAddress, fromRpcSig, isValidSignature, hashPersonalMessage } from 'ethereumjs-util'
const a = JSON.parse(process.argv[2])

const ecsig = fromRpcSig(a.sig)

const valid = isValidSignature(
  ecsig.v,
  ecsig.r,
  ecsig.s,
  true,
  1
)

const pubkey = ecrecover(
  hashPersonalMessage(Buffer.from(a.msg)),
  ecsig.v,
  ecsig.r,
  ecsig.s,
  1
)

if (valid && toChecksumAddress(pubToAddress(pubkey).toString('hex')) == a.address) console.log('valid')
else console.log('invalid')
