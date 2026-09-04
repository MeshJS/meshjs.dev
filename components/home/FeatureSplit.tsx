import Link from 'fumadocs-core/link';
import { ArrowRight } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';

export interface FeatureLink {
  icon: ComponentType<{ className?: string }>;
  text: string;
  link: string;
}

export interface FeatureSplitProps {
  /** Rendered inside the eyebrow pill, before the label. */
  eyebrowIcon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  links: FeatureLink[];
  /** Optional "read more" link below the list. */
  footerLink?: { href: string; text: string };
  /** Filename or shell label shown above the code sample. */
  codeLabel: string;
  codeClassName?: string;
  /** Places the code card on the left, alternating the rhythm down the page. */
  reverse?: boolean;
  /** The fenced code block, passed through from MDX. */
  children: ReactNode;
}

/**
 * The alternating text/code section used five times on the homepage. Each
 * instance previously existed as its own ~60-line copy of the same markup.
 */
export function FeatureSplit({
  eyebrowIcon,
  eyebrow,
  title,
  description,
  links,
  footerLink,
  codeLabel,
  codeClassName,
  reverse = false,
  children,
}: FeatureSplitProps) {
  const copy = (
    <div className={reverse ? 'order-1 lg:order-2' : undefined}>
      <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full border border-border text-sm font-medium">
        {eyebrowIcon}
        {eyebrow}
      </div>

      <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">{title}</h2>
      <div className="text-lg mb-6 text-muted-foreground">{description}</div>
      <div className="space-y-3">
        {links.map((item, index) => (
          <Link
            key={index}
            className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors duration-150"
            href={item.link}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
      {footerLink && (
        <div className="mt-6">
          <Link
            href={footerLink.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 inline-flex items-center gap-1"
          >
            <span>{footerLink.text}</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );

  const sample = (
    <Card
      className={`hover:border-foreground/20 transition-colors duration-150${
        reverse ? ' order-2 lg:order-1' : ''
      }`}
    >
      <CardHeader>
        <div className="text-xs font-mono text-muted-foreground bg-muted rounded-md px-3 py-1.5 w-fit mb-4">
          {codeLabel}
        </div>
        <CardDescription className={codeClassName}>{children}</CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {reverse ? (
            <>
              {sample}
              {copy}
            </>
          ) : (
            <>
              {copy}
              {sample}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
