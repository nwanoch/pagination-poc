import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import TiptapEditor from "./TipTapEditor";

interface A4PaginatedContentProps {
  content: string;
}

const A4PaginatedContent: React.FC<A4PaginatedContentProps> = ({ content }) => {
  const [pages, setPages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dummyElementRef = useRef<HTMLDivElement>(null);

  const pageHeightMm = 170; // Height of A4 in mm
  const pxToMm = (px: number) => (px * 25.4) / 96; // Conversion factor from px to mm

  useEffect(() => {
    // Initial content split
    splitContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const splitContent = (text: string) => {
    const tempPages = [];
    let currentPage = "";
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      currentPage += words[i] + " ";
      if (calculateContentHeightMm(currentPage) > pageHeightMm) {
        tempPages.push(currentPage.trim());
        currentPage = "";
      }
    }
    if (currentPage) tempPages.push(currentPage.trim());
    setPages(tempPages);
  };

  const calculateContentHeightMm = (text: string) => {
    if (!dummyElementRef.current) return 0;

    dummyElementRef.current.textContent = text;
    const heightPx = dummyElementRef.current.offsetHeight;
    dummyElementRef.current.textContent = "";

    const heightMm = pxToMm(heightPx);

    return heightMm;
  };

  const handleEditorUpdate = debounce(
    (pageIndex: number, editorContent: string) => {
      const updatedPages = [...pages];
      updatedPages[pageIndex] = editorContent;
      console.log(calculateContentHeightMm(editorContent));
      if (calculateContentHeightMm(editorContent) > pageHeightMm) {
        splitContent(updatedPages.join(" "));
      } else {
        setPages(updatedPages);
      }
    },
    300
  ); // Debounce the update handling by 300ms

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center bg-black h-full overflow-y-auto"
    >
      <div
        ref={dummyElementRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          width: "210mm",
          whiteSpace: "pre-wrap",
          lineHeight: "1.5",
          fontSize: "14px",
        }}
      ></div>
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className="w-[210mm] h-[297mm] bg-white border border-solid border-black shadow-md m-4 px-12 py-20 overflow-hidden text-justify relative"
        >
          <div className="text-sm leading-7">
            <TiptapEditor
              content={page}
              onUpdate={(content) => handleEditorUpdate(pageIndex, content)}
            />
          </div>
          <p className="absolute top-10 right-12 text-sm text-black">
            {pageIndex + 1}
          </p>
        </div>
      ))}
    </div>
  );
};

export default A4PaginatedContent;
