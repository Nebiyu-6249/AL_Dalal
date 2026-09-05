export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  return (
    <div className="a-login">
      <div className="a-login__box">
        <h1>Al Dalal admin</h1>
        <p>Sign in to change prices, photos, opening hours and everything else on the site.</p>
        <form method="post" action="/api/auth/login">
          <input type="hidden" name="next" value={next ?? '/admin'} />
          <label className="a-field">
            <span>Email</span>
            <input type="email" name="email" autoComplete="username" required autoFocus />
          </label>
          <label className="a-field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          {error && <p className="a-msg a-msg--bad">{error}</p>}
          <button type="submit" className="a-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
}
