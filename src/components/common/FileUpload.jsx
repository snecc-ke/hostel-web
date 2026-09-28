import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

function FileUpload({ files = [], onChange, maxFiles = 10, maxSizeMB = 5 }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (fileList) => {
    setError('');
    const incoming = Array.from(fileList);

    if (files.length + incoming.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} photos`);
      return;
    }

    const valid = [];
    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Each photo must be under ${maxSizeMB}MB`);
        continue;
      }
      valid.push({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (valid.length) onChange([...files, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

 const removeAt = (index) => {
  const next = [...files];
  if (next[index].file) URL.revokeObjectURL(next[index].preview);
  next.splice(index, 1);
  onChange(next);
};
  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
        style={{
          borderColor: dragActive ? '#E9A23B' : '#D1D5DB',
          backgroundColor: dragActive ? 'rgba(233,162,59,0.08)' : '#FFFFFF',
        }}
      >
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(233,162,59,0.15)' }}>
            <Upload size={24} style={{ color: '#E9A23B' }} />
          </div>
        </div>
        <p className="font-semibold" style={{ color: '#14213D' }}>
          Drop photos here or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG · Max {maxSizeMB}MB each · Up to {maxFiles} photos
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Error */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Previews */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {files.map((f, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white">
              <img src={f.preview} alt={f.name} className="w-full h-24 object-cover" />
              {i === 0 && (
                <span
                  className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
                  style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
                >
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden empty icon when no files */}
      {files.length === 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <ImageIcon size={14} />
          <span>No photos uploaded yet</span>
        </div>
      )}
    </div>
  );
}

export default FileUpload;