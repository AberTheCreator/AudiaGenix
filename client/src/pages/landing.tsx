import { Button } from "@/components/ui/button";
import { Bot, ArrowRight, Mic, Brain, MessageCircle, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import audiagenixImage from "@assets/Audiagenix (1)_1753613627220.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(184,85%,39%)] to-[hsl(258,84%,67%)]">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[hsl(340,82%,52%)] to-[hsl(258,84%,67%)] rounded-lg flex items-center justify-center">
                <Bot className="text-white text-lg" />
              </div>
              <span className="text-white font-bold text-xl">AUDIAGENIX</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                HOME
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                ABOUT US
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                CONTACT US
              </a>
              <Button className="bg-[hsl(340,82%,52%)] hover:bg-[hsl(340,82%,47%)] text-white">
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              YOUR SMARTEST AGENT.
              <br />
              <span className="bg-gradient-to-r from-[hsl(340,82%,52%)] to-[hsl(258,84%,67%)] bg-clip-text text-transparent">
                TRANSFORM
              </span>
              <br />
              <span className="bg-gradient-to-r from-[hsl(340,82%,52%)] to-[hsl(258,84%,67%)] bg-clip-text text-transparent">
                CUSTOMER SUPPORT
              </span>
              <br />
              <span className="bg-gradient-to-r from-[hsl(340,82%,52%)] to-[hsl(258,84%,67%)] bg-clip-text text-transparent">
                WITH AUDIAGENIX.
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-lg">
              Meet the world's most advanced, empathetic AI voice 
              assistant for customer service. Real-time 
              understanding. Human-level accuracy. Remarkable 
              results.
            </p>
            
            <Link href="/app">
              <Button className="bg-[hsl(184,85%,39%)] hover:bg-[hsl(184,85%,34%)] text-white text-lg px-8 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                Try Audiagenix
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Right Content - Robot Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={audiagenixImage} 
                alt="AudiaGenix Robot" 
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>
            
            {/* Feature Callouts */}
            <div className="absolute top-20 -left-4 bg-[hsl(184,85%,39%)]/20 backdrop-blur-lg rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <Brain className="text-[hsl(184,85%,39%)] h-5 w-5" />
                <div>
                  <p className="text-white font-medium text-sm">Cross-session</p>
                  <p className="text-white font-medium text-sm">Memory</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-40 -right-8 bg-[hsl(340,82%,52%)]/20 backdrop-blur-lg rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-[hsl(340,82%,52%)] h-5 w-5" />
                <div>
                  <p className="text-white font-medium text-sm">Dynamic</p>
                  <p className="text-white font-medium text-sm">Self-learning</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 left-8 bg-[hsl(258,84%,67%)]/20 backdrop-blur-lg rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-[hsl(258,84%,67%)] h-5 w-5" />
                <div>
                  <p className="text-white font-medium text-sm">Real-time</p>
                  <p className="text-white font-medium text-sm">Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <Mic className="text-[hsl(184,85%,39%)] h-12 w-12 mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Ultra-fast Transcription</h3>
            <p className="text-white/70">Real-time voice processing with ≤300ms latency for instant responses.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <Brain className="text-[hsl(340,82%,52%)] h-12 w-12 mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">AI Reasoning</h3>
            <p className="text-white/70">Transparent decision-making with explainable AI responses.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <BarChart3 className="text-[hsl(258,84%,67%)] h-12 w-12 mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">Smart Analytics</h3>
            <p className="text-white/70">Real-time sentiment tracking and performance insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}