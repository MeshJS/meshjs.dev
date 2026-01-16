import { LinkItemType } from '@fumadocs/ui/link-item';
import { linksApi } from "@/data/links-api";
import { linksResources } from "@/data/links-resources";
import { linksSolutions } from "@/data/links-solutions";
import { linksAbout } from "@/data/links-about";
import { iconResolver } from "@/lib/iconResolver";
import { ComponentType, SVGProps } from 'react';

type IconType = string | ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface LinkItem {
  title: string;
  link: string;
  desc: string;
  icon: IconType;
}

function createMenuItems(links: LinkItem[]) {
  return links.map((item) => {
    const IconComponent = item.icon;
    if (typeof IconComponent === 'string') {
      return {
        text: item.title,
        url: item.link,
        description: item.desc,
        icon: iconResolver(IconComponent, "size-5"),
      };
    }
    return {
      text: item.title,
      url: item.link,
      description: item.desc,
      icon: <IconComponent className="size-5" />,
    };
  });
}

export const navbarLinks: LinkItemType[] = [
  {
    type: "menu",
    text: "SDK",
    items: createMenuItems(linksApi),
  },
  {
    type: "menu",
    text: "Resources",
    items: createMenuItems(linksResources),
  },
  {
    type: "menu",
    text: "Solutions",
    items: createMenuItems(linksSolutions),
  },
  {
    type: "menu",
    text: "About",
    items: createMenuItems(linksAbout),
  },
];
