// 업로드 탭 step2 - 하단우측 옵션 입력 패널

import DatePickerField from "@/components/form/DatePickerField";
import LocationSelector from "@/components/form/LocationSelector";
import HoldCountSelector from "./HoldCountSelector";

export default function UploadOptionsPanel({ form }: { form: any }) {
  return (
    <div className="p-4 flex flex-col flex-1 gap-4">
      <DatePickerField name="date" />
      <LocationSelector onSelect={(location) => form.setValue("location", location)} />
      <HoldCountSelector label="시도 문제 수" />
      <HoldCountSelector label="완등 문제 수" />
    </div>
  );
}
