import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export type ContentValue = string | number | boolean | null | ContentValue[] | { [key: string]: ContentValue };
const title = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
function emptyLike(value: ContentValue): ContentValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyLike(child)]));
  if (typeof value === 'boolean') return false;
  if (typeof value === 'number') return 0;
  return '';
}

export function ContentFields({ value, onChange, label = 'Content', template }: { value: ContentValue; onChange: (value: ContentValue) => void; label?: string; template?: ContentValue }) {
  const id = useId();
  if (Array.isArray(value)) return <fieldset className="space-y-3 rounded-xl border border-border/60 p-4 min-w-0">
    <legend className="px-2 text-sm font-semibold capitalize">{title(label)} <span className="text-muted-foreground">({value.length})</span></legend>
    {value.map((item, index) => <div key={index} className="rounded-lg border bg-background/60 p-3 space-y-2">
      <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Item {index + 1}</span><Button type="button" size="sm" variant="ghost" aria-label={`Remove ${label} item ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button></div>
      <ContentFields value={item} template={Array.isArray(template) ? template[0] : undefined} label={`${label} ${index + 1}`} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} />
    </div>)}
    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, value.length ? emptyLike(value[0]) : Array.isArray(template) && template.length ? emptyLike(template[0]) : ''])}><Plus className="h-4 w-4 mr-2" />Add item</Button>
  </fieldset>;
  if (value && typeof value === 'object') return <div className="grid gap-4 min-w-0">{Object.entries(value).map(([key, child]) => <ContentFields key={key} label={key} value={child} template={template && typeof template === 'object' && !Array.isArray(template) ? template[key] : undefined} onChange={next => onChange({ ...value, [key]: next })} />)}</div>;
  if (typeof value === 'boolean') return <label htmlFor={id} className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 p-3"><span className="text-sm capitalize">{title(label)}</span><input id={id} type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} className="h-5 w-5 accent-primary" /></label>;
  return <div className="space-y-1.5 min-w-0"><label htmlFor={id} className="block text-sm font-medium capitalize">{title(label)}</label>{typeof value === 'string' && (value.length > 100 || /description|summary|content|bio/i.test(label)) ? <Textarea id={id} value={value} rows={4} onChange={event => onChange(event.target.value)} /> : <Input id={id} type={typeof value === 'number' ? 'number' : 'text'} value={typeof value === 'string' || typeof value === 'number' ? value : ''} onChange={event => onChange(typeof value === 'number' ? Number(event.target.value) : event.target.value)} />}</div>;
}
