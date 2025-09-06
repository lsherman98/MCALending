import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, RotateCcw, FileText, X, List } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  useSystemFonts: false,
  disableFontFace: false,
  fontExtraProperties: true,
};

interface PDFViewerProps {
  pdfFile?: string;
  statements?: any[];
  selectedStatement?: any;
  onStatementSelect?: (statement: any) => void;
}

export function PDFViewer({ pdfFile, statements, selectedStatement, onStatementSelect }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [showFileBrowser, setShowFileBrowser] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Failed to load PDF:", error);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pages = container.querySelectorAll("[data-page-number]");
      let currentPageInView = 1;

      pages.forEach((page) => {
        const rect = page.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if page is in the center of the viewport
        if (rect.top <= containerRect.height / 2 && rect.bottom >= containerRect.height / 2) {
          currentPageInView = parseInt(page.getAttribute("data-page-number") || "1");
        }
      });

      setCurrentPage(currentPageInView);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [numPages]);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const downloadPdf = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = "document.pdf";
      link.click();
    }
  };

  return (
    <div className="relative h-full">
      {/* File Browser Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFileBrowser(!showFileBrowser)}
        className="absolute top-2 left-2 z-40 bg-white shadow-sm"
      >
        <List />
      </Button>
      {showFileBrowser && (
        <div className="absolute top-0 left-0 w-80 h-full bg-white dark:bg-gray-800 border-r border-border z-50 shadow-lg">
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Statements</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFileBrowser(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {statements?.map((stmt) => (
                <Button
                  key={stmt.id}
                  variant={selectedStatement?.id === stmt.id ? "outline" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => {
                    onStatementSelect?.(stmt);
                    setShowFileBrowser(false);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {stmt.filename || `Statement ${stmt.id.slice(-6)}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stmt.created ? new Date(stmt.created).toLocaleDateString() : "No date"}
                    </div>
                  </div>
                </Button>
              ))}
              {(!statements || statements.length === 0) && (
                <div className="text-sm text-muted-foreground text-center py-4">No statements found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {pdfFile && (
        <div
          ref={containerRef}
          className="overflow-auto h-full flex flex-col items-center scrollbar-hide"
          style={{
            height: "calc(100vh - 100px)",
            minHeight: "calc(100vh - 100px)",
            scrollbarWidth: "none",
          }}
        >
          <div className="py-4 space-y-4">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={options}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} data-page-number={index + 1} className="mb-4">
                  <Page pageNumber={index + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
                </div>
              ))}
            </Document>
          </div>
        </div>
      )}
      {numPages > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 w-full justify-center">
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm font-medium min-w-[3ch] text-center">{currentPage}</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground min-w-[2ch]">{numPages}</span>
            </div>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 1} className="h-8 w-8 p-0">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2">
              <span className="text-sm font-medium min-w-[3ch] text-center">{Math.round(scale * 100)}%</span>
            </div>
            <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 3} className="h-8 w-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetZoom} className="h-8 w-8 p-0" title="Reset zoom">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="sm" onClick={downloadPdf} className="h-8 w-8 p-0" title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
