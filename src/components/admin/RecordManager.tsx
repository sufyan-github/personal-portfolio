import { useEffect, useState } from 'react';
import { adminRecords, adminSaveRecord } from '@/lib/contentClient';
import { ContentFields, type ContentValue } from './ContentFields';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Row = Record<string, ContentValue>;
const defaults: Record<string, Row> = {
  blog_posts: { title: '', slug: '', excerpt: '', content: '', featured_image: '', tags: [], published: false },
  testimonials: { name: '', position: '', company: '', content: '', avatar_url: '', rating: 5, published: false },
};

export function RecordManager({ table }: { table: 'contacts' | 'blog_posts' | 'testimonials' }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  async function refresh() {
    setError(''); setBusy(true);
    try { setRows(await adminRecords(table)); } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  useEffect(() => { let active = true; setBusy(true); setSelected(null); adminRecords(table).then(data => { if (active) { setRows(data); setError(''); } }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setBusy(false); }); return () => { active = false; }; }, [table]);
  async function save() {
    if (!selected) return;
    setBusy(true);
    try { await adminSaveRecord(table, selected); toast({ title: 'Saved', description: 'Your publication settings have been updated.' }); setSelected(null); await refresh(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="rounded-2xl border bg-card/70 p-4 sm:p-6 space-y-5">
    <div className="flex flex-wrap justify-between items-center gap-3"><div><h2 className="text-xl font-semibold capitalize">{table.replace('_', ' ')}</h2><p className="text-sm text-muted-foreground">{table === 'contacts' ? 'Private inbox · newest 100 messages' : 'Manage drafts and published entries'}</p></div><div className="flex gap-2"><Button variant="outline" disabled={busy} onClick={refresh}>Refresh</Button>{table !== 'contacts' && <Button onClick={() => setSelected({ ...defaults[table] })}>New entry</Button>}</div></div>
    {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-destructive">{error}</p>}
    {busy && <p role="status">Loading…</p>}
    {selected && table !== 'contacts' ? <div className="max-w-3xl space-y-4"><ContentFields value={Object.fromEntries(Object.entries(selected).filter(([key]) => !['id','created_at','updated_at'].includes(key)))} onChange={value => setSelected({ ...selected, ...(value as Row) })} /><div className="flex gap-2"><Button disabled={busy} onClick={save}>Save entry</Button><Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button></div></div> : <div className="grid gap-3">{rows.length === 0 && !busy && !error && <p className="text-muted-foreground py-8 text-center">No entries yet.</p>}{rows.map((row, i) => <article key={String(row.id ?? i)} className="rounded-xl border p-4 space-y-2"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-medium">{String(row.title ?? row.subject ?? row.name)}</h3><span className="text-xs text-muted-foreground">{table === 'contacts' ? String(row.created_at).slice(0, 10) : row.published ? 'Published' : 'Draft'}</span></div>{table === 'contacts' ? <><p className="text-sm text-muted-foreground">{String(row.name)} · {String(row.email)}</p><p className="whitespace-pre-wrap text-sm break-words">{String(row.message)}</p></> : <><p className="text-sm text-muted-foreground line-clamp-2">{String(row.excerpt ?? row.content ?? '')}</p><Button variant="outline" size="sm" onClick={() => setSelected(row)}>Edit entry</Button></>}</article>)}</div>}
  </section>;
}
