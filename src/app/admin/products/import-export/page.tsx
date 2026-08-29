'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

export default function ProductImportExportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    importedCount?: number;
    errors?: string[];
    error?: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || '';
      setCsvContent(text);

      // Parse simple preview lines
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const parsedPreview = lines.slice(0, 6).map((line) => {
        // Basic split for visual preview
        return line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim());
      });
      setPreviewRows(parsedPreview);
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    setImporting(true);
    setResult(null);

    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          importedCount: data.importedCount,
          errors: data.errors,
        });
        setFile(null);
        setCsvContent('');
        setPreviewRows([]);
      } else {
        setResult({
          success: false,
          error: data.error || 'Import failed. Check CSV formatting.',
        });
      }
    } catch (err) {
      console.error(err);
      setResult({
        success: false,
        error: 'Failed to upload and import products',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Excel / CSV Import & Export Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 pl-10">
            Bulk export all products to Excel/CSV or upload an Excel spreadsheet to add multiple toys at once.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/products/sample-template"
            download="playmiso_products_sample_template.csv"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-colors tap-bounce"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Download Sample Excel</span>
          </a>

          <a
            href="/api/products/export"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-all tap-bounce"
          >
            <Download className="w-4 h-4" />
            <span>Export Products (Excel)</span>
          </a>
        </div>
      </div>

      {/* Result Alerts */}
      {result?.success && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl text-emerald-950 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Successfully imported {result.importedCount} toys into PlayMiso catalog! 🎉</span>
          </div>
          <p className="text-xs text-emerald-700">
            All toys, prices, categories, image galleries, and SEO fields have been published live to the store.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/admin/products"
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
            >
              View Inventory Table
            </Link>
            <Link
              href="/shop"
              className="bg-white text-emerald-900 border border-emerald-300 text-xs font-bold px-4 py-2 rounded-xl"
            >
              View in Storefront
            </Link>
          </div>
        </div>
      )}

      {result?.success === false && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl text-rose-950 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-rose-900">Import Error</h4>
            <p className="text-xs text-rose-700 mt-0.5">{result.error}</p>
          </div>
        </div>
      )}

      {/* Grid: 2 Columns (Download Template / Export & Upload File) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sample Template & Guidelines */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-toy-orange font-black text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Step 1: Excel Format Guidelines</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 leading-snug">
              Download the Pre-Formatted Sample Template
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Open the sample CSV template in <strong>Microsoft Excel</strong>, <strong>Google Sheets</strong>, or <strong>Apple Numbers</strong>. Fill in your toy details and save it as CSV.
            </p>

            {/* Column Guide Pills */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800">Supported Columns:</h4>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="bg-slate-100 px-2 py-1 rounded-md">Title *</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Category</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Price (INR) *</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Compare At Price (MRP)</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Discount %</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Stock</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Age Group</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Brand</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Image URLs</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Demo Video URL</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md">Meta Title & Description</span>
              </div>
            </div>
          </div>

          <a
            href="/api/products/sample-template"
            download="playmiso_products_sample_template.csv"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 tap-bounce text-center transition-all"
          >
            <Download className="w-4 h-4 text-toy-yellow" />
            <span>Download Sample Excel Template (.csv)</span>
          </a>
        </div>

        {/* Card 2: Upload CSV File */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-wider">
            <Upload className="w-4 h-4" />
            <span>Step 2: Upload & Import</span>
          </div>

          <h3 className="text-lg font-black text-slate-900 leading-snug">
            Upload Your Completed Excel / CSV Spreadsheet
          </h3>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-toy-orange rounded-3xl p-6 text-center space-y-3 bg-slate-50/50 transition-colors">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-xs border border-slate-200">
                📊
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 cursor-pointer">
                  <span className="text-toy-orange hover:underline">Click to browse file</span> or drag & drop
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports .CSV files exported from Excel & Google Sheets</p>
              </div>

              {file && (
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || importing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xs tap-bounce transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{importing ? 'Importing Products to Database...' : 'Import Products to Store'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* CSV Preview Table */}
      {previewRows.length > 0 && (
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Uploaded Spreadsheet Preview (First 5 Rows)</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{previewRows.length - 1} rows parsed</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  {previewRows[0]?.map((head, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/60">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-800 whitespace-nowrap max-w-xs truncate">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
