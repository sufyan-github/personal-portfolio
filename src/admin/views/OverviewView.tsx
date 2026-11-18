import { useEffect, useState } from "react";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Table } from "@cloudflare/kumo/components/table";
import { ArrowSquareOutIcon, EnvelopeSimpleIcon, FilePdfIcon, ImagesIcon, NotePencilIcon, QuotesIcon, StackIcon } from "@phosphor-icons/react";
import { adminList, adminListPhotos, adminRecords } from "@/lib/contentClient";
import { formatDate } from "../content";
import { GROUPS, SECTIONS, sectionByKey } from "../sections";

interface Props {
  go: (route: string) => void;
}

interface Stats {
  photos: number | null;
  messages: number | null;
  posts: [published: number, total: number] | null;
  testimonials: [published: number, total: number] | null;
}

const countPublished = (rows: Record<string, unknown>[]): [number, number] => [
  rows.filter((row) => row.published === true).length,
  rows.length,
];

export function OverviewView({ go }: Props) {
  const [recent, setRecent] = useState<{ content_key: string; updated_at: string }[] | null>(null);
  const [stats, setStats] = useState<Stats>({ photos: null, messages: null, posts: null, testimonials: null });

  useEffect(() => {
    let active = true;
    adminList().then((items) => active && setRecent(items)).catch(() => active && setRecent([]));
    adminListPhotos().then((photos) => active && setStats((s) => ({ ...s, photos: photos.length }))).catch(() => {});
    adminRecords("contacts").then((rows) => active && setStats((s) => ({ ...s, messages: rows.length }))).catch(() => {});
    adminRecords("blog_posts").then((rows) => active && setStats((s) => ({ ...s, posts: countPublished(rows) }))).catch(() => {});
    adminRecords("testimonials").then((rows) => active && setStats((s) => ({ ...s, testimonials: countPublished(rows) }))).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const latest = [...(recent ?? [])]
    .filter((item) => sectionByKey(item.content_key))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 8);

  const tiles: { label: string; value: string; hint: string; icon: JSX.Element; route: string }[] = [
    { label: "Content sections", value: String(SECTIONS.length), hint: "All editable with forms", icon: <StackIcon size={18} />, route: "content/hero" },
    { label: "Photos", value: stats.photos === null ? "…" : String(stats.photos), hint: "Gallery, hero and assets", icon: <ImagesIcon size={18} />, route: "photos" },
    { label: "Inbox", value: stats.messages === null ? "…" : String(stats.messages), hint: "Latest contact messages", icon: <EnvelopeSimpleIcon size={18} />, route: "inbox" },
    { label: "Blog posts", value: stats.posts === null ? "…" : `${stats.posts[0]} / ${stats.posts[1]}`, hint: "Published / total", icon: <NotePencilIcon size={18} />, route: "blog" },
    { label: "Testimonials", value: stats.testimonials === null ? "…" : `${stats.testimonials[0]} / ${stats.testimonials[1]}`, hint: "Published / total", icon: <QuotesIcon size={18} />, route: "testimonials" },
  ];

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Overview</h1>
          <p className="adm-muted">Everything on your portfolio is managed from here. Pick a section, edit the fields, save.</p>
        </div>
        <div className="adm-actions">
          <Button variant="secondary" icon={<FilePdfIcon />} onClick={() => go("resume")}>Update CV</Button>
          <a className="adm-button-link" href="/" target="_blank" rel="noreferrer">
            <ArrowSquareOutIcon size={16} /> View public site
          </a>
        </div>
      </div>

      <div className="adm-tiles">
        {tiles.map((tile) => (
          <button key={tile.label} type="button" className="adm-tile" onClick={() => go(tile.route)}>
            <span className="adm-tile-label">{tile.icon}{tile.label}</span>
            <span className="adm-tile-value">{tile.value}</span>
            <span className="adm-muted adm-small">{tile.hint}</span>
          </button>
        ))}
      </div>

      <div className="adm-columns">
        <LayerCard className="adm-card adm-card-flush">
          <div className="adm-card-title">Recently updated</div>
          {recent === null ? (
            <p className="adm-muted adm-pad">Loading…</p>
          ) : latest.length === 0 ? (
            <p className="adm-muted adm-pad">No saved changes yet.</p>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Section</Table.Head>
                  <Table.Head>Last saved</Table.Head>
                  <Table.Head> </Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {latest.map((item) => (
                  <Table.Row key={item.content_key}>
                    <Table.Cell>{sectionByKey(item.content_key)?.label}</Table.Cell>
                    <Table.Cell>{formatDate(item.updated_at)}</Table.Cell>
                    <Table.Cell>
                      <Button variant="ghost" size="sm" onClick={() => go(`content/${item.content_key}`)}>Edit</Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </LayerCard>

        <LayerCard className="adm-card">
          <div className="adm-card-title adm-card-title-inset">All sections</div>
          <div className="adm-section-map">
            {GROUPS.map((group) => (
              <div key={group}>
                <div className="adm-eyebrow">{group}</div>
                <div className="adm-chip-row">
                  {SECTIONS.filter((section) => section.group === group).map((section) => (
                    <button key={section.key} type="button" className="adm-chip" onClick={() => go(`content/${section.key}`)}>
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="adm-muted adm-small">
            <Badge variant="neutral">Tip</Badge> Changes go live when you press “Save changes”. Visitors see them after refreshing the page.
          </p>
        </LayerCard>
      </div>
    </div>
  );
}
