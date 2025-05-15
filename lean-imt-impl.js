import { LeanIMT } from "@zk-kit/lean-imt";
import { poseidon1, poseidon2 } from "poseidon-lite";

const addrArr = [
  "0x8D9e68f9E17B5222aa77fBb7AAeA064e53DC413e",
  "0x3D4ca351745cbe02545Ee51B80f969BA66FDD41a",
];

const leaves = addrArr.map((addr) => {
  const addrBigInt = BigInt(addr);

  return poseidon1([addrBigInt]);
});

// Hash function used to compute the tree nodes.
const hash = (a, b) => poseidon2([a, b]);

// To create an instance of a LeanIMT, you must provide the hash function.
const tree = new LeanIMT(hash, leaves);

console.log(tree);
console.log(
  tree.indexOf(
    12054259723858575797700686642369837165089215532124031976432531870947307946530n
  )
);
console.log(
  tree.has(
    12054259723858575797700686642369837165089215532124031976432531870947307946530n
  )
);
console.log(tree.generateProof(0));

const proof1 = {
  root: 2761049986313742260534483357993809294428142740570049246735456492460067352291n,
  leaf: 12054259723858575797700686642369837165089215532124031976432531870947307946530n,
  index: 0,
  siblings: [
    18662699083581515132053402159012902122836088572548263913977277506910134734312n,
  ],
};

console.log(tree.verifyProof(proof1));
