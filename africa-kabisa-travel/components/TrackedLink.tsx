"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { trackEvent, type AnalyticsEventParams } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: string;
  eventParams?: AnalyticsEventParams;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function TrackedLink({
  href,
  children,
  className,
  eventName,
  eventParams,
  onClick,
  target,
  rel,
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, {
      link_url: href,
      ...eventParams,
    });
    onClick?.(event);
  };

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
