import { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  useSystemFonts: false,
  disableFontFace: false,
  fontExtraProperties: true,
};

export function PDFViewer({ pdfFile }: { pdfFile?: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Failed to load PDF:", error);
  }, []);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

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
      {pdfFile && (
        <div
          ref={containerRef}
          className="overflow-auto h-full flex justify-center items-start scrollbar-hide"
          style={{
            height: "calc(100vh - 100px)",
            minHeight: "calc(100vh - 100px)",
            scrollbarWidth: "none",
          }}
        >
          <div className="py-4">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={options}
            >
              <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          </div>
        </div>
      )}
      {numPages > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border px-4 py-2 flex items-center gap-2 w-full justify-center">
            <Button variant="ghost" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm font-medium min-w-[3ch] text-center">{pageNumber}</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground min-w-[2ch]">{numPages}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
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
