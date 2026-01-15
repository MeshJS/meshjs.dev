import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

import { metaData } from "./links-data";

export const metaResolvers = {
  title: "Resolvers",
  desc: "Converts between different formats.",
  link: "/apis/utilities/resolvers",
};

export const metaSerializers = {
  title: "Serializers",
  desc: "Encode objects into CBOR or bech32 format.",
  link: "/apis/utilities/serializers",
};

export const metaDeserializers = {
  title: "Deserializers",
  desc: "Parse CBOR or bech32 into objects.",
  link: "/apis/utilities/deserializers",
};

export const metaBlueprints = {
  title: "Blueprints",
  desc: "Blueprints for script with either apply parameters or no parameters",
  link: "/apis/utilities/blueprints",
};

export const linksUtilities = [
  metaSerializers,
  metaDeserializers,
  metaResolvers,
  metaData,
  metaBlueprints,
];

export const metaUtilities = {
  title: "Utilities",
  desc: "Serializers, resolvers and data types for converting between different formats.",
  link: "/apis/utilities",
  icon: WrenchScrewdriverIcon,
  items: linksUtilities,
};
