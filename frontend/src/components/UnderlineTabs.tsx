// UnderlineTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useMemo, PropsWithChildren } from "react";

type TabItem = { value: string; label: string };
type UnderlineTabsProps = {
   items: TabItem[];
   value: string;
   onValueChange: (v: string) => void;
   className?: string;
   equalWidth?: boolean; // 탭 너비 같게
   layoutId?: string;
};

export function UnderlineTabs({
   items, value, onValueChange, className = "", equalWidth = true, layoutId = "underline", children,
}: PropsWithChildren<UnderlineTabsProps>) {
   const activeIndex = useMemo(
      () => Math.max(0, items.findIndex(t => t.value === value)),
      [items, value]
   );
   const percent = 100 / items.length;
   const left = activeIndex * percent;

   return (
      <Tabs value={value} onValueChange={onValueChange} className={className}>
         <div className="relative">
            <TabsList className="w-full bg-transparent h-auto p-0 border-b flex relative rounded-none">
               {items.map(t => (
                  <TabsTrigger
                     key={t.value}
                     value={t.value}
                     className="bg-transparent px-0 py-3 text-sm
                         text-muted-foreground data-[state=active]:text-foreground
                         data-[state=active]:font-semibold
                        shadow-none data-[state=active]:shadow-none"
                     style={equalWidth ? { flex: 1 } : undefined}
                  >
                     {t.label}
                  </TabsTrigger>
               ))}
               <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 h-[1px] rounded bg-foreground"
                  style={{ width: `${percent}%` }}
                  animate={{ left: `${left}%` }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
               />
            </TabsList>
         </div>

         {children}
      </Tabs>
   );
}

export { TabsContent as UnderlineTabsContent } from "@/components/ui/tabs";
