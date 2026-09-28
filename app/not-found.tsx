import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl md:text-6xl">
        This page has <em className="italic text-matcha">wandered off.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        It might have moved, or never existed. The matcha is still where we left it.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
        <Link href="/menu" className="btn btn-outline">
          See the menu
        </Link>
      </div>
    </div>
  );
}
