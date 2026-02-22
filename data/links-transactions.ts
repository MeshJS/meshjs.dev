import { BanknotesIcon } from "@heroicons/react/24/solid";

export const metaTransactionBasic = {
  link: `/apis/txbuilder/basics`,
  title: "Transaction Basics",
  desc: "Working with transactions and their various options",
};
export const metaMinting = {
  link: `/apis/txbuilder/minting`,
  title: "Mint and Burn Assets",
  desc: "Minting and burning assets with Native Script and Plutus Script",
};
export const metaTransactionSmartContract = {
  link: `/apis/txbuilder/smart-contract`,
  title: "Smart Contracts",
  desc: "Transactions to work with smart contracts",
};
export const metaStaking = {
  link: `/apis/txbuilder/staking`,
  title: "Staking Transactions",
  desc: "Transactions for delegating ADA and managing stake pools",
};
export const linksTransactions = [
  metaTransactionBasic,
  metaMinting,
  metaTransactionSmartContract,
  metaStaking,
];

export const metaTransaction = {
  title: "Transactions",
  desc: "Easy-to-use APIs to build transactions to mint tokens and work with smart contracts",
  link: "/apis/txbuilder",
  icon: BanknotesIcon,
  items: linksTransactions,
};
