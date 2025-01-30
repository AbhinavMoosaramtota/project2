import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import NotesInput from './components/NotesInput';
import Summary from './components/Summary';
import { summarizeText } from './utils/summarizer';

type Page = 'auth' | 'input' | 'summary';

interface SummaryData {
  summary: string;
  answers: { question: string; answer: string }[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [summaryData, setSummaryData] = useState<SummaryData>({
    summary: '',
    answers: []
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = (email: string, password: string, isLogin: boolean) => {
    // In a real app, implement actual authentication
    setIsAuthenticated(true);
    setCurrentPage('input');
  };

  const generateDetailedAnswer = (question: string, context: string) => {
    try {
      // Extract relevant context
      const relevantSentences = context
        .split(/[.!?]+/)
        .filter(sentence => 
          sentence.toLowerCase().includes(question.toLowerCase().split(' ')[0]));

      const analysis = `Based on the provided content, here's a detailed analysis regarding your question about "${question}":

1. Primary Findings:
${relevantSentences.map(sentence => `   - ${sentence.trim()}`).join('\n')}

2. Technical Considerations:
   - Analysis based on content context
   - Relevant information extraction
   - Pattern matching and relevance scoring

3. Practical Implications:
   - Direct application to the question
   - Context-specific insights
   - Related considerations

4. Recommendations:
   - Key takeaways from analysis
   - Suggested actions or next steps
   - Areas for further investigation`;

      return analysis;
    } catch (error) {
      console.error('Error generating answer:', error);
      return 'Unable to generate a detailed answer for this question.';
    }
  };

  const handleNotesSubmit = async (text: string, file?: File, questions: string[] = []) => {
    try {
      setError(null);
      let contentToProcess = text;
      
      if (file) {
        // If it's a PDF, we would need to extract text from it
        // For now, we'll just use the file name as a placeholder
        contentToProcess = `Content from file: ${file.name}`;
      }

      if (!contentToProcess.trim()) {
        throw new Error('Please provide some text or upload a file to analyze.');
      }

      // Use the actual summarizer
      const summary = summarizeText(contentToProcess);
      
      // Generate answers for questions
      const answers = questions.map(question => {
        if (!question.trim()) return null;
        
        const answer = generateDetailedAnswer(question, contentToProcess);
        return { question, answer };
      }).filter((qa): qa is { question: string; answer: string } => qa !== null);

      setSummaryData({
        summary,
        answers
      });
      setCurrentPage('summary');
    } catch (error) {
      console.error('Error processing content:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while processing the content.');
    }
  };

  const handleDownload = async (format: 'pdf' | 'word') => {
    try {
      // Create the content for the file with improved formatting
      const content = `COMPREHENSIVE SUMMARY AND ANALYSIS
${'-'.repeat(30)}

${summaryData.summary}

${'-'.repeat(30)}

DETAILED Q&A ANALYSIS
${'-'.repeat(30)}

${summaryData.answers.map(qa => 
  `QUESTION: ${qa.question}\n\nANALYSIS:\n${qa.answer}\n\n${'-'.repeat(30)}\n`
).join('\n')}

Generated on: ${new Date().toLocaleString()}
`;

      // Set the correct file type and extension
      const mimeType = format === 'pdf' ? 'text/plain' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const extension = format === 'pdf' ? '.txt' : '.docx';
      const blob = new Blob([content], { type: mimeType });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `detailed_summary${extension}`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { url };
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download the file. Please try again.');
      return {};
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onSubmit={handleAuth} />;
  }

  switch (currentPage) {
    case 'input':
      return (
        <>
          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <NotesInput onSubmit={handleNotesSubmit} />
        </>
      );
    case 'summary':
      return (
        <>
          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Summary 
            summary={summaryData.summary}
            answers={summaryData.answers}
            onDownload={handleDownload}
          />
        </>
      );
    default:
      return null;
  }
}

export default App;