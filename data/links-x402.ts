import { CreditCardIcon } from "@heroicons/react/24/solid";

export const metaX402Client = {
  title: "Client",
  desc: "Pay for x402 resources with fetchWithPayment.",
  link: "/apis/x402/client",
};

export const metaX402Server = {
  title: "Server",
  desc: "Put a price on a route with buildXOffer and createPaywall.",
  link: "/apis/x402/server",
};

export const metaX402Facilitator = {
  title: "Facilitator",
  desc: "Verify and settle payments with createFacilitatorApp.",
  link: "/apis/x402/facilitator",
};

export const metaX402Masumi = {
  title: "Masumi Escrow",
  desc: "Lock x402 payments into the Masumi escrow, with refunds and disputes.",
  link: "/apis/x402/masumi",
};

export const metaX402Withdrawal = {
  title: "Withdrawal",
  desc: "How funds leave after an x402 payment, for each transfer method.",
  link: "/apis/x402/withdrawal",
};

export const linksX402 = [
  metaX402Client,
  metaX402Server,
  metaX402Facilitator,
  metaX402Masumi,
  metaX402Withdrawal,
];

export const metaX402 = {
  title: "x402 Payments",
  desc: "Charge for an API or page with Cardano. The server answers 402, the client pays, the content unlocks.",
  link: "/apis/x402",
  icon: CreditCardIcon,
  items: linksX402,
};
