import {
  Squares2X2Icon,
  StarIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

import { Wand2Icon, Sparkles } from "lucide-react";

export const linksResources = [
  {
    link: `/resources`,
    title: "Resources",
    desc: "Comprehensive courses, tutorials, and resources for Cardano developers.",
    icon: AcademicCapIcon,
  },
  {
    title: "AI Features",
    desc: "We've built AI tools to help you work with Mesh faster",
    link: "/ai",
    icon: Wand2Icon,
  },
  {
    title: "Mimir (contextual RAG)",
    desc: "Connect your AI assistants to your entire codebase and docs with full context understanding.",
    link: "https://mimir.meshjs.dev/",
    icon: Sparkles,
  },
  {
    title: "Full Course",
    desc: "Comprehensive course for building Cardano applications with Mesh SDK and Aiken smart contracts.",
    link: "/resources/cardano-course",
    icon: BookOpenIcon,
  },
  {
    title: "Guides",
    desc: "Step by step guides",
    link: "/guides",
    icon: BookOpenIcon,
  },
  // {
  //   title: "Documentation",
  //   desc: "Full documentation for MeshJS",
  //   link: "https://docs.meshjs.dev/",
  //   icon: DocumentTextIcon,
  // },
  {
    link: `https://github.com/MeshJS/examples`,
    title: "Examples",
    desc: "Explore our examples to get started",
    icon: Squares2X2Icon,
  },
  // {
  //   link: `https://pbl.meshjs.dev/`,
  //   title: "Project Based Learning",
  //   desc: "Start your building journey",
  //   icon: AcademicCapIcon,
  // },
];

export const metaResources = {
  title: "Resources",
  desc: "Whether you are new to web development or a seasoned blockchain full-stack developer, Mesh is the SDK for you.",
  link: "/resources",
  icon: StarIcon,
  items: linksResources,
};
