'use client';

import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AppContext } from 'src/app/context/AppContext';

// Worker from /public
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

type Props = {
  file: string;
};

export default function PdfViewer({ file }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);
  const { isMobile } = useContext(AppContext)

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const safeWidth = Math.floor(rect.width);
      const safeHeight = Math.floor(rect.height);

      if (isMobile) {
        if (safeWidth > 0 && safeWidth !== width) {
          setWidth(safeWidth);
          setHeight(null);
          setRenderKey(k => k + 1);
        }
      } else {
        if (safeHeight > 0 && safeHeight !== height) {
          setHeight(safeHeight);
          setWidth(null);
          setRenderKey(k => k + 1);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, width, height]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className='pdf__viewer' ref={containerRef}
      style={{ height: isMobile ? 'auto' : '100%', width: isMobile ? '100%' : 'auto' }}>
      {/* Navigation */}
      {numPages > 1 && pageNumber > 1 ?
        <button
          onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
          disabled={pageNumber === 1}
          className='pdf__controls-arrow-left' >
          〈
        </button> : ''}
      {numPages > 1 && pageNumber < numPages ?
        <button
          onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
          disabled={pageNumber === numPages}
          className='pdf__controls-arrow-right'>
          〉
        </button> : ''}
      <Document key={renderKey} file={file} onLoadSuccess={onLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          height={!isMobile ? height! : undefined}
          width={isMobile ? width! : undefined}
        />
      </Document>

    </div>
  );
}
