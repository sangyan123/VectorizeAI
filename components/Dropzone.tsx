import React, { useCallback, useState } from 'react';

interface DropzoneProps {
  onImageSelected: (base64: string, previewUrl: string) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onImageSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (JPG, PNG).");
      return;
    }

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onImageSelected(base64, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative group cursor-pointer
        border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
        ${isDragging 
          ? 'border-primary bg-primary/10 scale-[1.02]' 
          : 'border-slate-600 hover:border-slate-400 bg-slate-800/50 hover:bg-slate-800'}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={onInputChange}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full bg-slate-700/50 group-hover:bg-slate-700 transition-colors ${isDragging ? 'animate-bounce' : ''}`}>
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium text-slate-200">
            {isDragging ? "Drop it like it's hot!" : "Click or drag image here"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Supports JPG, PNG (Max 5MB recommended)
          </p>
        </div>
      </div>
    </div>
  );
};