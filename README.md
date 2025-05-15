# Lean IMT Implementation

This project implements a Lean Incremental Merkle Tree (IMT) using the zk-kit repository and Poseidon hashing for address verification.

## Project Structure

```
lean-imt-implementation/
├── package.json
├── poseidon-hash.js
```

## Dependencies

- `@zk-kit/lean-imt`: ^2.2.3 - For implementing the Lean Incremental Merkle Tree
- `poseidon-lite`: ^0.3.0 - For Poseidon hashing functionality

## Implementation Details

### Address to BigInt Conversion

Ethereum addresses are converted to BigInts for processing in the following way:

1. **Input Format**: Ethereum addresses are 20-byte (40 hexadecimal characters) strings prefixed with "0x"

   ```
   "0x1234567890123456789012345678901234567890"
   ```

2. **Conversion Process**:

   - The "0x" prefix is automatically handled by JavaScript's BigInt constructor
   - The hexadecimal string is interpreted as a base-16 number
   - The resulting BigInt represents the full 160-bit address value

3. **Example Conversion**:

   ```javascript
   const address = "0x1234567890123456789012345678901234567890";
   const addrBigInt = BigInt(address);
   // Result: 1024000000000000000000000000000000000000000n
   ```

4. **Technical Details**:
   - The conversion preserves the full precision of the 160-bit address
   - No information is lost during the conversion
   - The resulting BigInt can be used directly in cryptographic operations

### Poseidon Hashing Process

The Poseidon hash function is used to create a unique, fixed-size output from the Ethereum address. Here's how it works:

1. **Input Processing**:

   ```javascript
   const addrBigInt = BigInt("0x1234567890123456789012345678901234567890");
   // The BigInt is wrapped in an array for poseidon1
   const input = [addrBigInt];
   ```

2. **Poseidon Hash Function**:

   - Uses a sponge construction with a permutation function
   - Operates in a prime field (typically modulo a large prime number)
   - The `poseidon1` function specifically:
     - Takes a single input element (our address BigInt)
     - Applies multiple rounds of permutation
     - Returns a field element (BigInt) as the hash

3. **Mathematical Process**:

   ```
   Input: addrBigInt (160-bit number)
   ↓
   Field Conversion: Convert to field element
   ↓
   Sponge Construction:
   - Absorb phase: Input is absorbed into the state
   - Squeeze phase: Output is generated
   ↓
   Output: 254-bit field element (BigInt)
   ```

4. **Example Transformation**:

   ```javascript
   // Input address
   "0x1234567890123456789012345678901234567890"
   ↓
   // After BigInt conversion
   1024000000000000000000000000000000000000000n
   ↓
   // After Poseidon hash
   17578451688153592243665544943166864774110935098556317990090955166786600652876n
   ```

5. **Why Poseidon?**:
   - Optimized for zero-knowledge proof systems
   - Efficient in arithmetic circuits
   - Provides strong cryptographic security
   - Output is compatible with zk-SNARK protocols

### Poseidon Hashing (poseidon-hash.js)

This module implements address hashing using the Poseidon hash function, which is particularly well-suited for zero-knowledge proofs.

#### Input

```javascript
const addrArr = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
];
```

#### Output

```javascript
[
  17578451688153592243665544943166864774110935098556317990090955166786600652876n,
  21043194320637847926985000857322487303577637983967681822716507214805708212882n,
  6253171294233830945797870460019964345173340303434885033978605918856955573454n,
];
```

#### How it works

1. Takes an array of Ethereum addresses
2. Converts each address to a BigInt
3. Applies the Poseidon hash function to each address
4. Returns an array of hashed values as BigInts

## Usage

1. Install dependencies:

```bash
npm install
```

2. Run the Poseidon hashing example:

```bash
node poseidon-hash.js
```

## Verify a Proof Example

