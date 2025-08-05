// 업로드 탭 step1
import UploadEmptyState from "./UploadEmptyState";
import UploadPreviewList from "./UploadPreviewList";

export default function UploadStepSelect(props: any) {
   const { files, removeFile } = props;
   return files.length === 0 ? (
      <UploadEmptyState {...props} />
   ): (
         // 가로 스크롤 썸네일 영역
         <UploadPreviewList files={files} removeFile={removeFile} />
      );
}