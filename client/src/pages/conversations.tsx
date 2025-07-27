import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, User, TrendingUp, ArrowLeft } from "lucide-react";

export default function Conversations() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['/api/conversations'],
    refetchInterval: 10000
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)] flex items-center justify-center">
        <div className="text-white text-xl">Loading conversations...</div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'frustrated': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white mb-2">Conversation History</h1>
            <p className="text-white/80">Manage and review all customer interactions</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Total Conversations</p>
                    <p className="text-white text-2xl font-bold">{conversations?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Active Now</p>
                    <p className="text-white text-2xl font-bold">
                      {conversations?.filter(c => c.status === 'active').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Escalated</p>
                    <p className="text-white text-2xl font-bold">
                      {conversations?.filter(c => c.status === 'escalated').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Avg Duration</p>
                    <p className="text-white text-2xl font-bold">4m 32s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {conversations?.map((conversation: any) => (
              <Card key={conversation.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-white font-semibold mr-3">{conversation.customerName}</h3>
                        <Badge className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                        <div className="flex items-center ml-3">
                          <div className={`w-2 h-2 rounded-full mr-1 ${getSentimentColor(conversation.sentiment)}`} />
                          <span className="text-white/60 text-sm capitalize">{conversation.sentiment}</span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 mb-3">{conversation.lastMessage}</p>
                      
                      <div className="flex items-center text-white/60 text-sm space-x-4">
                        <span>Started: {new Date(conversation.startedAt).toLocaleTimeString()}</span>
                        <span>Messages: {conversation.messageCount}</span>
                        <span>Duration: {conversation.duration}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
                      >
                        View Details
                      </Button>
                      {conversation.status === 'active' && (
                        <Button 
                          size="sm" 
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {conversations?.length === 0 && (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No conversations yet</h3>
                <p className="text-white/60">Start using the voice assistant to see conversations here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}