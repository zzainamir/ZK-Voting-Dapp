console.log("app.js loaded!");

let voterID = null;
let lastProofData = null;

// ================== ETHERS (Hardhat + ethers v5) ==================
const provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545"
);
const signer = provider.getSigner(0);


const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ABI MUST MATCH UPDATED CONTRACT
const contractABI = [
  "function vote(bytes32,uint256[2],uint256[2][2],uint256[2],uint256[4])",
  "function votesForA() view returns (uint256)",
  "function votesForB() view returns (uint256)"
];

const votingContract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

// ================== SIGNUP ==================
document.getElementById("signupBtn").onclick = async () => {
  try {
    document.getElementById("signupBtn").disabled = true;

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST"
    });

    const data = await res.json();

    voterID = data.voterID;

    document.getElementById("voterID").innerText = data.voterID;
    document.getElementById("voterSecret").innerText = data.secret;

    document.getElementById("voteSection").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Signup failed");
  } finally {
    document.getElementById("signupBtn").disabled = false;
  }
};

// ================== GENERATE PROOF ==================
document.getElementById("generateProofBtn").onclick = async () => {
  const selected = document.querySelector(
    'input[name="candidate"]:checked'
  );

  if (!selected) {
    alert("Please select a candidate first.");
    return;
  }

  const candidate = parseInt(selected.value, 10);
  const btn = document.getElementById("generateProofBtn");

  try {
    btn.disabled = true;

    document.getElementById("proofBox").innerText =
      "Generating zero-knowledge proof...\nThis may take a few seconds.";

    const res = await fetch("http://localhost:3000/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterID, candidate })
    });

    const proofData = await res.json();

    if (proofData.error) {
      alert(proofData.error);
      return;
    }

    lastProofData = proofData;

    document.getElementById("proofBox").innerText =
      JSON.stringify(proofData, null, 2);

    document.getElementById("proofSection").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Proof generation failed");
  } finally {
    btn.disabled = false;
  }
};

// ================== SUBMIT VOTE ==================
document.getElementById("submitVoteBtn").onclick = async () => {
  if (!lastProofData) {
    alert("No proof available to submit.");
    return;
  }

  const btn = document.getElementById("submitVoteBtn");
  btn.disabled = true;

  const { proof, publicInputs } = lastProofData;

  // Ensure all inputs are strings
  const inputs = publicInputs.map(String);

  // nullifierHash = publicInputs[1]
  const nullifierHash = ethers.utils.hexZeroPad(
    ethers.BigNumber.from(inputs[1]).toHexString(),
    32
  );

  try {
    const tx = await votingContract.vote(
      nullifierHash,
      proof.a.map(String),
      [
        proof.b[0].map(String),
        proof.b[1].map(String)
      ],
      proof.c.map(String),
      inputs
    );

    await tx.wait();
    alert("Vote submitted successfully!");
  } catch (err) {
    console.error(err);
    alert("Contract call failed");
  } finally {
    btn.disabled = false;
  }
};

// ================== GET RESULTS ==================
document.getElementById("getResultsBtn").onclick = async () => {
  try {
    const a = await votingContract.votesForA();
    const b = await votingContract.votesForB();

    document.getElementById("votesA").innerText = a.toString();
    document.getElementById("votesB").innerText = b.toString();
  } catch (err) {
    console.error(err);
    alert("Failed to fetch results");
  }
};


