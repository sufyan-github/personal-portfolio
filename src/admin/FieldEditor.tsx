import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Button } from "@cloudflare/kumo/components/button";
import { Collapsible } from "@cloudflare/kumo/components/collapsible";
import { Input, InputArea } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
import { Switch } from "@cloudflare/kumo/components/switch";
import { TagInput } from "@cloudflare/kumo/components/tag-input";
import {
  ArrowDownIcon,
  ArrowSquareOutIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CaretUpIcon,
  CopyIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  type ContentObject,
  type ContentValue,
  emptyLike,
  entrySubtitle,
  entryTitle,
  humanize,
  isObject,
  isTagList,
  mergedShape,
  singular,
  stringKind,
} from "./content";
import { useConfirm } from "./feedback";

export interface EditorContext {
  /** Values already used for dropdown and suggestion fields, by field name. */
  choices: Record<string, string[]>;
}

interface EditorProps {
  fieldKey: string;
  label: string;
  value: ContentValue;
  template?: ContentValue;
  onChange: (next: ContentValue) => void;
  ctx: EditorContext;
  depth?: number;
}

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Fields that need the full row: lists, groups, long text and images. */
function isWide(fieldKey: string, shape: ContentValue): boolean {
  if (Array.isArray(shape) || isObject(shape)) return true;
  if (typeof shape === "string") {
    const kind = stringKind(fieldKey, shape);
    return kind === "long" || kind === "image";
  }
  return false;
}

// ─── Entry point ───────────────────────────────────────────────────────────
export function ValueEditor(props: EditorProps) {
  const { value, template, label, onChange } = props;
  const shape = value ?? template ?? "";

  if (Array.isArray(shape)) return <ListEditor {...props} />;
  if (isObject(shape)) return <GroupEditor {...props} />;
  if (typeof shape === "boolean") {
    return (
      <div className="adm-switch">
        <Switch label={label} checked={value === true} onCheckedChange={(checked: boolean) => onChange(checked)} />
      </div>
    );
  }
  if (typeof shape === "number") {
    return (
      <Input
        type="number"
        label={label}
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
      />
    );
  }
  return <TextField {...props} />;
}

// ─── Text ──────────────────────────────────────────────────────────────────
function TextField({ fieldKey, label, value, onChange, ctx }: EditorProps) {
  const listId = useId();
  const text = typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  const kind = stringKind(fieldKey, text);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [text]);

  if (kind === "choice") {
    const options = [...new Set([...(ctx.choices[fieldKey] ?? []), ...(text ? [text] : [])])];
    if (options.length >= 2) {
      return (
        <Select
          label={label}
          value={text}
          placeholder="Choose…"
          onValueChange={(next) => onChange((next as string | null) ?? "")}
          items={Object.fromEntries(options.map((option) => [option, option]))}
        />
      );
    }
  }

  if (kind === "long") {
    return (
      <InputArea
        label={label}
        value={text}
        autoResize
        minRows={3}
        maxRows={16}
        onValueChange={(next: string) => onChange(next)}
      />
    );
  }

  if (kind === "image") {
    return (
      <div className="adm-image-field">
        <div className="adm-image-input">
          <Input
            label={label}
            value={text}
            placeholder="/certs/example.jpg or https://…"
            description="Paste an image address. Upload new images under Photos, then use “Copy address”."
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        {text && !imageFailed ? (
          <img className="adm-image-preview" src={text} alt="" onError={() => setImageFailed(true)} />
        ) : (
          <div className="adm-image-preview adm-image-empty">{text ? "Not found" : "No image"}</div>
        )}
      </div>
    );
  }

  if (kind === "link") {
    const openable = /^(https?:\/\/|\/)/.test(text);
    return (
      <div className="adm-link-field">
        <div className="adm-link-input">
          <Input label={label} value={text} inputMode="url" placeholder="https://…" onChange={(event) => onChange(event.target.value)} />
        </div>
        {openable && (
          <a className="adm-link-open" href={text} target="_blank" rel="noreferrer" aria-label={`Open ${label}`} title="Open in a new tab">
            <ArrowSquareOutIcon size={16} />
          </a>
        )}
      </div>
    );
  }

  const suggestions = kind === "suggest" || kind === "choice" ? ctx.choices[fieldKey] ?? [] : [];
  return (
    <>
      <Input
        label={label}
        value={text}
        list={suggestions.length ? listId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((option) => <option key={option} value={option} />)}
        </datalist>
      )}
    </>
  );
}

