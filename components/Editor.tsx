"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill-new"), {
//   ssr: false,
// });

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill-new"), {
        ssr: false,
      }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill value={value} onChange={onChange} theme="snow" />
    </div>
  );
};

export default Editor;
