import React, { useState, useEffect, useRef } from "react";

interface A4PaginatedContentProps {
  content: string;
}

const A4PaginatedContent: React.FC<A4PaginatedContentProps> = ({ content }) => {
  const [pages, setPages] = useState<string[]>([]);

  const wordsPerPage = 500;
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

  const calculateRows = (page: string, maxRows: number = 8) => {
    const words = page.split(/\s+/);
    const rowCount = Math.min(
      maxRows,
      Math.ceil(words.length / (wordsPerPage / maxRows))
    );
    return words.reduce((acc: string[][], word: string, index: number) => {
      const rowIndex = Math.floor(index / Math.ceil(words.length / rowCount));
      if (!acc[rowIndex]) acc[rowIndex] = [];
      acc[rowIndex].push(word);
      return acc;
    }, []);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center bg-black h-screen overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white w-full"></div>
      {pages.map((page, pageIndex) => {
        const rows = calculateRows(page);
        return (
          <div key={pageIndex} ref={(el) => (pageRefs.current[pageIndex] = el)}>
            <div className="w-[210mm] h-[297mm] bg-white border relative border-solid border-black shadow-md m-4 px-12 py-20 overflow-hidden text-justify">
              <div className="text-sm leading-6">
                {rows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <p>{row.join(" ")}</p>
                    {rowIndex < rows.length - 1 && (
                      <hr className="border-dashed border-black border-t-2 my-3" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="absolute top-10 right-12 text-sm text-black">
                {pageIndex + 1}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default A4PaginatedContent;
