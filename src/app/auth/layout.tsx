import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-5">
      <div className="text-center">
        <Link href="/" className="inline-block" aria-label="TAGE Home">
          <img
            src="/logo/tage_logo.png"
            alt="TAGE"
            className="h-20 md:h-24 w-auto object-contain mx-auto"
          />
        </Link>
      </div>

      <main className="w-full max-w-md mx-auto my-auto page">{children}</main>

      <footer className="text-center text-xs mute">
        © 2026 TAGE Studio. All rights reserved.
      </footer>
    </div>
  );
}

