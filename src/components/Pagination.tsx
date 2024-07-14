import React, { useState, useEffect, useRef } from "react";
import PaginationControls from "./PaginationControl";

interface A4PaginatedContentProps {
  content: string;
}

const A4PaginatedContent: React.FC<A4PaginatedContentProps> = ({ content }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 650;
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const words = content.split(" ");
    const pagesArray: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pagesArray.push(words.slice(i, i + wordsPerPage).join(" "));
    }
    setPages(pagesArray);
    pageRefs.current = pagesArray.map(() => null);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current || !containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.scrollTop;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageElement = pageRefs.current[i];
        if (pageElement) {
          const pageTop = pageElement.offsetTop - container.offsetTop;
          const pageBottom = pageTop + pageElement.clientHeight;

          if (pageTop <= containerTop && pageBottom > containerTop) {
            setCurrentPage(i + 1);
            break;
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pages]);

  const scrollToPage = (page: number) => {
    isScrolling.current = true;
    setCurrentPage(page);

    if (containerRef.current) {
      const container = containerRef.current;

      if (page === 1) {
        // Scroll to the top for the first page
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else if (page === pages.length) {
        // Scroll to the bottom for the last page
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      } else {
        // For other pages, use the existing logic
        const targetPage = pageRefs.current[page - 1];
        if (targetPage) {
          const targetOffset = targetPage.offsetTop - container.offsetTop;
          container.scrollTo({ top: targetOffset, behavior: "smooth" });
        }
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    } else {
      isScrolling.current = false;
    }
  };

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
          <PaginationControls
            currentPage={currentPage}
            totalPages={pages.length}
            onPageChange={scrollToPage}
          />
        </div>
      ))}
    </div>
  );
};

export default A4PaginatedContent;
