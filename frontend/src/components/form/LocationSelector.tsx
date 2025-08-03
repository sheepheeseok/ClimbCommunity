import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
   onSelect: (location: string) => void;
}

const dummyLocations = [
   "강남클라이밍짐",
   "홍대클라이밍센터",
   "부산암장",
   "대전클라이밍짐",
   "인천클라이밍존",
   "수원클라이밍짐",
   "광주암장",
   "제주클라이밍짐"
];

const dummyRecent = ["홍대클라이밍센터", "부산암장", "강남클라이밍짐"]; // 최근검색어 가데이터

export default function LocationSelector({ onSelect }: LocationSelectorProps) {
   const [search, setSearch] = useState("");
   const [recent, setRecent] = useState<string[]>([]); // 최근검색어
   const [open, setOpen] = useState(false);
   const [selected, setSelected] = useState<string | null>(null); // 선택된 위치

   // 최근 검색어 초깃값 로드
   useEffect(() => {
      setRecent(dummyRecent);
   }, []);

   // 검색 결과
   const filtered = dummyLocations.filter((loc) =>
      loc.includes(search)
   ); // 가데이터

   // 항목 클릭 시
   const handleSelect = (loc: string) => {
      onSelect(loc);
      setSelected(loc);
      setOpen(false); // 선택 시 팝오버 닫기
      setSearch(""); // 선택 후 검색 초기화
   };

   const showRecent = search.trim() === "";

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="w-full justify-start text-left font-normal"
            >
               <MapPin className="mr-2 h-4 w-4" />
               <span className={selected ? "text-black" : "text-gray-500"}>
                  {selected || "위치 추가"}
               </span>
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-2">
            <Input
               placeholder="암장 이름을 검색하세요"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="mb-2"
            />
            <div className="max-h-50 overflow-y-auto">
               {showRecent ? (
                  <>
                     <p className="text-sm text-gray-500 mb-1">최근 검색</p>
                     {recent.length > 0 ? (
                        recent.map((loc, idx) => (
                           <div
                              key={idx}
                              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                              onClick={() => handleSelect(loc)}
                           >
                              {loc}
                           </div>
                        ))
                     ) : (
                        <p className="text-gray-400 text-sm">최근 검색어가 없습니다.</p>
                     )}
                  </>
               ) : filtered.length > 0 ? (
                  filtered.map((loc, idx) => (
                     <div
                        key={idx}
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleSelect(loc)}
                     >
                        {loc}
                     </div>
                  ))
               ) : (
                  <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
               )}
            </div>
         </PopoverContent>
      </Popover>
   );
}
