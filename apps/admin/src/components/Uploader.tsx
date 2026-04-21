'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'upload failed');
  }
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
      onChange(r.url || `(falta R2_PUBLIC_URL) key=${r.key}`);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-20 w-32 rounded object-cover border" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="h-20 w-32 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground">
            sin imagen
          </div>
        )}
        <div className="flex flex-col gap-1">
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
          <Button type="button" size="sm" variant="outline" onClick={() => input.current?.click()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {loading ? 'Subiendo…' : 'Subir'}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt="" className="h-20 w-20 rounded object-cover border" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={loading}
          className="h-20 w-20 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground hover:bg-muted/30"
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
