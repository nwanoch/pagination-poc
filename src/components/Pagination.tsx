import React, { useState, useEffect, useRef } from "react";

interface A4PaginatedContentProps {
  content: string;
}

const A4PaginatedContent: React.FC<A4PaginatedContentProps> = ({ content }) => {
  const [pages, setPages] = useState<string[]>([]);

  const wordsPerPage = 650;
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = content.split(" ");
    const pagesArray: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pagesArray.push(words.slice(i, i + wordsPerPage).join(" "));
    }
    setPages(pagesArray);
    pageRefs.current = pagesArray.map(() => null);
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center bg-black h-screen overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white w-full"></div>
      {pages.map((page, index) => (
        <div key={index} ref={(el) => (pageRefs.current[index] = el)}>
          <div className="w-[210mm] h-[297mm] bg-white border relative border-solid border-black shadow-md m-4 px-12 py-20 overflow-hidden text-justify">
            <p className="text-sm leading-6">{page}</p>
            <p className="absolute bottom-4 right-4 text-sm text-black">
              Page {index + 1} of {pages.length}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default A4PaginatedContent;
