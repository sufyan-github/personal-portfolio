import { useCallback, useEffect, useState } from "react";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Button } from "@cloudflare/kumo/components/button";
import { Empty } from "@cloudflare/kumo/components/empty";
import { Input, InputArea } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import { Select } from "@cloudflare/kumo/components/select";
import { Switch } from "@cloudflare/kumo/components/switch";
import { Table } from "@cloudflare/kumo/components/table";
import { TagInput } from "@cloudflare/kumo/components/tag-input";
import { ArrowLeftIcon, FloppyDiskIcon, NotePencilIcon, PlusIcon, QuotesIcon } from "@phosphor-icons/react";
import { adminRecords, adminSaveRecord } from "@/lib/contentClient";
import { formatDate } from "../content";
import { notify } from "../feedback";

type RecordTable = "blog_posts" | "testimonials";
type Row = Record<string, unknown> & { id?: string };

const BLANK: Record<RecordTable, Row> = {
  blog_posts: { title: "", slug: "", excerpt: "", content: "", featured_image: "", tags: [], published: false },
  testimonials: { name: "", position: "", company: "", content: "", avatar_url: "", rating: 5, published: false },
};

const COPY: Record<RecordTable, { title: string; description: string; noun: string }> = {
  blog_posts: { title: "Blog", description: "Write articles. New posts stay as drafts until you publish them.", noun: "post" },
  testimonials: { title: "Testimonials", description: "Add what colleagues and mentors said. Only published ones appear on the site.", noun: "testimonial" },
};

const text = (value: unknown) => (typeof value === "string" ? value : "");

const slugify = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function validate(table: RecordTable, row: Row): string | null {
  if (table === "blog_posts") {
    if (!text(row.title).trim()) return "Give the post a title.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text(row.slug))) return "The web address may use only lowercase letters, numbers and hyphens.";
    if (!text(row.content).trim()) return "Write the article text.";
  } else {
    if (!text(row.name).trim()) return "Enter the person's name.";
    if (!text(row.content).trim()) return "Enter what they said.";
  }
  return null;
}