// ─── Group of fields ───────────────────────────────────────────────────────
function GroupFields({ value, template, onChange, ctx, depth = 0 }: Omit<EditorProps, "fieldKey" | "label">) {
  const current: ContentObject = isObject(value) ? value : {};
  const shape: ContentObject = isObject(template) ? template : {};
  const keys = [...new Set([...Object.keys(current), ...Object.keys(shape)])];

  return (
    <div className="adm-fields">
      {keys.map((key) => {
        const child = key in current ? current[key] : emptyLike(shape[key]);
        const childShape = child ?? shape[key] ?? "";
        return (
          <div key={key} className={isWide(key, childShape) ? "adm-field adm-field-wide" : "adm-field"}>
            <ValueEditor
              fieldKey={key}
              label={humanize(key)}
              value={child}
              template={shape[key]}
              ctx={ctx}
              depth={depth + 1}
              onChange={(next) => onChange({ ...current, [key]: next })}
            />
          </div>
        );
      })}
    </div>
  );
}

function GroupEditor(props: EditorProps) {
  const { label, depth = 0 } = props;
  const [open, setOpen] = useState(depth <= 1);
  if (depth === 0) return <GroupFields {...props} />;
  return (
    <div className="adm-group">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.DefaultTrigger>{label}</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <GroupFields {...props} />
        </Collapsible.DefaultPanel>
      </Collapsible.Root>
    </div>
  );
}

// ─── Lists ─────────────────────────────────────────────────────────────────
function ListEditor(props: EditorProps) {
  const { value, template } = props;
  const items = Array.isArray(value) ? value : [];
  const templateItems = Array.isArray(template) ? template : [];
  const sample = items[0] ?? templateItems[0];
  if (isObject(sample)) return <EntryList {...props} />;
  return <StringList {...props} />;
}

function StringList({ fieldKey, label, value, onChange }: EditorProps) {
  const items = (Array.isArray(value) ? value : []).map((item) => (item === null || item === undefined ? "" : String(item)));
  const noun = singular(label);

  if (isTagList(fieldKey, items)) {
    return (
      <TagInput
        label={label}
        value={items}
        placeholder={`Add ${noun === label.toLowerCase() ? "an item" : noun} and press Enter`}
        description="Press Enter after each one. Click × on a tag to remove it."
        onValueChange={(next: string[]) => onChange(next)}
      />
    );
  }

  return (
    <div className="adm-list">
      <div className="adm-list-head">
        <span className="adm-list-title">{label}</span>
        <Badge variant="neutral">{items.length}</Badge>
      </div>
      {items.map((item, index) => (
        <div key={index} className="adm-line">
          <div className="adm-line-input">
            <InputArea
              aria-label={`${label} ${index + 1}`}
              value={item}
              autoResize
              minRows={1}
              maxRows={8}
              onValueChange={(next: string) => onChange(items.map((old, i) => (i === index ? next : old)))}
            />
          </div>
          <Button variant="ghost" shape="square" size="sm" aria-label="Move up" title="Move up" disabled={index === 0} onClick={() => onChange(move(items, index, index - 1))} icon={<ArrowUpIcon />} />
          <Button variant="ghost" shape="square" size="sm" aria-label="Move down" title="Move down" disabled={index === items.length - 1} onClick={() => onChange(move(items, index, index + 1))} icon={<ArrowDownIcon />} />
          <Button variant="ghost" shape="square" size="sm" aria-label="Remove" title="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))} icon={<TrashIcon />} />
        </div>
      ))}
      <div>
        <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={() => onChange([...items, ""])}>
          Add {noun === label.toLowerCase() ? "line" : noun}
        </Button>
      </div>
    </div>
  );
}

