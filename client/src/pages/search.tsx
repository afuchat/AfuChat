import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Users, FileText, TrendingUp } from "lucide-react";
import type { User, Post } from "@shared/schema";

export default function Search() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/search/users", { q: debouncedQuery }],
    enabled: isAuthenticated && debouncedQuery.length > 0,
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/search/posts", { q: debouncedQuery }],
    enabled: isAuthenticated && debouncedQuery.length > 0,
  });

  const trendingTopics = [
    { tag: "#AfuAI", posts: 1.2 },
    { tag: "#Technology", posts: 2.8 },
    { tag: "#SocialMedia", posts: 1.9 },
    { tag: "#Innovation", posts: 0.8 },
    { tag: "#Community", posts: 3.2 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <TopBar title="Search" />
        
        <main className="flex-1 overflow-y-auto mobile-content">
          <div className="p-4">
            {/* Search Input */}
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for users, posts, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            {debouncedQuery ? (
              /* Search Results */
              <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="users" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="posts" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Posts</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                  {usersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="animate-pulse flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.profileImageUrl || ""} alt={user.username || "User"} />
                              <AvatarFallback>
                                {user.firstName?.[0] || user.username?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username || "Unknown User"}
                              </h3>
                              <p className="text-sm text-gray-500">@{user.username || "unknown"}</p>
                              {user.bio && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{user.followersCount || 0} followers</span>
                                <span>{user.followingCount || 0} following</span>
                                <span>{user.postsCount || 0} posts</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Follow
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No users found</h3>
                        <p className="text-muted-foreground">
                          Try searching with different keywords
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="posts" className="space-y-4">
                  {postsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="animate-pulse">
                              <div className="flex items-start space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
                                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                </div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm">User</h4>
                                <span className="text-xs text-gray-500">
                                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">@user</p>
                            </div>
                          </div>
                          <p className="text-sm">{post.content}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>{post.likesCount || 0} likes</span>
                            <span>{post.commentsCount || 0} comments</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                        <p className="text-muted-foreground">
                          Try searching with different keywords
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              /* Default Search View - Trending */
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-semibold">Trending Topics</h2>
                    </div>
                    <div className="space-y-3">
                      {trendingTopics.map((topic, index) => (
                        <div key={topic.tag} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{topic.tag}</p>
                              <p className="text-sm text-gray-500">{topic.posts}k posts</p>
                            </div>
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Search Suggestions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["Technology", "Art", "Music", "Sports", "Food", "Travel"].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          className="justify-start"
                          onClick={() => setSearchQuery(suggestion)}
                        >
                          <SearchIcon className="w-4 h-4 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
