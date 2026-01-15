import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export const challengeTransactionFailures = {
  title: "Transaction Failures",
  desc: "Why does my Cardano transaction keep failing? Common causes and solutions.",
  link: "/challenges/transaction-failures",
};

export const challengeUtxoModel = {
  title: "UTXO Model",
  desc: "Understanding Cardano's UTXO model and how it differs from account-based chains.",
  link: "/challenges/utxo-model",
};

export const challengeWalletIntegration = {
  title: "Wallet Integration",
  desc: "Solving common Cardano wallet integration issues in web applications.",
  link: "/challenges/wallet-integration",
};

export const challengeCoinSelection = {
  title: "Coin Selection",
  desc: "Solving Cardano coin selection problems and optimizing transaction inputs.",
  link: "/challenges/coin-selection",
};

export const challengeLearningCurve = {
  title: "Learning Curve",
  desc: "Overcoming Cardano's steep learning curve with practical approaches.",
  link: "/challenges/learning-curve",
};

export const linksChallenges = [
  challengeTransactionFailures,
  challengeUtxoModel,
  challengeWalletIntegration,
  challengeCoinSelection,
  challengeLearningCurve,
];

export const metaChallenges = {
  link: `/challenges`,
  title: "Challenges",
  desc: "Common Cardano development challenges and how Mesh helps you overcome them.",
  icon: ExclamationTriangleIcon,
  items: linksChallenges,
};
