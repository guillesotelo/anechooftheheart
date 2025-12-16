'use client';

import { Document, Page, pdfjs } from 'react-pdf';

// Point directly to public file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfViewer({ file }: { file: string }) {
  return (
    <Document file={file}>
      <Page pageNumber={1} />
    </Document>
  );
}