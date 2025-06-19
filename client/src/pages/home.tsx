import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { DesktopSidebar, MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Bookmark, Image, Smile, Plus } from "lucide-react";
import type { Post, User } from "@shared/schema";

function StorySection() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex space-x-4 overflow-x-auto pb-4">
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full p-0.5">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-xs mt-2 font-medium">Your Story</p>
        </div>
        {/* Story placeholders - in a real app, these would come from API */}
        {["Sarah", "Mike", "Emma", "John"].map((name, index) => (
          <div key={name} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full p-0.5">
              <Avatar className="w-full h-full">
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs mt-2 font-medium">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostCreation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string }) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!content.trim()) return;
    createPostMutation.mutate({ content: content.trim() });
  };

  return (
    <div className="px-4 lg:px-6 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImageUrl || ""} alt="Your avatar" />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[80px] resize-none border-0 focus-visible:ring-0 bg-muted"
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                <Image className="w-5 h-5 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                <Smile className="w-5 h-5 mr-2" />
                Feeling
              </Button>
            </div>
            <Button 
              onClick={handleCreatePost}
              disabled={!content.trim() || createPostMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white px-6"
            >
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await apiRequest("DELETE", `/api/posts/${post.id}/like`);
      } else {
        await apiRequest("POST", `/api/posts/${post.id}/like`);
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "now";
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">User</h3>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            <p className="text-gray-600 text-xs">@user</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </Button>
        </div>
        <div className="mt-3">
          <p className="text-sm">{post.content}</p>
        </div>
        {post.imageUrl && (
          <div className="mt-3">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`flex items-center space-x-2 ${
                isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{post.likesCount || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.commentsCount || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

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
      <DesktopSidebar />
      
      <div className="flex-1 lg:ml-64">
        <TopBar title="Home" />
        
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <StorySection />
          <PostCreation />
          
          <div className="px-4 lg:px-6 space-y-6">
            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share something with your community!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
