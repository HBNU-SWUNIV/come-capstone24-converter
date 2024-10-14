
import React, {useEffect} from 'react';
import {Document, Page} from 'react-pdf';
import { ZoomIn, ZoomOut, ChevronUp, ChevronDown } from 'lucide-react';


interface PDFViewerProps {
    imageurl: string | null;
    pageNumber: number;
    setPageNumber: (pageNumber: number) => void;
    pageScale: number;
    setPageScale: (pageScale: number) => void;
    totalPages: number;
    onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
    imageurl, 
    pageNumber, 
    setPageNumber, 
    pageScale, 
    setPageScale, 
    totalPages, 
    onDocumentLoadSuccess 
  }) => {
    useEffect(() => {
      console.log(`현재 페이지: ${pageNumber}`);
    }, [pageNumber]);
  
    return (
      <div style={{ width: '50%', overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', backgroundColor: '#f0f0f0', padding: "10px" }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setPageScale(pageScale >= 3 ? 3 : pageScale + 0.1)} style={{ marginRight: '10px' }}>
              <ZoomIn />
            </button>
            <button onClick={() => setPageScale(pageScale <= 1 ? 1 : pageScale - 0.1)}>
              <ZoomOut />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <button onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1} style={{ marginRight: '10px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}>
              <ChevronUp />
            </button>
            <input
              type="text"
              value={pageNumber || ''}
              onChange={e => {
                const value = e.target.value;
                const numValue = parseInt(value, 10);
                if (!isNaN(numValue) && numValue >= 1 && numValue <= totalPages) {
                  setPageNumber(numValue);
                }
              }}
              style={{
                width: '40px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginRight: '10px',
                padding: '5px',
              }}
            />
            <button onClick={() => pageNumber < totalPages && setPageNumber(pageNumber + 1)} disabled={pageNumber >= totalPages} style={{ marginLeft: '0px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}>
              <ChevronDown />
            </button>
          </div>
        </div>
  
        <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={pageScale} />
        </Document>
      </div>
    );
  };
  
  export default PDFViewer;