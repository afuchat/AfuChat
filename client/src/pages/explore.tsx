import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Hash, MapPin } from "lucide-react";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock trending data - would come from API
  const trendingTopics = [
    { tag: "#Technology", posts: "125K posts" },
    { tag: "#Sports", posts: "89K posts" },
    { tag: "#Music", posts: "67K posts" },
    { tag: "#News", posts: "156K posts" },
    { tag: "#Entertainment", posts: "93K posts" },
  ];

  const suggestedUsers = [
    {
      id: "1",
      username: "techguru",
      firstName: "Alex",
      profileImageUrl: "",
      followers: "15K",
      verified: true,
    },
    {
      id: "2", 
      username: "musiclover",
      firstName: "Sarah",
      profileImageUrl: "",
      followers: "8.2K",
      verified: false,
    },
    {
      id: "3",
      username: "newswriter",
      firstName: "John",
      profileImageUrl: "",
      followers: "23K",
      verified: true,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <TopBar title="Explore" />
        
        <main className="flex-1 overflow-y-auto mobile-content">
          <div className="p-4 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search AfuChat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-none"
              />
            </div>

            {/* Trending for you */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Trending for you</h2>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 cursor-pointer">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">{topic.tag}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{topic.posts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Who to follow */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-bold text-lg mb-4">Who to follow</h2>
                <div className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImageUrl} />
                          <AvatarFallback>
                            {user.firstName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">{user.firstName}</span>
                            {user.verified && (
                              <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username} · {user.followers} followers
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's happening */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-bold text-lg mb-4">What's happening</h2>
                <div className="space-y-4">
                  <div className="space-y-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Trending in Technology</span>
                    </div>
                    <h3 className="font-semibold">OpenAI releases new model</h3>
                    <p className="text-sm text-muted-foreground">45.2K posts</p>
                  </div>
                  
                  <div className="space-y-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Trending in Sports</span>
                    </div>
                    <h3 className="font-semibold">Championship Finals</h3>
                    <p className="text-sm text-muted-foreground">123K posts</p>
                  </div>
                  
                  <div className="space-y-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Trending</span>
                    </div>
                    <h3 className="font-semibold">Weekend Plans</h3>
                    <p className="text-sm text-muted-foreground">78.5K posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}