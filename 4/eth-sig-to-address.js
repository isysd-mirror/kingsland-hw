/*
 * broken example from exercise
 *
* node -r esm eth-sig-to-address.js {"signature":"0xacd0acd4eabd1bec05393b33b4018fa38b69eba8f16ac3d60eec9f4d2abc127e3c92939e680b91b094242af80fce6f217a34197a69d35edaf616cb0c3da4265b01","v":"0x1","r":"0xacd0acd4eabd1bec05393b33b4018fa38b69eba8f16ac3d60eec9f4d2abc127e","s":"0x3c92939e680b91b094242af80fce6f217a34197a69d35edaf616cb0c3da4265b","msg":"exercise-cryptography"}
 *
 * working example using output of eth-sig.js with chainid 1
 * node -r esm eth-sig-to-address.js '{"signature":"0x1aa0c890a17acfad5a34b467bb58e26007f2f344255356e86b351c0eaf314c094276ce55fc6e2aa9e55ad80fed203f1694c9b115c2a802e084d3a915f450ef0b25","msg":"exercise-cryptography","r":"1aa0c890a17acfad5a34b467bb58e26007f2f344255356e86b351c0eaf314c09","s":"4276ce55fc6e2aa9e55ad80fed203f1694c9b115c2a802e084d3a915f450ef0b","v":37}'
 */
import { toBuffer, ecrecover, pubToAddress, toChecksumAddress, fromRpcSig, hashPersonalMessage } from 'ethereumjs-util'
const a = JSON.parse(process.argv[2].replace(' ', ''))

const ecsig = fromRpcSig(a.signature)
const pubkey = ecrecover(
  hashPersonalMessage(Buffer.from(a.msg)),
  ecsig.v,
  ecsig.r,
  ecsig.s,
  1
)

console.log(toChecksumAddress(pubToAddress(pubkey).toString('hex')))

