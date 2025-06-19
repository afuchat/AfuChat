import { useLocation } from "wouter";
import { Home, Search, Bot, MessageCircle, User, Bell, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Search },
  { path: "/afuai", label: "AfuAI", icon: Bot },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { path: "/profile", label: "Profile", icon: User },
];

export function MobileNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border glass-effect z-50 mobile-nav">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`nav-item flex flex-col items-center py-2 px-1 transition-colors relative min-w-0 flex-1 rounded-lg ${
                isActive ? "active text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-muted/50"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
  
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title }: { title: string }) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-20 glass-effect">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => window.location.href = '/notifications'}
          className="relative p-2 hover:bg-muted rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.firstName?.[0] || user?.username?.[0] || "U"}
            </span>
          </div>
          <Button 
            onClick={() => window.location.href = '/premium'}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl text-sm"
          >
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </Button>
        </div>
      </div>
    </header>
  );
}
