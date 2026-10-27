import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <img
        src="/logo/tage_logo.png"
        alt="TAGE"
        className="h-20 w-auto object-contain mb-6"
      />
      <div className="text-[11px] tracking-[0.35em] uppercase mute mb-3">
        Error 404
      </div>
      <h1 className="serif text-4xl md:text-5xl mb-4">Page Not Found</h1>
      <p className="mute text-sm max-w-md mb-8">
        The piece or editorial you are looking for may have been archived or moved.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn">
          Return Home
        </Link>
        <Link
          href="/shop"
          className="border border-current text-xs tracking-[0.25em] uppercase px-7 py-3.5"
        >
          Explore Shop
        </Link>
      </div>
    </main>
  );
}