```javascript
import { poseidon1 } from "poseidon-lite";

const addrArr = [
  "0x8D9e68f9E17B5222aa77fBb7AAeA064e53DC413e",
  "0x3D4ca351745cbe02545Ee51B80f969BA66FDD41a",
  "0xccEb7C459eE01bb4EF952B11fcD1F6fD5c0fD82F",
  "0xFB7126e470A9ee840dDE6D79F1288BCBF6469Bec",
  "0x25941dC771bB64514Fc8abBce970307Fb9d477e9",
  "0x23531E4471A7b00bab9Eb1a9d4110c42347AA3f8",
  "0x34c8F15A1EDA5866cCD3691892299817F8F76178",
];

// create leaves from array of addresses
const leaves = addrArr.map((addr) => {
  const addrBigInt = BigInt(addr);
  return poseidon1([addrBigInt]);
});

/* Output:
leaves =
[
  84323531924087938411606892374143252317847702116823359817340060257157521103n,
  1928555040269776337019527361600830396672047411266326305279355799039062635918n,
  14896678562227846926035183435832341426461656669957925298005963468490173975546n,
  21147815564025509079099397027785622564465213655888548785926744406631903929822n,
  17482021471675495101237084517865173060144002967824755291888514730621888066281n,
  2054220180167263657899489396694880273062812098272424919076997394501499589490n,
  6289636076483596341661392944291726906607111640373990132644535085020545391859n
]
*/

// Hash function used to compute the tree nodes.
const hash = (a, b) => poseidon2([a, b]);

// To create an instance of a LeanIMT, you must provide the hash function.
const tree = new LeanIMT(hash, leaves);

/* Output of tree object:
LeanIMT {
  _nodes: [
    [
      84323531924087938411606892374143252317847702116823359817340060257157521103n,
      1928555040269776337019527361600830396672047411266326305279355799039062635918n,
      14896678562227846926035183435832341426461656669957925298005963468490173975546n,
      21147815564025509079099397027785622564465213655888548785926744406631903929822n,
      17482021471675495101237084517865173060144002967824755291888514730621888066281n,
      2054220180167263657899489396694880273062812098272424919076997394501499589490n,
      6289636076483596341661392944291726906607111640373990132644535085020545391859n
    ],
    [
      4246323578213067594010191527183051960266125765430141077690298023191182817366n,
      21479780013679775985103376540555077863265788970764668544692584425383716516597n,
      5803674321476970073603198009991172429289834009520972947325055576869551490176n,
      6289636076483596341661392944291726906607111640373990132644535085020545391859n
    ],
    [
      3715082019088909119412291294567857709374409494339175374010393581880677519959n,
      12876776345669866027730027561215304650967697889832689890989409130112416560352n
    ],
    [
      14399877305156729065299144764623667981314822471746316339735508494966128709093n
    ]
  ],
  _hash: [Function: hash]
}
*/
tree.generateProof(0);

/*Output of proof object at index 0:
index: 0,
  siblings: [
    1928555040269776337019527361600830396672047411266326305279355799039062635918n,
    21479780013679775985103376540555077863265788970764668544692584425383716516597n,
    12876776345669866027730027561215304650967697889832689890989409130112416560352n
  ]
*/
```

3. Verify the proof

```javascript

tree.verifyProof(proof1);

 /**
     * It verifies a {@link LeanIMTMerkleProof} to confirm that a leaf indeed
     * belongs to a tree.
     * @param proof The Merkle tree proof.
     * @returns True if the leaf is part of the tree, and false otherwise.
 */
    public static verifyProof<N>(proof: LeanIMTMerkleProof<N>, hash: LeanIMTHashFunction<N>): boolean {
        requireDefined(proof, "proof")

        const { root, leaf, siblings, index } = proof

        requireDefined(proof.root, "proof.root")
        requireDefined(proof.leaf, "proof.leaf")
        requireDefined(proof.siblings, "proof.siblings")
        requireDefined(proof.index, "proof.index")

        requireArray(proof.siblings, "proof.siblings")
        requireNumber(proof.index, "proof.index")

        let node = leaf

        for (let i = 0; i < siblings.length; i += 1) {
            if ((index >> i) & 1) {
                node = hash(siblings[i], node)
            } else {
                node = hash(node, siblings[i])
            }
        }

        return root === node
    }
```

#### How verify proof works

```javascript
let node = leaf;

for (let i = 0; i < siblings.length; i += 1) {
  if ((index >> i) & 1) {
    node = hash(siblings[i], node); // current node is on the right
  } else {
    node = hash(node, siblings[i]); // current node is on the left
  }
}

return root === node;
```

This loop:

Rebuilds the hash path from the leaf to the root.

Uses the index to determine the node’s position (left/right) at each level.

At each level, it merges the current node with its sibling using the Merkle hash function (poseidon2).

## Notes

- The Poseidon hash function is particularly efficient for zero-knowledge proofs
- All hashed values are returned as BigInts to maintain precision
- The implementation uses the `poseidon-lite` package for optimized hashing
- Address conversion to BigInt preserves the full 160-bit precision of Ethereum addresses
- The Poseidon hash output is a 254-bit field element, suitable for zk-SNARK protocols
- The Lean IMT implementation provides efficient proof generation and verification
- All tree operations maintain the zero-knowledge properties of the system

## License

ISC

## Author

anthony-spedaliere
