import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">AfuSocial</h1>
              <p className="text-muted-foreground">
                Connect, share, and discover with the modern social platform
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Share moments with your friends</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Discover new content and people</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI-powered features with AfuAI</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Shop and sell in AfuMall</span>
              </div>
            </div>
            
            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Get Started
            </Button>
            
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
