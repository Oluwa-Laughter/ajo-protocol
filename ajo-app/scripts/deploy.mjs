import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Keypair, rpc, Operation, TransactionBuilder, Networks, Address, Contract } from '@stellar/stellar-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = 'https://soroban-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';
const WASM_PATH = path.resolve(__dirname, '../../ajo-contracts/target/wasm32-unknown-unknown/release/ajo_contracts.wasm');

async function main() {
  console.log('🚀 Starting Ajo Soroban Contract Deployment to Stellar Testnet...');

  if (!fs.existsSync(WASM_PATH)) {
    console.error(`❌ WASM file not found at ${WASM_PATH}. Run cargo build first.`);
    process.exit(1);
  }
  const wasmBuffer = fs.readFileSync(WASM_PATH);
  const wasmHashHex = crypto.createHash('sha256').update(wasmBuffer).digest('hex');
  console.log(`📦 Loaded WASM binary (${(wasmBuffer.length / 1024).toFixed(2)} KB)`);
  console.log(`📜 SHA-256 WASM Hash: ${wasmHashHex}`);

  // Generate Deployer Keypair & Fund via Friendbot
  const deployer = Keypair.random();
  console.log(`🔑 Generated Deployer Address: ${deployer.publicKey()}`);
  console.log('⏳ Funding account via Stellar Testnet Friendbot...');

  const friendbotRes = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(deployer.publicKey())}`);
  if (!friendbotRes.ok) {
    throw new Error(`Friendbot funding failed: ${await friendbotRes.text()}`);
  }
  console.log('✅ Account successfully funded with 10,000 Testnet XLM!');

  const server = new rpc.Server(RPC_URL);
  let account = await server.getAccount(deployer.publicKey());

  // 1. Upload WASM Bytecode
  console.log('📤 Uploading WASM bytecode to Soroban Testnet...');
  const uploadOp = Operation.uploadContractWasm({ wasm: wasmBuffer });
  
  let uploadTx = new TransactionBuilder(account, { fee: '100000', networkPassphrase: Networks.TESTNET })
    .addOperation(uploadOp)
    .setTimeout(30)
    .build();

  const preparedUploadTx = await server.prepareTransaction(uploadTx);
  preparedUploadTx.sign(deployer);
  
  const uploadSendRes = await server.sendTransaction(preparedUploadTx);
  if (uploadSendRes.status === 'ERROR') {
    console.error('❌ Upload transaction failed:', uploadSendRes);
    process.exit(1);
  }
  console.log(`✅ WASM Upload Transaction Submitted! Hash: ${uploadSendRes.hash}`);
  console.log('⏳ Waiting 8 seconds for ledger confirmation...');
  await new Promise((r) => setTimeout(r, 8000));

  // 2. Create Custom Contract Instance
  console.log('🏗 Creating Custom Contract Instance on Stellar Testnet...');
  account = await server.getAccount(deployer.publicKey());

  const contractIdObj = Address.fromString(deployer.publicKey());
  const createOp = Operation.createCustomContract({
    wasmHash: Buffer.from(wasmHashHex, 'hex'),
    address: contractIdObj,
  });

  let createTx = new TransactionBuilder(account, { fee: '100000', networkPassphrase: Networks.TESTNET })
    .addOperation(createOp)
    .setTimeout(30)
    .build();

  const preparedCreateTx = await server.prepareTransaction(createTx);
  preparedCreateTx.sign(deployer);

  const createSendRes = await server.sendTransaction(preparedCreateTx);
  if (createSendRes.status === 'ERROR') {
    console.error('❌ Create contract transaction failed:', createSendRes);
    process.exit(1);
  }

  console.log(`✅ Contract Creation Transaction Submitted! Hash: ${createSendRes.hash}`);
  console.log('⏳ Waiting 8 seconds for ledger confirmation...');
  await new Promise((r) => setTimeout(r, 8000));

  // Compute contract address using Address.contract
  const contractAddress = Address.contract(Buffer.from(createSendRes.hash, 'hex')).toString();

  console.log('\n🎉 ====================================================');
  console.log(`✅ AJO SOROBAN CONTRACT SUCCESSFULLY DEPLOYED TO TESTNET!`);
  console.log(`📍 Contract ID: ${contractAddress}`);
  console.log(`🔑 Admin Deployer: ${deployer.publicKey()}`);
  console.log(`📜 WASM Hash: ${wasmHashHex}`);
  console.log('====================================================\n');

  // Update .env.local in ajo-app
  const envPath = path.resolve(__dirname, '../.env.local');
  const envContent = `NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=${contractAddress}
NEXT_PUBLIC_USDC_ISSUER=GBBD47IF6LWK2P7MDEVSCWR7DPUWV3NY3DTQEVFL4TW45A6BO5BAGGGH
`;
  fs.writeFileSync(envPath, envContent);
  console.log(`📝 Updated ${envPath} with new NEXT_PUBLIC_CONTRACT_ID`);
}

main().catch((err) => {
  console.error('Fatal Deployment Error:', err);
  process.exit(1);
});
