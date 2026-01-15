import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export const metaTxParserBasic = {
  link: `/apis/txparser/basics`,
  title: "Parser Basics",
  desc: "Parse transactions and rebuild",
};
export const metaTxParserTxTester = {
  link: `/apis/txparser/txtester`,
  title: "Unit Testing Transaction",
  desc: "Parse and test transactions with various options",
};
export const linksTxParser = [metaTxParserBasic, metaTxParserTxTester];

export const metaTxParser = {
  title: "Transaction Parser",
  desc: "Parse transactions for testing and rebuilding",
  link: "/apis/txparser",
  icon: MagnifyingGlassIcon,
  items: linksTxParser,
};
