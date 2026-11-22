import { BanknotesIcon } from "@heroicons/react/24/solid";

export const metaTxbuilderBasic = {
  link: `/apis/txbuilder/basics`,
  title: "Transaction Basics",
  desc: "Payer, outputs, metadata, validity, signing and submitting",
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
  desc: "Register, delegate, withdraw and manage a pool",
};
export const metaTxbuilderGovernance = {
  link: `/apis/txbuilder/governance`,
  title: "Governance Transactions",
  desc: "Register as a DRep, vote and submit proposals",
};
export const metaTxbuilderMigration = {
  link: `/apis/txbuilder/migration`,
  title: "Migrating to TxBuilder",
  desc: "Move from the MeshTxBuilder chain to TxBuilder parts",
};

export const linksTxbuilder = [
  metaTxbuilderBasic,
  metaTxbuilderMinting,
  metaTxbuilderSmartContract,
  metaTxbuilderStaking,
  metaTxbuilderGovernance,
  metaTxbuilderMigration,
];

export const metaTxbuilder = {
  title: "Transaction Builder",
  desc: "Build and sign Cardano transactions with automatic UTxO selection and fee calculation.",
  link: "/apis/txbuilder",
  icon: BanknotesIcon,
  items: linksTxbuilder,
};
