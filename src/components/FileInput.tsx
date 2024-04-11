"use client";
import React, { ChangeEvent, useState } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface FileInputProps {
  onUpload: (files: File[]) => void;
  allowMultipleFiles?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  onUpload,
  allowMultipleFiles,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
      onUpload([...selectedFiles, ...files]); // Call the onUpload function with the updated files
      console.log(files[0]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-8 max-w-40">
        <label className="flex flex-col justify-center items-center border border-dashed rounded-xl p-5 border-black">
          <ImageIcon />
          <span className="text-gray-700">Drag and drop</span>
          <p>OR</p>
          <input
            type="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            multiple={allowMultipleFiles}
          />
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4 w-full overflow-x-scroll">
          <ul
            className="flex items-center justify-center"
            style={{ width: `${selectedFiles.length * 120}px` }}
          >
            {selectedFiles.map((file, index) => (
              <li key={index} className="w-fit p-1 relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={100}
                  height={100}
                />
                <button
                  className="absolute top-0 right-0 rounded-full bg-white px-2  text-black dark:text-white  cursor-pointer transition-all duration-300"
                  onClick={() => removeFile(index)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileInput;
