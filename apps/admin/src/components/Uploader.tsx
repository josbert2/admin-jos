'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

async function uploadFile(file: File, folder?: string): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
  const res = await fetch(`${BASE_URL}/api/upload${qs}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  if (!res.ok) throw new Error((await res.text()) || 'upload failed');
  return res.json();
}

export function SingleUploader({
  value,
  onChange,
  folder,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File) {
    setLoading(true);
    setError(null);
    try {
      const r = await uploadFile(file, folder);
      onChange(r.url);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start gap-3">
      {value ? (
        <div className="relative">
          <img src={value} alt="" className="h-24 w-36 rounded-md object-cover border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 rounded-full bg-background/90 border p-0.5 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={loading}
          className="h-24 w-36 rounded-md border border-dashed flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>subir</span>
            </>
          )}
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = '';
        }}
      />
      {error && <p className="text-xs text-destructive self-center">{error}</p>}
    </div>
  );
}

export function MultiUploader({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(files: FileList) {
    setLoading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const r = await uploadFile(f, folder);
        if (r.url) urls.push(r.url);
      }
      onChange([...value, ...urls]);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="h-20 w-20 rounded-md object-cover border" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 rounded-full bg-background/90 border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={loading}
          className="h-20 w-20 rounded-md border border-dashed flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </button>
      </div>
      <input
        ref={input}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={(e) => {
          if (e.target.files?.length) handle(e.target.files);
          e.target.value = '';
        }}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
