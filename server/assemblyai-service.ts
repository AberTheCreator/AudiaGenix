import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!
});

export interface TranscriptionResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<TranscriptionResult> {
  try {
    // Upload audio file to AssemblyAI
    const uploadUrl = await client.files.upload(audioBuffer);
    
    // Create transcription with real-time features
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speaker_labels: true,
      auto_highlights: true,
      sentiment_analysis: true,
      entity_detection: true,
      punctuate: true,
      format_text: true,
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error || 'Transcription failed');
    }

    return {
      text: transcript.text || '',
      confidence: transcript.confidence || 0,
      words: transcript.words?.map(word => ({
        text: word.text,
        start: word.start,
        end: word.end,
        confidence: word.confidence
      }))
    };
  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function createRealtimeTranscription() {
  try {
    // Create real-time transcription session
    const rt = client.realtime.transcriber({
      sample_rate: 16000,
      word_boost: ['customer', 'support', 'billing', 'technical', 'issue'],
      boost_param: 'high'
    });

    return rt;
  } catch (error) {
    console.error('Real-time transcription setup error:', error);
    throw new Error('Failed to setup real-time transcription');
  }
}

export function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' | 'frustrated' {
  const lowerText = text.toLowerCase();
  
  // Enhanced sentiment detection
  const frustrationWords = ['frustrated', 'angry', 'terrible', 'awful', 'hate', 'broken', 'stupid', 'worst', 'horrible', 'mad', 'annoyed'];
  const negativeWords = ['bad', 'poor', 'disappointing', 'wrong', 'problem', 'issue', 'trouble', 'difficult', 'slow'];
  const positiveWords = ['great', 'good', 'excellent', 'perfect', 'love', 'amazing', 'wonderful', 'fantastic', 'helpful', 'thank'];
  
  const frustrationScore = frustrationWords.filter(word => lowerText.includes(word)).length;
  const negativeScore = negativeWords.filter(word => lowerText.includes(word)).length;
  const positiveScore = positiveWords.filter(word => lowerText.includes(word)).length;
  
  if (frustrationScore > 0) return 'frustrated';
  if (negativeScore > positiveScore) return 'negative';
  if (positiveScore > 0) return 'positive';
  
  return 'neutral';
}