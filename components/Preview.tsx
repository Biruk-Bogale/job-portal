"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css";

// const ReactQuill = dynamic(() => import("react-quill-new"), {
//   ssr: false,
// });

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill-new"), {
        ssr: false,
      }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill value={value} theme="bubble" readOnly />
    </div>
  );
};

export default Preview;
