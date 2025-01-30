import React, { useRef } from 'react';
import { Download, FileText, MessageSquare } from 'lucide-react';

interface SummaryProps {
  summary: string;
  answers?: { question: string; answer: string }[];
  onDownload: (format: 'pdf' | 'word') => void;
}

export default function Summary({ summary, answers = [], onDownload }: SummaryProps) {
  const fileViewerRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = async (format: 'pdf' | 'word') => {
    try {
      const response = await onDownload(format);
      if (response && response.url) {
        // Open the file in the viewer
        if (fileViewerRef.current) {
          fileViewerRef.current.src = response.url;
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Summary</h1>
          
          <div className="prose max-w-none mb-8">
            {summary.split('\n').map((point, index) => (
              <div key={index} className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          {answers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                AI Answers
              </h2>
              <div className="space-y-6">
                {answers.map((qa, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <p className="font-medium text-gray-900 mb-2">Q: {qa.question}</p>
                    <p className="text-gray-700">A: {qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => handleDownload('pdf')}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Download PDF
            </button>
            <button
              onClick={() => handleDownload('word')}
              className="flex-1 bg-white text-indigo-600 py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Word
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 h-[600px]">
          <iframe
            ref={fileViewerRef}
            className="w-full h-full border-0"
            title="File Preview"
          />
        </div>
      </div>
    </div>
  );
}