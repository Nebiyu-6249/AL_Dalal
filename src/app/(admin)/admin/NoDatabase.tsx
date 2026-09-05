export default function NoDatabase() {
  return (
    <div className="a-note">
      <b>The database is not connected yet.</b>
      <p style={{ margin: '0.5rem 0 0' }}>
        The site is running on the prices from the printed menu, which is why every page
        still works. To start editing, add the Neon Postgres integration in Vercel, then
        open <code>/api/setup?secret=YOUR_SETUP_SECRET</code> once. The README has the steps.
      </p>
    </div>
  );
}
