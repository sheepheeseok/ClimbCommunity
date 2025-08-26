/*

import React, { createContext, useContext, useMemo, useState } from "react";
import { makeFakeNotifications } from "./fakes";
import type { NotificationItemModel } from "./NotificationDrawer";

type Ctx = {
   open: boolean;
   setOpen: (v: boolean) => void;
   items: NotificationItemModel[];
   setItems: React.Dispatch<React.SetStateAction<NotificationItemModel[]>>;
   unread: number;
   openDrawer: () => void;
   closeDrawer: () => void;
   pushRandom: () => void;
};

const AlertDrawerContext = createContext<Ctx | null>(null);

export function AlertDrawerProvider({ children }: { children: React.ReactNode }) {
   const [open, setOpen] = useState(false);
   const [items, setItems] = useState<NotificationItemModel[]>(() => makeFakeNotifications(28));
   const unread = useMemo(() => items.filter(i => i.unread).length, [items]);
   const pushRandom = () => setItems(prev => [makeFakeNotifications(1)[0], ...prev]);

   return (
      <AlertDrawerContext.Provider
         value={{ open, setOpen, items, setItems, unread, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false), pushRandom }}
      >
         {children}
      </AlertDrawerContext.Provider>
   );
}

export function useAlertDrawer() {
   const ctx = useContext(AlertDrawerContext);
   if (!ctx) throw new Error("useAlertDrawer must be used within AlertDrawerProvider");
   return ctx;
}

*/