import { CircleStackIcon } from "@heroicons/react/24/solid";

export const metaOverview = {
  title: "Data Overview",
  desc: "Learn about the basics, and how Mesh handles Cardano data",
  link: "/apis/data/overview",
};

export const metaDataMesh = {
  title: "Mesh Data",
  desc: "Parse and manipulate data with Mesh Data type",
  link: "/apis/data/mesh",
};
export const metaDataJson = {
  title: "JSON Data",
  desc: "Parse and manipulate data with JSON",
  link: "/apis/data/json",
};
export const metaDataValue = {
  title: "Value",
  desc: "Manipulate Value Easily",
  link: "/apis/data/value",
};
export const metaDataCbor = {
  title: "CBOR Data",
  desc: "Parse and manipulate data with CBOR",
  link: "/apis/data/cbor",
};
export const metaDataUtils = {
  title: "Advance Utility for Data",
  desc: "Making data manipulation easier with Mesh",
  link: "/apis/data/utils",
};

export const linksData = [
  metaOverview,
  metaDataMesh,
  metaDataJson,
  metaDataValue,
  // metaDataCbor, // todo
  // metaDataUtils, // todo
];

export const metaData = {
  title: "Data",
  desc: "Useful utilities to parse and manipulate data",
  link: "/apis/data",
  icon: CircleStackIcon,
  items: linksData,
};
