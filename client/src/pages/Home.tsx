import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, QrCode, MessageSquare, Zap, BarChart3, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [trackingCode, setTrackingCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      setIsSearching(true);
      setLocation(`/track/${trackingCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Smart Service Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/admin")}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Admin Dashboard
                  </Button>
                )}
                <div className="text-sm text-foreground/60">
                  Welcome, <span className="font-medium">{user.name}</span>
                </div>
              </>
            ) : (
              <Button variant="outline">Sign In</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge className="mb-4 gap-2 px-4 py-2 bg-accent/20 text-accent border-accent/30">
            <Zap className="w-3 h-3" />
            Real-Time Device Repair Tracking
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Track Your Device Repair <span className="text-accent">in Real-Time</span>
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Get instant updates on your device repair status, communicate with technicians, and stay informed every step of the way.
          </p>
        </div>

        {/* Tracking Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="glass-card-lg border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
            <CardContent className="pt-8">
              <form onSubmit={handleTrackRepair} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Enter Your Tracking Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., TRACK-2024-001234"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1 text-base"
                      disabled={isSearching}
                    />
                    <Button
                      type="submit"
                      disabled={!trackingCode.trim() || isSearching}
                      className="gap-2 px-6"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Track
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-foreground/50 mt-2">
                    Your tracking code was provided in your receipt or confirmation email
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-lg">Live Chat Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60">
                Communicate directly with our technicians. Ask questions and get real-time updates about your repair.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-lg">QR Code Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60">
                Scan a QR code to instantly access your repair status. Perfect for quick updates on the go.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-lg">Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60">
                Get instant notifications when your device moves to the next repair stage or is ready for pickup.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Repair Stages */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">How We Track Your Repair</h3>
          <div className="space-y-4">
            {[
              { stage: "Received", desc: "Your device arrives and is logged into our system" },
              { stage: "Diagnosing", desc: "Our technicians assess the issue and determine the repair plan" },
              { stage: "Repairing", desc: "The repair work is underway with expert care" },
              { stage: "Quality Check", desc: "We thoroughly test your device to ensure everything works perfectly" },
              { stage: "Ready for Pickup", desc: "Your device is ready! Schedule a pickup time that works for you" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 border border-accent/30">
                  <span className="text-accent font-semibold">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.stage}</h4>
                  <p className="text-sm text-foreground/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="glass-card-lg border-accent/30">
            <CardHeader>
              <CardTitle>Ready to Track Your Repair?</CardTitle>
              <CardDescription>Enter your tracking code above to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-6">
                Don't have a tracking code? Contact our support team and we'll help you find your repair status.
              </p>
              <Button className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-16">
        <div className="container py-8 text-center text-sm text-foreground/50">
          <p>© 2024 Smart Service Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
