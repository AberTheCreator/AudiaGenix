import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic } from "lucide-react";
import VoiceInterface from "@/components/voice-interface";

export default function VoiceAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/app">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Voice Assistant</h1>
            </div>
            <p className="text-white/80 text-lg">Ultra-fast real-time transcription with sentiment analysis</p>
          </div>

          {/* Voice Interface */}
          <VoiceInterface />
        </div>
      </div>
    </div>
  );
}