import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Crown, Shield, Star, MessageCircle, Clock, ArrowLeft } from "lucide-react";

export default function Customers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['/api/customers'],
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(340,82%,52%)] via-[hsl(258,84%,67%)] to-[hsl(215,100%,50%)] flex items-center justify-center">
        <div className="text-white text-xl">Loading customers...</div>
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return Crown;
      case 'gold': return Star;
      case 'enterprise': return Shield;
      default: return User;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'enterprise': return 'bg-blue-100 text-blue-800';
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
            <h1 className="text-3xl font-bold text-white mb-2">Customer Management</h1>
            <p className="text-white/80">Track customer profiles, tiers, and interaction history</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Total Customers</p>
                    <p className="text-white text-2xl font-bold">{customers?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Premium Customers</p>
                    <p className="text-white text-2xl font-bold">
                      {customers?.filter(c => c.tier === 'premium').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Active Sessions</p>
                    <p className="text-white text-2xl font-bold">
                      {customers?.filter(c => c.status === 'active').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-400 mr-3" />
                  <div>
                    <p className="text-white/60 text-sm">Avg Response Time</p>
                    <p className="text-white text-2xl font-bold">2.3s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer List */}
          <div className="space-y-4">
            {customers?.map((customer: any) => {
              const TierIcon = getTierIcon(customer.tier);
              
              return (
                <Card key={customer.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <TierIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-white font-semibold mr-3">{customer.name}</h3>
                            <Badge className={getTierColor(customer.tier)}>
                              {customer.tier}
                            </Badge>
                            <div className="flex items-center ml-3">
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                customer.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                              }`} />
                              <span className="text-white/60 text-sm capitalize">{customer.status}</span>
                            </div>
                          </div>
                          
                          <p className="text-white/80 mb-3">{customer.email}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/60 text-sm">
                            <div>
                              <span className="font-medium">Total Interactions:</span>
                              <br />
                              <span className="text-white">{customer.totalInteractions}</span>
                            </div>
                            <div>
                              <span className="font-medium">Satisfaction Score:</span>
                              <br />
                              <span className="text-white">{customer.satisfactionScore}/5.0</span>
                            </div>
                            <div>
                              <span className="font-medium">Last Contact:</span>
                              <br />
                              <span className="text-white">{new Date(customer.lastContact).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
                        >
                          Start Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {customers?.length === 0 && (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No customers yet</h3>
                <p className="text-white/60">Customer profiles will appear here as they interact with the system</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}