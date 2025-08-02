import { ChangeEvent } from "react";

import { Input } from "@/components/ui/input"

interface InputFieldProps {
   name: string;
   value: string;
   placeholder: string;
   type?: string;
   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
   error?: string;
}

export default function InputField({
   name,
   value,
   placeholder,
   type = "text",
   onChange,
   error
}: InputFieldProps) {
   return (
      <>
         <div className="grid w-full max-w-sm items-center gap-3">
            <Input
               name={name}
               value={value}
               onChange={onChange}
               placeholder={placeholder}
               type={type}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
         </div></>
   );
}