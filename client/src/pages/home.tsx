import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Brain,
  Zap,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Voice Assistant",
      description: "Ultra-fast real-time transcription with 300ms latency and sentiment analysis",
      icon: Mic,
      path: "/voice-assistant",
      color: "from-blue-500 to-purple-600",
      status: "Active"
    },
    {
      title: "Analytics Dashboard", 
      description: "Real-time insights, performance metrics, and conversation analytics",
      icon: BarChart3,
      path: "/analytics",
      color: "from-green-500 to-teal-600",
      status: "Live"
    },
    {
      title: "Conversations",
      description: "Manage and review all customer interactions with detailed history",
      icon: MessageSquare,
      path: "/conversations", 
      color: "from-orange-500 to-red-600",
      status: "Active"
    },
    {
      title: "Customer Management",
      description: "Track customer profiles, tiers, and interaction history",
      icon: Users,
      path: "/customers",
      color: "from-pink-500 to-purple-600", 
      status: "Active"
    },
    {
      title: "AI Learning Center",
      description: "Dynamic self-learning and adaptive persona configuration",
      icon: Brain,
      path: "/ai-learning",
      color: "from-indigo-500 to-blue-600",
      status: "Coming Soon"
    },
    {
      title: "Supervisor Dashboard",
      description: "Real-time whisper functionality and human escalation management",
      icon: Zap,
      path: "/supervisor",
      color: "from-yellow-500 to-orange-600",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">AudiaGenix</h1>
            </div>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Next-generation intelligent customer support voice assistant with cutting-edge AI features
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isAvailable = feature.status === "Active" || feature.status === "Live" || feature.status === "Beta";
              
              return (
                <Card key={index} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        feature.status === "Active" || feature.status === "Live" 
                          ? "bg-green-500/20 text-green-300" 
                          : feature.status === "Beta"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm mb-4 h-12">
                      {feature.description}
                    </p>
                    {isAvailable ? (
                      <Link href={feature.path}>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30">
                          Launch Feature
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full bg-gray-500/20 text-gray-400 cursor-not-allowed">
                        {feature.status}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">≤300ms</div>
                <div className="text-white/60 text-sm">Response Latency</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">91%</div>
                <div className="text-white/60 text-sm">Word Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/60 text-sm">Availability</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">∞</div>
                <div className="text-white/60 text-sm">Concurrent Streams</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}