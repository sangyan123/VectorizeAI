import React, { useEffect, useState } from 'react';

interface SvgPreviewProps {
  svgCode: string;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({ svgCode }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svgCode]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `vector-art-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode).then(() => {
      alert("SVG code copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-slate-800/30 rounded-lg border border-slate-700 overflow-hidden relative flex items-center justify-center p-4">
        {/* Render SVG safely via img tag or dangerouslySetInnerHTML. 
            Using dangerouslySetInnerHTML allows interactions if we added them, 
            but img tag is safer for display. Let's use innerHTML for crisp rendering. */}
        <div 
          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[500px]"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
      
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-2 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download SVG
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600"
          title="Copy Code"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};