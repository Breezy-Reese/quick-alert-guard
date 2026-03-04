import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Building2, Zap, MapPin, Phone } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">SmartRoad System</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Smart Accident Detection
              <span className="block text-primary">& Emergency Response</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Real-time accident detection, instant emergency alerts, and coordinated hospital response. 
              Saving lives through technology.
            </p>
            <div className="flex justify-center gap-4">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" className="gap-2">
                  <Shield className="h-5 w-5" /> Get Started
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground">How It Works</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Zap, title: "Auto Detection", desc: "Automatic accident detection using sensor data and smart algorithms." },
                { icon: AlertTriangle, title: "Instant Alerts", desc: "Emergency alerts sent to hospitals and contacts within seconds." },
                { icon: MapPin, title: "Live Tracking", desc: "Real-time location tracking for ambulances and responders." },
                { icon: Building2, title: "Hospital Coordination", desc: "Hospitals manage incidents, dispatch ambulances, and track response times." },
                { icon: Phone, title: "SOS Button", desc: "One-tap emergency button for drivers with countdown and cancellation." },
                { icon: Shield, title: "Safety First", desc: "Comprehensive safety features for drivers, hospitals, and emergency teams." },
              ].map((f) => (
                <div key={f.title} className="rounded-lg border border-border p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Smart Accident Detection System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
