import { WalletIcon } from "@heroicons/react/24/solid";

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

export const linksWallets = [metaBrowserwallet, metaMeshwallet];

export const metaWallets = {
  title: "Wallets",
  desc: "Connect CIP-30 browser wallets and create server-side wallets for Cardano dApps.",
  link: "/apis/wallets",
  icon: WalletIcon,
  items: linksWallets,
};
