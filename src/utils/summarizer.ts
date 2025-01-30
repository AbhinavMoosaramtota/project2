export const MAX_TEXT_LENGTH = 5000; // Maximum characters allowed

export function summarizeText(text: string): string {
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
  }

  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  // Calculate word frequency
  const wordFrequency = new Map<string, number>();
  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Ignore small words
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      }
    });
  });

  // Score sentences based on word frequency
  const sentenceScores = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    const score = words.reduce((acc, word) => acc + (wordFrequency.get(word) || 0), 0);
    return { sentence, score: score / words.length };
  });

  // Sort sentences by score and get top ones
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, Math.ceil(sentences.length * 0.3)))
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));

  // Extract key points directly from the text
  const keyPoints = topSentences.map(({ sentence }) => sentence.trim());

  // Generate focused summary
  const summary = `Key Points from Your Text:
${keyPoints.map(point => `• ${point}`).join('\n')}`;

  return summary;
}