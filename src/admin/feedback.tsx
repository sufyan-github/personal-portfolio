import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Button } from "@cloudflare/kumo/components/button";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { createKumoToastManager } from "@cloudflare/kumo/components/toast";

// ─── Toasts ────────────────────────────────────────────────────────────────
export const toastManager = createKumoToastManager();

export const notify = {
  success: (title: string, description?: string) => toastManager.add({ title, description, variant: "success" }),
  error: (title: string, description?: string) => toastManager.add({ title, description, variant: "error" }),
  info: (title: string, description?: string) => toastManager.add({ title, description, variant: "info" }),
};

// ─── Confirmation dialog ───────────────────────────────────────────────────
export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm>(async () => false);

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((answer: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((next) => {
    resolver.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (answer: boolean) => {
    resolver.current?.(answer);
    resolver.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog.Root open={options !== null} onOpenChange={(open) => { if (!open) settle(false); }}>
        <Dialog className="adm-dialog" size="sm">
          <Dialog.Title className="adm-dialog-title">{options?.title}</Dialog.Title>
          <Dialog.Description className="adm-dialog-text">{options?.description}</Dialog.Description>
          <div className="adm-dialog-actions">
            <Button variant="secondary" onClick={() => settle(false)}>Cancel</Button>
            <Button variant={options?.destructive === false ? "primary" : "destructive"} onClick={() => settle(true)}>
              {options?.confirmLabel ?? "Delete"}
            </Button>
          </div>
        </Dialog>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
}
