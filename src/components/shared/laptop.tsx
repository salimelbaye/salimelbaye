import { Dashboard } from '@/components/shared/dashboard';
import { cn } from '@/lib/utils';

/** MacBook shell around the live dashboard, with its own blue glow behind it. */
export function Laptop({ className, glow = true }: { className?: string; glow?: boolean }) {
  return (
    <div className={cn('relative', className)}>
      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[6%] -z-10 h-[150%] w-[170%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(79,125,249,0.34),transparent_70%)] blur-[44px]"
        />
      ) : null}
      <div className="rounded-[13px] border border-[rgba(148,163,184,0.24)] bg-[linear-gradient(180deg,#242B3C,#151B2A)] p-2 shadow-[0_44px_90px_-34px_rgba(0,0,0,0.98),inset_0_0_0_1px_rgba(255,255,255,0.04),0_0_70px_-14px_rgba(79,125,249,0.42)]">
        <div className="laptop-screen relative overflow-hidden rounded-[7px] border border-[rgba(148,163,184,0.12)] bg-[#070B18]">
          <Dashboard />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(118deg,rgba(255,255,255,0.05),transparent_38%)]" />
        </div>
      </div>
      <div
        aria-hidden
        className="relative -mx-[6%] h-2.5 rounded-b-[11px] border border-t-0 border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,#2B3346,#141A28)] after:absolute after:left-1/2 after:top-0 after:h-1 after:w-[66px] after:-translate-x-1/2 after:rounded-b-[5px] after:bg-bg/80"
      />
    </div>
  );
}
