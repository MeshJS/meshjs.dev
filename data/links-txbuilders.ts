import { BanknotesIcon } from "@heroicons/react/24/solid";

export const metaTxbuilderBasic = {
  link: `/apis/txbuilder/basics`,
  title: "Transaction Basics",
  desc: "Working with transactions and their various options",
};
export const metaTxbuilderMinting = {
  link: `/apis/txbuilder/minting`,
  title: "Mint and Burn Assets",
  desc: "Minting and burning assets with Native Script and Plutus Script",
};
export const metaTxbuilderSmartContract = {
  link: `/apis/txbuilder/smart-contract`,
  title: "Smart Contracts",
  desc: "Transactions to work with smart contracts",
};
export const metaTxbuilderStaking = {
  link: `/apis/txbuilder/staking`,
  title: "Staking Transactions",
  desc: "Transactions for delegating ADA and managing stake pools",
};
export const metaTxbuilderGovernance = {
  link: `/apis/txbuilder/governance`,
  title: "Governance Transactions",
  desc: "Transactions for participating in Cardano's on-chain governance",
};

export const linksTxbuilder = [
  metaTxbuilderBasic,
  metaTxbuilderMinting,
  metaTxbuilderSmartContract,
  metaTxbuilderStaking,
  metaTxbuilderGovernance,
];

export const metaTxbuilder = {
  title: "Transaction Builder",
  desc: "Build and sign Cardano transactions with automatic UTXO selection and fee calculation.",
  link: "/apis/txbuilder",
  icon: BanknotesIcon,
  items: linksTxbuilder,
};
