import {
  BanknotesIcon,
  CurrencyDollarIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";

export const metaAppwallet = {
  link: `/apis/wallets/appwallet`,
  title: "App Wallet (deprecated)",
  desc: "Core wallet functionality for building other user wallets and fully custom application backends.",
};
export const metaBrowserwallet = {
  link: `/apis/wallets/browserwallet`,
  title: "Browser Wallet",
  desc: "For connecting, querying, and performing wallet functions in accordance with CIP-30.",
};
export const metaMeshwallet = {
  link: `/apis/wallets/meshwallet`,
  title: "Mesh Wallet",
  desc: "Mesh Wallet provides a set of APIs to interact with the blockchain. This wallet is compatible with Mesh transaction builders.",
};

export const metaBitcoinBrowserWallet = {
  link: `/apis/wallets/bitcoin/browser-wallet`,
  title: "Bitcoin Browser Wallet",
  desc: "Connect to Xverse and other Bitcoin browser extensions via a unified Sats Connect API.",
  icon: BanknotesIcon,
};

export const metaBitcoinHeadlessWallet = {
  link: `/apis/wallets/bitcoin/headless-wallet`,
  title: "Bitcoin Headless Wallet",
  desc: "Self-custodial BIP-39 HD wallet for Node.js and browser — derives addresses, signs and broadcasts without any extension.",
  icon: CurrencyDollarIcon,
};

export const linksWallets = [
  metaBrowserwallet,
  metaMeshwallet,
  metaBitcoinBrowserWallet,
  metaBitcoinHeadlessWallet,
];

export const metaWallets = {
  title: "Wallets",
  desc: "Connect CIP-30 browser wallets and create server-side wallets for Cardano dApps.",
  link: "/apis/wallets",
  icon: WalletIcon,
  items: linksWallets,
};
