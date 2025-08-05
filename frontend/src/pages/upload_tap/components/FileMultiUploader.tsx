import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function MultiFileUploader() {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop,
    multiple: true,
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <div className="w-full">
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          사진/동영상을 끌어다 놓거나 클릭해서 업로드하세요.
        </p>
      </div>

      {/* 미리보기 섹션 */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {files.map((file) => (
            <div key={file.name} className="relative">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.preview}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <video
                  src={file.preview}
                  className="w-full h-32 object-cover rounded-md"
                  controls
                />
              )}
              <button
                onClick={() => removeFile(file.name)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
