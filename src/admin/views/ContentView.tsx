import { useEffect, useMemo, useState } from "react";
import { Banner } from "@cloudflare/kumo/components/banner";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import { ArrowCounterClockwiseIcon, FloppyDiskIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { adminGet, adminSave } from "@/lib/contentClient";
import { type ContentValue, collectChoices, humanize, isObject } from "../content";
import { ValueEditor } from "../FieldEditor";
import { notify } from "../feedback";
import { loadBundled, sectionByKey } from "../sections";

interface Props {
  sectionKey: string;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (key: string) => void;
}

export function ContentView({ sectionKey, onDirtyChange, onSaved }: Props) {
  const meta = sectionByKey(sectionKey);
  const label = meta?.label ?? humanize(sectionKey);
  const [value, setValue] = useState<ContentValue>(null);
  const [saved, setSaved] = useState("");
  const [template, setTemplate] = useState<ContentValue>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const [live, bundled] = await Promise.all([adminGet(sectionKey), loadBundled(sectionKey)]);
        if (cancelled) return;
        const current = (live.value ?? bundled ?? {}) as ContentValue;
        setValue(current);
        setSaved(JSON.stringify(current));
        setTemplate((bundled ?? null) as ContentValue);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  const dirty = !loading && JSON.stringify(value) !== saved;
  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);

  const ctx = useMemo(() => {
    const fromLive = collectChoices(value);
    const fromBundled = collectChoices(template);
    const keys = new Set([...Object.keys(fromLive), ...Object.keys(fromBundled)]);
    const choices: Record<string, string[]> = {};
    for (const key of keys) choices[key] = [...new Set([...(fromBundled[key] ?? []), ...(fromLive[key] ?? [])])].sort();
    return { choices };
  }, [value, template]);

  const save = async () => {
    setSaving(true);
    try {
      // The public site expects each collection to keep its overall form.
      if (template !== null && Array.isArray(template) !== Array.isArray(value)) {
        throw new Error("This section's structure no longer matches what the site expects.");
      }
      if (template !== null && isObject(template) && !isObject(value)) {
        throw new Error("This section's structure no longer matches what the site expects.");
      }
      await adminSave(sectionKey, value);
      setSaved(JSON.stringify(value));
      onSaved(sectionKey);
      notify.success(`${label} saved`, "The public site shows it after a refresh.");
    } catch (e) {
      notify.error("Could not save", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">{label}</h1>
          <p className="adm-muted">{meta?.description ?? "Content shown on the public site."}</p>
        </div>
        <div className="adm-actions">
          <span className={dirty ? "adm-status adm-status-dirty" : "adm-status"} role="status">
            {loading ? "" : dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <Button variant="secondary" icon={<ArrowCounterClockwiseIcon />} disabled={!dirty || saving} onClick={() => setValue(JSON.parse(saved))}>
            Discard
          </Button>
          <Button variant="primary" icon={<FloppyDiskIcon />} disabled={!dirty} loading={saving} onClick={save}>
            Save changes
          </Button>
        </div>
      </div>

      {error && (
        <Banner variant="error" icon={<WarningCircleIcon weight="fill" />} title="Could not load this section" description={error} />
      )}

      {loading ? (
        <div className="adm-center"><Loader size="lg" /></div>
      ) : !error ? (
        Array.isArray(value) && value.some(isObject) ? (
          <ValueEditor fieldKey={sectionKey} label={label} value={value} template={template ?? undefined} onChange={setValue} ctx={ctx} depth={0} />
        ) : (
          <LayerCard className="adm-card">
            <ValueEditor fieldKey={sectionKey} label={label} value={value} template={template ?? undefined} onChange={setValue} ctx={ctx} depth={0} />
          </LayerCard>
        )
      ) : null}

      {dirty && (
        <div className="adm-savebar">
          <span>You have unsaved changes in {label}.</span>
          <span className="adm-grow" />
          <Button variant="secondary" size="sm" disabled={saving} onClick={() => setValue(JSON.parse(saved))}>Discard</Button>
          <Button variant="primary" size="sm" loading={saving} onClick={save}>Save changes</Button>
        </div>
      )}
    </div>
  );
}
