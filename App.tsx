import React, { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { SvgPreview } from './components/SvgPreview';
import { generateSvg } from './services/geminiService';
import { VectorStyle, ProcessingState } from './types';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  
  const [selectedStyle, setSelectedStyle] = useState<VectorStyle>(VectorStyle.REALISTIC);
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    progress: '',
    error: null
  });

  const handleImageSelect = (base64: string, previewUrl: string) => {
    setOriginalImage(previewUrl);
    setBase64Data(base64);
    setGeneratedSvg(null); // Reset previous result
    setState({ isProcessing: false, progress: '', error: null });
  };

  const handleGenerate = async () => {
    if (!base64Data) return;

    setState({
      isProcessing: true,
      progress: 'Analyzing image structure...',
      error: null
    });

    try {
      // Small artificial delay to show state change if API is too fast (rare for vision)
      await new Promise(r => setTimeout(r, 500));
      
      setState(prev => ({ ...prev, progress: `Generating ${selectedStyle} vectors...` }));
      
      const svg = await generateSvg(base64Data, selectedStyle);
      
      setGeneratedSvg(svg);
      setState({ isProcessing: false, progress: '', error: null });
    } catch (err: any) {
      setState({
        isProcessing: false,
        progress: '',
        error: err.message || "Something went wrong during generation."
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100 selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              VectorizeAI
            </h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            Powered by Gemini 3 Flash Vision
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Empty State */}
        {!originalImage && (
          <div className="max-w-2xl mx-auto mt-12 mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              Turn Images into <span className="text-primary">Vector Art</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Upload a JPG or PNG. Our AI analyzes the visual structure and rewrites it as clean, scalable SVG code. Perfect for logos, icons, and illustrations.
            </p>
            <Dropzone onImageSelected={handleImageSelect} />
          </div>
        )}

        {/* Workspace */}
        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* Left Column: Input & Controls */}
            <div className="flex flex-col gap-6">
              <div className="bg-card rounded-xl border border-slate-700 p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-300">Original Raster</h3>
                  <button 
                    onClick={() => {
                        setOriginalImage(null);
                        setBase64Data(null);
                        setGeneratedSvg(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Change Image
                  </button>
                </div>
                <div className="relative flex-1 bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="bg-card rounded-xl border border-slate-700 p-6 shadow-xl">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Vectorization Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(VectorStyle).map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        disabled={state.isProcessing}
                        className={`
                          text-xs sm:text-sm py-2 px-3 rounded-lg border transition-all
                          ${selectedStyle === style 
                            ? 'bg-primary/20 border-primary text-primary font-medium' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                        `}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={state.isProcessing}
                  className={`
                    w-full py-3.5 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all
                    ${state.isProcessing 
                      ? 'bg-slate-700 text-slate-400 cursor-wait' 
                      : 'bg-white text-dark hover:bg-slate-200 hover:scale-[1.01] hover:shadow-primary/20'}
                  `}
                >
                  {state.isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      Generate SVG
                    </>
                  )}
                </button>
                
                {state.isProcessing && (
                  <p className="text-center text-sm text-slate-400 mt-3 animate-pulse">
                    {state.progress}
                  </p>
                )}
                {state.error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {state.error}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="bg-card rounded-xl border border-slate-700 p-4 flex flex-col h-full shadow-2xl">
              <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
                Vector Preview
                {generatedSvg && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ready</span>}
              </h3>
              
              <div className="flex-1 min-h-0 relative">
                {generatedSvg ? (
                  <SvgPreview svgCode={generatedSvg} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/20">
                    {state.isProcessing ? (
                      <div className="text-center">
                         <svg className="w-16 h-16 text-primary animate-spin-slow mb-4 mx-auto" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         <p className="text-lg font-medium text-slate-300">AI is drawing your vectors...</p>
                         <p className="text-sm mt-2 max-w-xs mx-auto">This takes 5-10 seconds depending on complexity.</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        <p>Output will appear here</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;