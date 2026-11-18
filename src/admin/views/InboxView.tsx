import { useCallback, useEffect, useState } from "react";
import { Button } from "@cloudflare/kumo/components/button";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { Empty } from "@cloudflare/kumo/components/empty";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import { Table } from "@cloudflare/kumo/components/table";
import { ArrowsClockwiseIcon, EnvelopeOpenIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { adminRecords } from "@/lib/contentClient";
import { formatDate } from "../content";
import { notify } from "../feedback";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  created_at: string;
}

export function InboxView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Message | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await adminRecords("contacts"));
    } catch (e) {
      notify.error("Could not load the inbox", (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Inbox</h1>
          <p className="adm-muted">Messages sent through the contact form. Private — the newest 100 are shown.</p>
        </div>
        <div className="adm-actions">
          <Button variant="secondary" icon={<ArrowsClockwiseIcon />} onClick={load}>Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="adm-center"><Loader size="lg" /></div>
      ) : messages.length === 0 ? (
        <LayerCard className="adm-card">
          <Empty size="sm" icon={<EnvelopeOpenIcon size={32} />} title="No messages yet" description="Messages from the contact form will appear here." />
        </LayerCard>
      ) : (
        <LayerCard className="adm-card adm-card-flush">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>From</Table.Head>
                <Table.Head>Subject</Table.Head>
                <Table.Head>Received</Table.Head>
                <Table.Head> </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {messages.map((message) => (
                <Table.Row key={message.id}>
                  <Table.Cell>
                    <span className="adm-strong">{message.name}</span>
                    <span className="adm-muted adm-small adm-block">{message.email}</span>
                  </Table.Cell>
                  <Table.Cell><span className="adm-clip">{message.subject || message.message}</span></Table.Cell>
                  <Table.Cell>{formatDate(message.created_at)}</Table.Cell>
                  <Table.Cell><Button variant="secondary" size="sm" onClick={() => setOpen(message)}>Read</Button></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </LayerCard>
      )}

      <Dialog.Root open={open !== null} onOpenChange={(next) => { if (!next) setOpen(null); }}>
        <Dialog className="adm-dialog" size="lg">
          <Dialog.Title className="adm-dialog-title">{open?.subject || "Message"}</Dialog.Title>
          <Dialog.Description className="adm-dialog-text">
            {open ? `${open.name} · ${open.email} · ${formatDate(open.created_at)}` : ""}
          </Dialog.Description>
          <div className="adm-message">{open?.message}</div>
          <div className="adm-dialog-actions">
            <Button variant="secondary" onClick={() => setOpen(null)}>Close</Button>
            {open && (
              <a className="adm-button-link adm-button-link-primary" href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject ?? "your message"}`)}`}>
                <PaperPlaneTiltIcon size={16} /> Reply by email
              </a>
            )}
          </div>
        </Dialog>
      </Dialog.Root>
    </div>
  );
}
