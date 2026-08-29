'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Film, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  acceptType?: 'image' | 'video' | 'both';
  onUploadSuccess: (url: string) => void;
  currentValue?: string;
  maxVideoDurationSeconds?: number;
  helperText?: string;
}

export default function FileUpload({
  label,
  acceptType = 'image',
  onUploadSuccess,
  currentValue = '',
  maxVideoDurationSeconds = 30,
  helperText,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentValue);
  const [error, setError] = useState<string>('');
  const [duration, setDuration] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (acceptType === 'image' && !isImage) {
      setError('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    if (acceptType === 'video' && !isVideo) {
      setError('Please select a video file (MP4, WebM).');
      return;
    }

    // Check video duration (Max 30s)
    if (isVideo) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          const videoDuration = Math.round(videoElement.duration);
          setDuration(videoDuration);

          if (videoDuration > maxVideoDurationSeconds) {
            setError(
              `⚠️ Video duration is ${videoDuration}s. Maximum allowed demo video is ${maxVideoDurationSeconds} seconds.`
            );
            resolve();
          } else {
            resolve();
          }
        };
      });

      if (videoElement.duration > maxVideoDurationSeconds) {
        return;
      }
    }

    // Upload to /api/upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', isVideo ? 'video' : 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setPreviewUrl(data.url);
        onUploadSuccess(data.url);
      } else {
        setError(data.error || 'Failed to upload file');
      }
    } catch (err: any) {
      console.error(err);
      setError('Network error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setDuration(null);
    setError('');
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        {acceptType === 'video' && (
          <span className="text-[10px] font-black text-toy-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            ⏱️ Max {maxVideoDurationSeconds}s Video
          </span>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Upload Box */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-toy-orange rounded-2xl p-4 text-center transition-colors relative group">
        <input
          ref={fileInputRef}
          type="file"
          accept={
            acceptType === 'video'
              ? 'video/mp4,video/webm,video/quicktime'
              : acceptType === 'image'
              ? 'image/png,image/jpeg,image/webp,image/gif'
              : 'image/*,video/*'
          }
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 disabled:cursor-not-allowed"
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-2 text-toy-orange">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-bold">Uploading & Optimizing File...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative inline-block group/preview z-20">
            {previewUrl.includes('.mp4') || previewUrl.startsWith('data:video') || acceptType === 'video' ? (
              <div className="space-y-2">
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-w-xs max-h-48 rounded-xl object-contain bg-black shadow-sm mx-auto"
                />
                {duration && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ Video Length: {duration}s (Approved)
                  </span>
                )}
              </div>
            ) : (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs mx-auto">
                <Image src={previewUrl} alt="Uploaded file" fill className="object-cover" sizes="112px" />
              </div>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors z-30"
              title="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center justify-center space-y-1.5 text-slate-500">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs text-toy-orange border border-slate-200 group-hover:scale-110 transition-transform">
              {acceptType === 'video' ? <Film className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">
                Click to Choose {acceptType === 'video' ? 'Toy Demo Video' : 'Image File'}
              </span>
              <p className="text-[10px] text-slate-400">or Drag and Drop from your computer / phone</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
