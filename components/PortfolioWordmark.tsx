import { forwardRef, type HTMLAttributes } from "react";

export const PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS = "text-2xl font-bold tracking-wide text-content-primary";
export const PORTFOLIO_WORDMARK_ACCENT_CLASS = "text-accent";

type PortfolioWordmarkProps = HTMLAttributes<HTMLSpanElement>;

const PortfolioWordmark = forwardRef<HTMLSpanElement, PortfolioWordmarkProps>(function PortfolioWordmark(
  { className = "", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={`rounded-sm ${PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS} ${className}`.trim()}
    >
      Port<span data-wordmark-accent className={PORTFOLIO_WORDMARK_ACCENT_CLASS}>folio</span>
    </span>
  );
});

export default PortfolioWordmark;
