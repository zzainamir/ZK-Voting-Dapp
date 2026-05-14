// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./verifier.sol";

contract AnonymousVoting is Verifier {
    mapping(bytes32 => bool) public nullifierUsed;

    uint public votesForA;
    uint public votesForB;

    
    uint8 public constant CANDIDATE_A = 0;
    uint8 public constant CANDIDATE_B = 1;

    event VoteCast(bytes32 indexed nullifierHash, uint8 candidate);

    function vote(
        bytes32 nullifierHash,
        uint[2] memory proofA,
        uint[2][2] memory proofB,
        uint[2] memory proofC,
        uint[4] memory publicInputs
    ) external {
        require(!nullifierUsed[nullifierHash], "Already voted");

        // ================= ZK VERIFICATION =================
        Proof memory proof;

        proof.a.X = proofA[0];
        proof.a.Y = proofA[1];

        proof.b.X[0] = proofB[0][0];
        proof.b.X[1] = proofB[0][1];
        proof.b.Y[0] = proofB[1][0];
        proof.b.Y[1] = proofB[1][1];

        proof.c.X = proofC[0];
        proof.c.Y = proofC[1];

        require(verifyTx(proof, publicInputs), "Invalid proof");

        // CORRECT CANDIDATE INDEX
        uint candidate = publicInputs[0];

        require(
            candidate == CANDIDATE_A || candidate == CANDIDATE_B,
            "Invalid candidate"
        );

        nullifierUsed[nullifierHash] = true;

        if (candidate == CANDIDATE_A) {
            votesForA += 1;
        } else {
            votesForB += 1;
        }

        emit VoteCast(nullifierHash, uint8(candidate));
    }

    function getResults() external view returns (uint, uint) {
        return (votesForA, votesForB);
    }
}



