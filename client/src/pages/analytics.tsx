import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)] flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  const sentimentData = analytics?.sentimentTimeline || [];
  const pieData = [
    { name: 'Satisfied', value: 75, color: '#10B981' },
    { name: 'Neutral', value: 20, color: '#F59E0B' },
    { name: 'Unsatisfied', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/80">Real-time insights and performance metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.responseTime}ms</div>
                <p className="text-green-400 text-xs">↓ 12% from last hour</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.accuracy}%</div>
                <p className="text-green-400 text-xs">↑ 3% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.satisfaction}/5.0</div>
                <p className="text-green-400 text-xs">↑ 0.2 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">Escalation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics?.escalationRate}%</div>
                <p className="text-red-400 text-xs">↑ 2% from yesterday</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentiment Timeline */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sentiment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-white/80 text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Features */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Active AI Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-2">Cross-Session Memory</div>
                  <div className="text-2xl font-bold text-green-400 mb-2">85%</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-2">Dynamic Learning</div>
                  <div className="text-2xl font-bold text-blue-400 mb-2">60%</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-white/60 text-sm mb-2">Proactive Suggestions</div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">3 Active</div>
                  <div className="text-xs text-white/60">Real-time recommendations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}