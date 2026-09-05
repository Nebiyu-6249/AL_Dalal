import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section" style={{ paddingBlock: 'clamp(5rem, 14vw, 9rem)' }}>
      <div className="wrap">
        <hr className="rule" />
        <h1>That page is not here</h1>
        <p className="lede" style={{ marginTop: '1rem' }}>
          The link may be old, or the address mistyped. The services and prices are all still
          where they were.
        </p>
        <p style={{ marginTop: '1.75rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link className="btn btn--primary" href="/">Back to the home page</Link>
          <Link className="btn btn--ghost" href="/menu">See the price menu</Link>
        </p>
      </div>
    </section>
  );
}