export function RecordsView({ table, onDirtyChange }: { table: RecordTable; onDirtyChange: (dirty: boolean) => void }) {
  const copy = COPY[table];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [original, setOriginal] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminRecords(table));
    } catch (e) {
      notify.error(`Could not load ${copy.title.toLowerCase()}`, (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [table, copy.title]);

  useEffect(() => {
    setEditing(null);
    load();
  }, [load]);

  const dirty = editing !== null && JSON.stringify(editing) !== original;
  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);

  const open = (row: Row) => {
    const copyOfRow = { ...BLANK[table], ...row };
    setEditing(copyOfRow);
    setOriginal(JSON.stringify(copyOfRow));
    setSlugTouched(!!row.id);
  };

  const set = (patch: Row) => setEditing((current) => (current ? { ...current, ...patch } : current));

  const save = async () => {
    if (!editing) return;
    const problem = validate(table, editing);
    if (problem) {
      notify.error("Please fix this first", problem);
      return;
    }
    setSaving(true);
    try {
      await adminSaveRecord(table, editing);
      notify.success(editing.published ? "Saved and published" : "Saved as draft");
      setEditing(null);
      await load();
    } catch (e) {
      notify.error("Could not save", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="adm-page adm-page-narrow">
        <div className="adm-page-head">
          <div>
            <h1 className="adm-h1">{editing.id ? `Edit ${copy.noun}` : `New ${copy.noun}`}</h1>
            <p className="adm-muted">{editing.published ? "Visible on the public site." : "Draft — not visible on the public site."}</p>
          </div>
          <div className="adm-actions">
            <Button variant="secondary" icon={<ArrowLeftIcon />} onClick={() => setEditing(null)}>Back</Button>
            <Button variant="primary" icon={<FloppyDiskIcon />} loading={saving} disabled={!dirty} onClick={save}>Save</Button>
          </div>
        </div>

        <LayerCard className="adm-card">
          {table === "blog_posts" ? (
            <div className="adm-fields">
              <div className="adm-field adm-field-wide">
                <Input
                  label="Title"
                  value={text(editing.title)}
                  onChange={(event) => {
                    const title = event.target.value;
                    set(slugTouched ? { title } : { title, slug: slugify(title) });
                  }}
                />
              </div>
              <div className="adm-field adm-field-wide">
                <Input
                  label="Web address"
                  description="Lowercase letters, numbers and hyphens. Filled in from the title."
                  value={text(editing.slug)}
                  onChange={(event) => {
                    setSlugTouched(true);
                    set({ slug: event.target.value });
                  }}
                />
              </div>
              <div className="adm-field adm-field-wide">
                <InputArea label="Short summary" value={text(editing.excerpt)} autoResize minRows={2} maxRows={6} onValueChange={(next: string) => set({ excerpt: next })} />
              </div>
              <div className="adm-field adm-field-wide">
                <InputArea label="Article" value={text(editing.content)} autoResize minRows={10} maxRows={30} onValueChange={(next: string) => set({ content: next })} />
              </div>
              <div className="adm-field adm-field-wide">
                <Input label="Cover image" placeholder="https://… (copy an address from Photos)" value={text(editing.featured_image)} onChange={(event) => set({ featured_image: event.target.value })} />
              </div>
              <div className="adm-field adm-field-wide">
                <TagInput
                  label="Tags"
                  placeholder="Add a tag and press Enter"
                  value={Array.isArray(editing.tags) ? (editing.tags as string[]) : []}
                  onValueChange={(next: string[]) => set({ tags: next })}
                />
              </div>
              <div className="adm-field adm-field-wide adm-switch">
                <Switch label="Published" checked={editing.published === true} onCheckedChange={(checked: boolean) => set({ published: checked })} />
              </div>
            </div>
          ) : (
            <div className="adm-fields">
              <div className="adm-field">
                <Input label="Name" value={text(editing.name)} onChange={(event) => set({ name: event.target.value })} />
              </div>
              <div className="adm-field">
                <Input label="Role" value={text(editing.position)} onChange={(event) => set({ position: event.target.value })} />
              </div>
              <div className="adm-field">
                <Input label="Organization" value={text(editing.company)} onChange={(event) => set({ company: event.target.value })} />
              </div>
              <div className="adm-field">
                <Select
                  label="Rating"
                  value={String(editing.rating ?? 5)}
                  onValueChange={(next) => set({ rating: Number(next ?? 5) })}
                  items={{ "5": "5 stars", "4": "4 stars", "3": "3 stars", "2": "2 stars", "1": "1 star" }}
                />
              </div>
              <div className="adm-field adm-field-wide">
                <InputArea label="What they said" value={text(editing.content)} autoResize minRows={4} maxRows={14} onValueChange={(next: string) => set({ content: next })} />
              </div>
              <div className="adm-field adm-field-wide">
                <Input label="Photo" placeholder="https://… (optional)" value={text(editing.avatar_url)} onChange={(event) => set({ avatar_url: event.target.value })} />
              </div>
              <div className="adm-field adm-field-wide adm-switch">
                <Switch label="Published" checked={editing.published === true} onCheckedChange={(checked: boolean) => set({ published: checked })} />
              </div>
            </div>
          )}
        </LayerCard>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">{copy.title}</h1>
          <p className="adm-muted">{copy.description}</p>
        </div>
        <div className="adm-actions">
          <Button variant="primary" icon={<PlusIcon />} onClick={() => open({})}>New {copy.noun}</Button>
        </div>
      </div>

      {loading ? (
        <div className="adm-center"><Loader size="lg" /></div>
      ) : rows.length === 0 ? (
        <LayerCard className="adm-card">
          <Empty
            size="sm"
            icon={table === "blog_posts" ? <NotePencilIcon size={32} /> : <QuotesIcon size={32} />}
            title={`No ${copy.title.toLowerCase()} yet`}
            description={`Use “New ${copy.noun}” to add the first one.`}
          />
        </LayerCard>
      ) : (
        <LayerCard className="adm-card adm-card-flush">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{table === "blog_posts" ? "Title" : "Name"}</Table.Head>
                <Table.Head>{table === "blog_posts" ? "Summary" : "Organization"}</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Created</Table.Head>
                <Table.Head> </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={String(row.id)}>
                  <Table.Cell><span className="adm-strong">{text(row.title) || text(row.name) || "Untitled"}</span></Table.Cell>
                  <Table.Cell><span className="adm-clip">{table === "blog_posts" ? text(row.excerpt) : [text(row.position), text(row.company)].filter(Boolean).join(" · ")}</span></Table.Cell>
                  <Table.Cell>{row.published ? <Badge variant="green">Published</Badge> : <Badge variant="neutral">Draft</Badge>}</Table.Cell>
                  <Table.Cell>{formatDate(text(row.created_at))}</Table.Cell>
                  <Table.Cell><Button variant="secondary" size="sm" onClick={() => open(row)}>Edit</Button></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </LayerCard>
      )}
    </div>
  );
}
