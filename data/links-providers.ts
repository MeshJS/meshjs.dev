import { CloudIcon } from "@heroicons/react/24/solid";

export const metaKoios = {
  title: "Koios Provider",
  link: "/providers/koios",
  desc: "Distributed & open-source public API query layer for Cardano",
  thumbnail: "/providers/koios.png",
};

export const metaNexus = {
  title: "Nexus Provider",
  link: "/providers/nexus",
  desc: "Gero's Cardano REST API for chain queries, transaction submission, and script evaluation",
  thumbnail: "/logo-mesh/mesh.png",
};

export const metaBlockfrost = {
  title: "Blockfrost Provider",
  link: "/providers/blockfrost",
  desc: "Featuring over 100 APIs tailored for easy access to Cardano blockchain",
  thumbnail: "/providers/blockfrost.png",
};

export const metaU5c = {
  title: "UTxORPC Provider",
  link: "/providers/utxorpc",
  desc: "Highly efficient through gRPC, using a compact and high-performance binary format",
  thumbnail: "/providers/utxo-rpc.png",
};

export const metaYaci = {
  title: "Yaci Provider",
  link: "/providers/yaci",
  desc: "Custom Cardano devnet to tailor your devnet needs with a builtin indexer and custom viewer for devnet",
  thumbnail: "/providers/yaci.png",
};

export const metaOgmios = {
  title: "Ogmios Provider",
  link: "/providers/ogmios",
  desc: "Lightweight bridge interface for cardano-node that offers WebSockets API that enables local clients to speak Ouroboros' mini-protocols",
  thumbnail: "/providers/ogmios.png",
};

export const metaHydraProvider = {
  title: "Hydra Provider (beta)",
  link: "/providers/hydra",
  desc: "Layer 2 scaling solution for Cardano that increases transaction throughput and ensures cost efficiency while maintaining security.",
  thumbnail: "/providers/hydra.svg",
};

export const metaOfflineFetcher = {
  title: "Offline Fetcher",
  link: "/providers/offline-fetcher",
  desc: "Provider for testing, development and offline scenarios",
  thumbnail: "/logo-mesh/mesh.png",
};

export const metaOfflineEvaluator = {
  title: "Offline Evaluator",
  link: "/providers/offline-evaluator",
  desc: "An offline Plutus script evaluator for testing and validation.",
  thumbnail: "/logo-mesh/mesh.png",
};

export const metaScalusEmulator = {
  title: "Scalus Emulator",
  link: "/providers/scalus-emulator",
  desc: "A Scalus-based emulator for testing and validation.",
  icon: "icons/scalus-logo-vertical-dark.png",
  thumbnail: "/logo-mesh/mesh.png",
};

export const metaBitcoinBlockstream = {
  title: "Blockstream Bitcoin Provider",
  link: "/providers/bitcoin-blockstream",
  desc: "Fetch Bitcoin chain data and submit transactions via the public Blockstream Esplora API, no API key required.",
  thumbnail: "/logo-mesh/mesh.png",
};

export const metaBitcoinBlockstreamEnterprise = {
  title: "Blockstream Enterprise Bitcoin Provider",
  link: "/providers/bitcoin-blockstream-enterprise",
  desc: "Authenticated Bitcoin Esplora API via Blockstream Explorer Enterprise. OAuth client credentials against the enterprise hosts.",
  thumbnail: "/logo-mesh/mesh.png",
};

export const linksProviders = [
  metaBlockfrost,
  metaHydraProvider,
  metaKoios,
  metaNexus,
  metaOgmios,
  metaU5c,
  metaYaci,
  metaOfflineFetcher,
  metaOfflineEvaluator,
  metaScalusEmulator,
  metaBitcoinBlockstream,
  metaBitcoinBlockstreamEnterprise,
];

export const metaProviders = {
  title: "Providers",
  desc: "Connect to Cardano via Blockfrost, Koios, Nexus, Ogmios, or UTxO RPC, and to Bitcoin via Blockstream, with a unified API.",
  link: "/providers",
  icon: CloudIcon,
  items: linksProviders,
};
