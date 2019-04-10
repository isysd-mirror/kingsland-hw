/*
 * broken example from exercise
 *
 * node -r esm eth-sig-verify.js 0xa44f70834a711F0DF388ab016465f2eEb255dEd0 acd0acd4eabd1bec05393b33b4018fa38b69eba8f16ac3d60eec9f4d2abc127e3c92939e680b91b094242af80fce6f217a34197a69d35edaf616cb0c3da4265b01 exercise-cryptography
 *
 * working example using output of eth-sig.js with chainid 1
 * node -r esm eth-sig-verify.js 0xa44f70834a711F0DF388ab016465f2eEb255dEd0 0x1aa0c890a17acfad5a34b467bb58e26007f2f344255356e86b351c0eaf314c094276ce55fc6e2aa9e55ad80fed203f1694c9b115c2a802e084d3a915f450ef0b25 exercise-cryptography
 */
import { toBuffer, ecrecover, pubToAddress, toChecksumAddress, fromRpcSig, isValidSignature, hashPersonalMessage } from 'ethereumjs-util'
const address = process.argv[2]
const signature = process.argv[3]
// add checksum 0 padding if not present
if (!signature.startsWith('0x')) signature = '0x' + signature
const message = process.argv[4]

const ecsig = fromRpcSig(signature)

const valid = isValidSignature(
//  hashPersonalMessage(Buffer.from(a.msg)),
  ecsig.v,
  ecsig.r,
  ecsig.s,
  true,
  1
)

if (valid) console.log('valid')
else console.log('invalid')