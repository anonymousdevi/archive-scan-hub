import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-archive.jpg";
import {
  Archive,
  QrCode,
  BarChart3,
  MapPin,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function WelcomeHero() {
  const navigate = useNavigate();

  const features = [
    {
      icon: QrCode,
      title: "Barcode Scanning",
      description: "Quick check-in/out with barcode scanner integration",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Organize files by rack, shelf, and box locations",
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Comprehensive analytics and export capabilities",
    },
    {
      icon: Users,
      title: "User Management", 
      description: "Track user activity and file access history",
    },
  ];

  const stats = [
    { label: "Files Managed", value: "2,847", trend: "+12%" },
    { label: "Active Users", value: "24", trend: "+8%" },
    { label: "Locations", value: "156", trend: "+15%" },
    { label: "Daily Scans", value: "340", trend: "+22%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-[70vh] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-primary-foreground slide-in">
              <div className="flex items-center gap-2 mb-4">
                <Archive className="h-8 w-8" />
                <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30">
                  Professional Archive Management
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Archive Scan Hub
              </h1>
              
              <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                Streamline your file management with our comprehensive archive system. 
                Track, scan, and manage thousands of files with precision and ease.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-glow h-14 px-8"
                  onClick={() => navigate("/")}
                >
                  <Archive className="h-5 w-5 mr-2" />
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-primary-foreground hover:bg-white/10 h-14 px-8"
                  onClick={() => navigate("/scanner")}
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-professional">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                  <Badge variant="outline" className="text-xs status-in-light">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage your archive efficiently and professionally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-professional hover:shadow-glow transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of organizations who trust Archive Scan Hub 
              for their file management needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary shadow-glow h-14 px-8"
                onClick={() => navigate("/")}
              >
                <FileText className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8"
                onClick={() => navigate("/files")}
              >
                <Archive className="h-5 w-5 mr-2" />
                Manage Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}