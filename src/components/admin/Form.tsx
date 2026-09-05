'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionState } from '@/actions/admin';

const EMPTY: ActionState = { ok: true, message: '' };

export function Submit({ children = 'Save', quiet = false, danger = false, confirm }: {
  children?: ReactNode; quiet?: boolean; danger?: boolean; confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`a-btn${quiet ? ' a-btn--quiet' : ''}${danger ? ' a-btn--danger' : ''}`}
      onClick={(e) => { if (confirm && !window.confirm(confirm)) e.preventDefault(); }}
    >
      {pending ? 'Working…' : children}
    </button>
  );
}

/** Wraps a server action and shows whatever it says afterwards. */
export function ActionForm({
  action, children, className,
}: {
  action: (prev: ActionState, data: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, EMPTY);
  return (
    <form action={formAction} className={className}>
      {children}
      {state.message && (
        <p className={`a-msg ${state.ok ? 'a-msg--ok' : 'a-msg--bad'}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}

export function Field({
  label, name, defaultValue, type = 'text', ar = false, required, placeholder, hint,
}: {
  label: string; name: string; defaultValue?: string | number | null;
  type?: string; ar?: boolean; required?: boolean; placeholder?: string; hint?: string;
}) {
  return (
    <label className={`a-field${ar ? ' a-field--ar' : ''}`}>
      <span>{label}{hint ? ` \u00b7 ${hint}` : ''}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
        dir={ar ? 'rtl' : undefined}
      />
    </label>
  );
}

export function Area({
  label, name, defaultValue, ar = false, rows = 4,
}: {
  label: string; name: string; defaultValue?: string | null; ar?: boolean; rows?: number;
}) {
  return (
    <label className={`a-field${ar ? ' a-field--ar' : ''}`}>
      <span>{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? ''} rows={rows} dir={ar ? 'rtl' : undefined} />
    </label>
  );
}

export function Check({ label, name, defaultChecked }: {
  label: string; name: string; defaultChecked?: boolean;
}) {
  return (
    <label className="a-check">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

export function Choice({ label, name, defaultValue, options }: {
  label: string; name: string; defaultValue?: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="a-field">
      <span>{label}</span>
      <select name={name} defaultValue={defaultValue}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/**
 * Sends the chosen file to Vercel Blob and writes the returned address into a
 * text field, so the person editing never has to see or copy a URL. It also
 * reads the image dimensions in the browser and fills those in, which is what
 * stops the page jumping about while photographs load.
 */
export function Upload({
  name, defaultValue, widthName, heightName,
  defaultWidth, defaultHeight, accept = 'image/*',
}: {
  name: string; defaultValue?: string;
  widthName?: string; heightName?: string;
  defaultWidth?: number; defaultHeight?: number;
  accept?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [w, setW] = useState(defaultWidth ?? 0);
  const [h, setH] = useState(defaultHeight ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onPick(file: File) {
    setBusy(true); setError('');
    try {
      if (file.type.startsWith('image/')) {
        const bitmap = await createImageBitmap(file);
        setW(bitmap.width); setH(bitmap.height);
        bitmap.close();
      }
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'The upload did not finish.');
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The upload did not finish.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="a-field">
      <span>Photo{busy ? ' \u00b7 uploading…' : ''}</span>
      {url && (
        // Blob addresses are not known at build time, so this stays a plain img.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="a-thumb" src={url} alt="" />
      )}
      <input
        type="file"
        accept={accept}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPick(f); }}
      />
      <input type="hidden" name={name} value={url} />
      {widthName && <input type="hidden" name={widthName} value={w} />}
      {heightName && <input type="hidden" name={heightName} value={h} />}
      {url && (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Photo address"
          style={{ fontSize: '0.78rem' }}
        />
      )}
      {error && <p className="a-msg a-msg--bad">{error}</p>}
    </div>
  );
}