function EntryList({ label, value, template, onChange, ctx, depth = 0 }: EditorProps) {
  const confirm = useConfirm();
  const items = useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const shape = useMemo(
    () => mergedShape([...items, ...(Array.isArray(template) ? template : [])]),
    [items, template],
  );
  const noun = singular(label);
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const openRef = useRef<HTMLDivElement>(null);
  const justAdded = useRef(false);

  useEffect(() => {
    if (justAdded.current) {
      justAdded.current = false;
      openRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [open]);

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => {
      if (!query.trim()) return true;
      const haystack = `${entryTitle(item, index, noun)} ${entrySubtitle(item)}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  const filtering = query.trim().length > 0;

  const add = () => {
    const blank = shape ? emptyLike(shape) : "";
    justAdded.current = true;
    setQuery("");
    onChange([...items, blank]);
    setOpen(items.length);
  };

  const remove = async (index: number) => {
    const title = entryTitle(items[index], index, noun);
    const ok = await confirm({
      title: `Delete this ${noun}?`,
      description: `“${title}” will be removed. It disappears from the site when you save.`,
    });
    if (!ok) return;
    onChange(items.filter((_, i) => i !== index));
    setOpen((current) => (current === null ? null : current === index ? null : current > index ? current - 1 : current));
  };

  const shift = (index: number, to: number) => {
    onChange(move(items, index, to));
    setOpen((current) => (current === index ? to : current === to ? index : current));
  };

  const duplicate = (index: number) => {
    const copy = structuredClone(items[index]);
    const next = [...items];
    next.splice(index + 1, 0, copy);
    justAdded.current = true;
    onChange(next);
    setOpen(index + 1);
  };

  return (
    <div className={depth === 0 ? "adm-entries adm-entries-root" : "adm-entries"}>
      <div className="adm-list-head">
        <span className="adm-list-title">{label}</span>
        <Badge variant="neutral">{items.length}</Badge>
        <span className="adm-grow" />
        {items.length > 8 && (
          <div className="adm-search">
            <MagnifyingGlassIcon size={14} />
            <input
              aria-label={`Search ${label.toLowerCase()}`}
              placeholder="Search…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        )}
        <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={add}>Add {noun}</Button>
      </div>

      {items.length === 0 && <p className="adm-muted adm-empty-line">Nothing here yet. Use “Add {noun}” to create the first one.</p>}
      {items.length > 0 && visible.length === 0 && <p className="adm-muted adm-empty-line">No {label.toLowerCase()} match “{query}”.</p>}

      {visible.map(({ item, index }) => {
        const isOpen = open === index;
        const record = isObject(item) ? item : {};
        return (
          <div key={index} ref={isOpen ? openRef : undefined} className={isOpen ? "adm-entry adm-entry-open" : "adm-entry"}>
            <div className="adm-entry-head">
              <button type="button" className="adm-entry-main" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
                <span className="adm-entry-index">{index + 1}</span>
                <span className="adm-entry-text">
                  <span className="adm-entry-title">{entryTitle(item, index, noun)}</span>
                  {entrySubtitle(item) && <span className="adm-entry-sub">{entrySubtitle(item)}</span>}
                </span>
                {record.featured === true && <Badge variant="blue">Featured</Badge>}
                {record.published === false && <Badge variant="neutral">Hidden</Badge>}
                {isOpen ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
              </button>
              <div className="adm-entry-actions">
                <Button variant="ghost" shape="square" size="sm" aria-label="Move up" title={filtering ? "Clear the search to reorder" : "Move up"} disabled={filtering || index === 0} onClick={() => shift(index, index - 1)} icon={<ArrowUpIcon />} />
                <Button variant="ghost" shape="square" size="sm" aria-label="Move down" title={filtering ? "Clear the search to reorder" : "Move down"} disabled={filtering || index === items.length - 1} onClick={() => shift(index, index + 1)} icon={<ArrowDownIcon />} />
                <Button variant="ghost" shape="square" size="sm" aria-label="Duplicate" title="Duplicate" onClick={() => duplicate(index)} icon={<CopyIcon />} />
                <Button variant="ghost" shape="square" size="sm" aria-label="Delete" title="Delete" onClick={() => remove(index)} icon={<TrashIcon />} />
              </div>
            </div>
            {isOpen && (
              <div className="adm-entry-body">
                <GroupFields
                  value={item}
                  template={shape}
                  ctx={ctx}
                  depth={depth + 1}
                  onChange={(next) => onChange(items.map((old, i) => (i === index ? next : old)))}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
