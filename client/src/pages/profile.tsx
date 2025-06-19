import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Link2, MoreHorizontal, Settings } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  
  // Get user's posts
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts/user", user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <div className="sticky top-0 z-40 bg-card border-b border-border glass-effect">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold">{user.firstName || user.username}</h1>
              <p className="text-sm text-muted-foreground">{posts.length} posts</p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto mobile-content">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            
            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-16 mb-4">
                <Avatar className="w-32 h-32 border-4 border-background">
                  <AvatarImage src={user.profileImageUrl || ""} />
                  <AvatarFallback className="text-2xl">
                    {(user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 mt-16">
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    Edit profile
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl font-bold">{user.firstName || user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                
                {user.bio && (
                  <p className="text-sm">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <span className="font-bold">0</span>
                    <span className="text-muted-foreground ml-1">Following</span>
                  </div>
                  <div>
                    <span className="font-bold">0</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="posts" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="replies" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  Replies
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="likes" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  Likes
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="posts" className="mt-0">
              {posts.length > 0 ? (
                <div className="divide-y divide-border">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-muted/50">
                      <div className="flex space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImageUrl || ""} />
                          <AvatarFallback>
                            {(user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{user.firstName || user.username}</span>
                            <span className="text-muted-foreground">@{user.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-sm">
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                          <p className="mt-2">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    When you post something, it will show up here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="replies" className="mt-0">
              <div className="text-center py-8">
                <h3 className="font-semibold text-lg mb-2">No replies yet</h3>
                <p className="text-muted-foreground">
                  When you reply to a post, it will show up here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <div className="text-center py-8">
                <h3 className="font-semibold text-lg mb-2">No media yet</h3>
                <p className="text-muted-foreground">
                  Posts with photos and videos will show up here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              <div className="text-center py-8">
                <h3 className="font-semibold text-lg mb-2">No likes yet</h3>
                <p className="text-muted-foreground">
                  Tap the heart on any post to show it some love. When you do, it'll show up here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}