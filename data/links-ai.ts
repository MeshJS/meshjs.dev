import { SparklesIcon } from "@heroicons/react/24/solid";

export const metaAiChatbot = {
  title: "Ask MeshAI",
  desc: "Chatbot that answers your queries using contextual retrieval built on RAG",
  link: "/ai/chatbot",
};
export const metaAiLlmsTxt = {
  title: "LLMs.txt",
  desc: "AI-friendly documentation file for code editors like Cursor",
  link: "/ai/llms-txt",
};
export const metaAiMcp = {
  title: "Mesh MCP",
  desc: "Access Mesh docs and get coding help directly in your editor",
  link: "/ai/mcp",
};
export const metaAiSkills = {
  title: "Agent Skills",
  desc: "AI skills that give your coding assistant deep knowledge of Mesh SDK packages",
  link: "/ai/skills",
};

export const linksAi = [metaAiSkills, metaAiChatbot, metaAiLlmsTxt, metaAiMcp];

export const metaAi = {
  title: "Mesh AI Features",
  desc: "AI tools to help you work with Mesh faster",
  link: "/ai",
  icon: SparklesIcon,
  items: linksAi,
};
