// src/components/form/DatePickerField.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export default function DatePickerField({ name = "date" }: { name?: string }) {
   const { setValue } = useFormContext();
   const [date, setDate] = useState<Date>();
   const [open, setOpen] = useState(false);

   return (
      <FormField
         name={name}
         render={() => (
            <FormItem>
               <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full justify-start text-left font-normal"
                        >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {date ? date.toLocaleDateString("ko-KR") : <span className="text-gray-500">날짜 추가</span>}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0">
                        <Calendar
                           mode="single"
                           selected={date}
                           onSelect={(selected) => {
                              setDate(selected);
                              setValue(name, selected?.toISOString() ?? "");
                              setOpen(false);
                           }}
                           disabled={{ after: new Date() }}
                           autoFocus
                        />
                     </PopoverContent>
                  </Popover>
               </FormControl>
            </FormItem>
         )}
      />
   );
}