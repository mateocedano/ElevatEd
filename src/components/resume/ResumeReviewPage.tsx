import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowLeft, Settings2, X, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 
import { resumeService } from '../../services/resumeService';
import defaultSystemPrompt from '../../prompts/resume-review-prompt.txt?raw';

interface ResumeReviewPageProps {
  onBack: () => void;
}

export default function ResumeReviewPage({ onBack }: ResumeReviewPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Prompt Editor State
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(defaultSystemPrompt);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === 'application/pdf' || 
        selectedFile.type.startsWith('image/')
      ) {
        setFile(selectedFile);
        setError(null);
        setReview(null); // Reset previous review
      } else {
        setError('Please upload a PDF or Image file.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
       if (
        selectedFile.type === 'application/pdf' || 
        selectedFile.type.startsWith('image/')
      ) {
        setFile(selectedFile);
        setError(null);
        setReview(null);
      } else {
        setError('Please upload a PDF or Image file.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setShowPromptEditor(false);

    try {
      const result = await resumeService.reviewResume(file, customPrompt);
      if (result.startsWith("Error:")) {
        setError(result);
      } else {
        setReview(result);
      }
    } catch (e) {
      setError("An unexpected error occurred during analysis.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF4F1] flex flex-col">
       {/* Header */}
       <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-[#6B7280] hover:text-[#1B3D2F] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-[#1B3D2F]">Resumé Review</h1>
           <button 
             onClick={() => setShowPromptEditor(!showPromptEditor)}
             className="p-1 text-gray-300 hover:text-[#1B3D2F] transition-colors rounded-full hover:bg-gray-100"
             title="Tune Review Prompt"
           >
             <Settings2 className="w-4 h-4" />
           </button>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Prompt Editor Modal */}
      {showPromptEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#1B3D2F]">Review Prompt Editor</h3>
                <p className="text-sm text-gray-500">Edit the instructions given to the AI reviewer.</p>
              </div>
              <button 
                onClick={() => setShowPromptEditor(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4">
               <textarea
                 value={customPrompt}
                 onChange={(e) => setCustomPrompt(e.target.value)}
                 className="w-full h-[300px] p-4 rounded-xl border border-gray-200 font-mono text-sm leading-relaxed focus:border-[#1B3D2F] focus:ring-2 focus:ring-[#1B3D2F]/20 outline-none resize-none"
                 placeholder="Enter system prompt..."
               />
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setCustomPrompt(defaultSystemPrompt)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#1B3D2F] font-medium"
              >
                Reset to Default
              </button>
              <button 
                onClick={() => setShowPromptEditor(false)}
                className="px-6 py-2 bg-[#1B3D2F] text-white rounded-lg font-medium hover:bg-[#152e24] transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
            {!file ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1B3D2F] hover:bg-gray-50 transition-all group"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-[#1B3D2F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1B3D2F] mb-1">Upload your Resumé</h3>
                    <p className="text-gray-500 text-sm mb-4">Drag & drop or click to browse (PDF, PNG, JPG)</p>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 group-hover:border-[#1B3D2F] group-hover:text-[#1B3D2F] transition-colors">
                        Select File
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,image/*"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                             <FileText className="w-5 h-5 text-[#1B3D2F]" />
                        </div>
                        <div>
                            <p className="font-medium text-[#1B3D2F]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setFile(null); setReview(null); setError(null); }}
                        className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {file && !review && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={isProcessing}
                        className={`px-8 py-3 bg-[#1B3D2F] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center ${
                            isProcessing ? 'opacity-70 cursor-wait' : ''
                        }`}
                    >
                         {isProcessing ? (
                             <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing Resumé...
                             </>
                         ) : (
                             <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Analyze Resumé
                             </>
                         )}
                    </button>
                </div>
            )}
        </div>

        {/* Review Result */}
        {review && (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                     <div className="w-10 h-10 bg-[#EAF4F1] rounded-full flex items-center justify-center">
                         <CheckCircle2 className="w-6 h-6 text-[#1B3D2F]" />
                     </div>
                     <h2 className="text-xl font-bold text-[#1B3D2F]">Analysis Results</h2>
                </div>
                
                <div className="prose prose-emerald max-w-none">
                     <ReactMarkdown>{review}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#1B3D2F] font-medium hover:underline text-sm"
                    >
                        Upload another resumé
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
