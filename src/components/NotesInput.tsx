import React, { useState } from 'react';
import { Upload, FileText, Type, Send, Plus, X } from 'lucide-react';
import { MAX_TEXT_LENGTH } from '../utils/summarizer';

interface NotesInputProps {
  onSubmit: (text: string, file?: File, questions?: string[]) => void;
}

export default function NotesInput({ onSubmit }: NotesInputProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [questions, setQuestions] = useState<string[]>(['']);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_TEXT_LENGTH) {
      setText(newText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === 'text' && text) {
      onSubmit(text, undefined, questions.filter(q => q.trim() !== ''));
    } else if (inputType === 'file' && file) {
      onSubmit('', file, questions.filter(q => q.trim() !== ''));
    }
  };

  const addQuestion = () => {
    if (questions.length < 5) { // Limit to 5 questions
      setQuestions([...questions, '']);
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    if (value.length <= 200) { // Limit question length
      const newQuestions = [...questions];
      newQuestions[index] = value;
      setQuestions(newQuestions);
    }
  };

  const charactersRemaining = MAX_TEXT_LENGTH - text.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Notes</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setInputType('text')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              inputType === 'text'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Type className="h-5 w-5" />
            Text Input
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              inputType === 'file'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="h-5 w-5" />
            PDF Upload
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputType === 'text' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your notes (max {MAX_TEXT_LENGTH} characters)
              </label>
              <textarea
                value={text}
                onChange={handleTextChange}
                className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Start typing your notes here..."
              />
              <p className={`text-sm mt-2 ${charactersRemaining < 100 ? 'text-red-500' : 'text-gray-500'}`}>
                {charactersRemaining} characters remaining
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-700">
                      Upload a PDF file
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Questions (max 5)</h2>
              {questions.length < 5 && (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              )}
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder="Enter your question here (max 200 characters)..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={200}
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="h-5 w-5" />
            Generate Summary
          </button>
        </form>
      </div>
    </div>
  );
}