import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-amber-600">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-navy px-4 text-sm font-medium text-paper hover:bg-navy-600"
      >
        Back to home
      </Link>
    </div>
  );
}
