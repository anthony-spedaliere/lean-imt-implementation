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
    84323531924087938411606892374143252317847702116823359817340060257157521103n
  )
);
console.log(
  tree.has(
    84323531924087938411606892374143252317847702116823359817340060257157521103n
  )
);
console.log(tree.generateProof(0));

const proof1 = {
  root: 4246323578213067594010191527183051960266125765430141077690298023191182817366n,
  leaf: 84323531924087938411606892374143252317847702116823359817340060257157521103n,
  index: 0,
  siblings: [
    1928555040269776337019527361600830396672047411266326305279355799039062635918n,
  ],
};

console.log(tree.verifyProof(proof1));
