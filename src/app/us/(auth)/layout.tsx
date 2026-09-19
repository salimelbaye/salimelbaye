/** Centred, single-column frame for the two unauthenticated screens. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[400px] flex-col justify-center px-6 py-14">
      {children}
    </main>
  );
}
