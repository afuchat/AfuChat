import { useLocation } from "wouter";
import { Home, Search, Lightbulb, ShoppingBag, MessageCircle, Menu, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/search", label: "Search", icon: Search },
  { path: "/afuai", label: "AfuAI", icon: Lightbulb },
  { path: "/afumall", label: "AfuMall", icon: ShoppingBag },
  { path: "/messages", label: "Messages", icon: MessageCircle, badge: 3 },
];

export function DesktopSidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border z-30">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-primary">AfuSocial</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`nav-item flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive 
                    ? "active bg-primary/10 text-primary" 
                    : "text-gray-600 hover:bg-muted hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="flex items-center px-4 py-4 border-t border-border">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl || ""} alt="User avatar" />
            <AvatarFallback>
              {user?.firstName?.[0] || user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500">
              @{user?.username || "user"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MobileNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border glass-effect z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`nav-item flex flex-col items-center p-3 transition-colors relative ${
                isActive ? "active text-primary" : "text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title }: { title: string }) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 glass-effect">
      <div className="flex items-center space-x-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center h-16 px-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-xl font-bold text-primary">AfuSocial</span>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => setLocation(item.path)}
                      className={`nav-item flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        isActive 
                          ? "active bg-primary/10 text-primary" 
                          : "text-gray-600 hover:bg-muted hover:text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Star className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
        </Button>
        <div className="lg:hidden">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImageUrl || ""} alt="User avatar" />
            <AvatarFallback className="bg-primary text-white text-sm">
              {user?.firstName?.[0] || user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
