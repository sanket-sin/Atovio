"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Fires `active` when parent `<details>` is opened so in-panel animations can run. */
export function DetailsPanelAnimation({ children }: { children: (active: boolean) => ReactNode }) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const details = root?.closest("details");
    if (!details) return;

    const sync = () => {
      if (details.open) {
        requestAnimationFrame(() => setActive(true));
      } else {
        setActive(false);
      }
    };

    sync();
    details.addEventListener("toggle", sync);
    return () => details.removeEventListener("toggle", sync);
  }, [root]);

  return <div ref={setRoot}>{children(active)}</div>;
}
