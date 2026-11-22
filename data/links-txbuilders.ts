import { BanknotesIcon } from "@heroicons/react/24/solid";

export const metaTxbuilderBasic = {
  link: `/apis/txbuilder/basics`,
  title: "Transaction Basics",
  desc: "Payer, outputs, metadata, required signers and errors",
};
export const metaTxbuilderSigning = {
  link: `/apis/txbuilder/signing`,
  title: "Signing and Submitting",
  desc: "Wallets, keys, your own signer, and safe retries",
};
export const metaTxbuilderUtxos = {
  link: `/apis/txbuilder/utxos`,
  title: "UTxOs and Inputs",
  desc: "Give, limit and chain UTxOs, and set collateral",
};
export const metaTxbuilderTime = {
  link: `/apis/txbuilder/time`,
  title: "Time and Validity",
  desc: "Expiry, start time, slots and devnet clocks",
};
export const metaTxbuilderMinting = {
  link: `/apis/txbuilder/minting`,
  title: "Mint and Burn Assets",
  desc: "Mint and burn assets with native and Plutus scripts",
};
export const metaTxbuilderSmartContract = {
  link: `/apis/txbuilder/smart-contracts`,
  title: "Smart Contracts",
  desc: "Lock, spend and read outputs at a script address",
};
export const metaTxbuilderStaking = {
  link: `/apis/txbuilder/staking`,
  title: "Staking Transactions",
  desc: "Register, delegate, withdraw rewards and run a pool",
};
export const metaTxbuilderGovernance = {
  link: `/apis/txbuilder/governance`,
  title: "Governance Transactions",
  desc: "Register as a DRep, vote and submit proposals",
};
export const metaTxbuilderCertificates = {
  link: `/apis/txbuilder/certificates`,
  title: "Certificates",
  desc: "Every certificate: deposits, signers, scripts and legacy forms",
};
export const metaTxbuilderPlans = {
  link: `/apis/txbuilder/plans`,
  title: "Plans",
  desc: "Send transactions in order, built once, never rebuilt",
};
export const metaTxbuilderServers = {
  link: `/apis/txbuilder/servers`,
  title: "Servers and Storage",
  desc: "Record plans so a server can restart and resume",
};
export const metaTxbuilderOffline = {
  link: `/apis/txbuilder/offline`,
  title: "Offline and CBOR",
  desc: "Build without a provider and work with CBOR",
};
export const metaTxbuilderTesting = {
  link: `/apis/txbuilder/testing`,
  title: "Testing on the Emulator",
  desc: "Test builds, plans and scripts on a local ledger",
};
export const metaTxbuilderNetworks = {
  link: `/apis/txbuilder/networks`,
  title: "Providers and Networks",
  desc: "Choose the network and see what a provider must give",
};
export const metaTxbuilderOptions = {
  link: `/apis/txbuilder/options`,
  title: "Options",
  desc: "Every option of TxBuilder, build() and plan()",
};
export const metaTxbuilderErrors = {
  link: `/apis/txbuilder/errors`,
  title: "Errors",
  desc: "Error codes by when they come, retries and warnings",
};
export const metaTxbuilderMigration = {
  link: `/apis/txbuilder/migration`,
  title: "Migrating to TxBuilder",
  desc: "Move from the MeshTxBuilder chain to TxBuilder parts",
};

export const linksTxbuilder = [
  metaTxbuilderBasic,
  metaTxbuilderSigning,
  metaTxbuilderUtxos,
  metaTxbuilderTime,
  metaTxbuilderMinting,
  metaTxbuilderSmartContract,
  metaTxbuilderStaking,
  metaTxbuilderGovernance,
  metaTxbuilderCertificates,
  metaTxbuilderPlans,
  metaTxbuilderServers,
  metaTxbuilderOffline,
  metaTxbuilderTesting,
  metaTxbuilderNetworks,
  metaTxbuilderOptions,
  metaTxbuilderErrors,
  metaTxbuilderMigration,
];

export const metaTxbuilder = {
  title: "Transaction Builder",
  desc: "Build and sign Cardano transactions with automatic UTxO selection and fee calculation.",
  link: "/apis/txbuilder",
  icon: BanknotesIcon,
  items: linksTxbuilder,
};
