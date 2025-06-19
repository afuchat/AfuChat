import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Image, Smile, MapPin, Calendar, Mic, FileText, Zap, Globe, Users, Lock, MessageSquare, Sparkles, Bot } from "lucide-react";
import type { Post } from "@shared/schema";

function PostComposer() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("everyone");
  const [isScheduled, setIsScheduled] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxLength = 280;
  const progressValue = (content.length / maxLength) * 100;
  
  const createPost = useMutation({
    mutationFn: async (data: { content: string }) => {
      return await apiRequest('/api/posts', 'POST', data);
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post shared",
        description: "Your post has been shared successfully.",
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
        title: "Error posting",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim() || content.length > maxLength) return;
    createPost.mutate({ content });
  };

  const improveContent = async () => {
    if (!content.trim()) return;
    
    setIsImproving(true);
    try {
      const response = await fetch('/api/ai/improve-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve content');
      }

      const data = await response.json();
      setContent(data.improvedContent);
      toast({
        title: "Content improved",
        description: "Your post has been enhanced by AI",
      });
    } catch (error) {
      toast({
        title: "Improvement failed",
        description: "Unable to improve content right now",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const response = await fetch('/api/ai/content-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: 'social media content ideas' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      toast({
        title: "Suggestions failed",
        description: "Unable to generate content ideas",
        variant: "destructive",
      });
    }
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case "everyone": return <Globe className="w-4 h-4" />;
      case "followers": return <Users className="w-4 h-4" />;
      case "mentions": return <MessageSquare className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="border-b border-border p-4">
      <div className="flex space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.profileImageUrl || ""} />
          <AvatarFallback>
            {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {/* Privacy selector */}
          <div className="flex items-center space-x-2 mb-3">
            <button className="flex items-center space-x-1 text-sm text-primary hover:bg-primary/10 rounded-full px-3 py-1">
              {getPrivacyIcon()}
              <span className="capitalize">{privacy}</span>
            </button>
          </div>
          
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-none resize-none text-xl placeholder:text-xl focus-visible:ring-0 bg-transparent min-h-[120px]"
            maxLength={maxLength}
          />
          
          {/* Character count */}
          {content.length > 0 && (
            <div className="flex items-center justify-end mt-2">
              <div className="flex items-center space-x-2">
                <div className="relative w-6 h-6">
                  <Progress 
                    value={progressValue} 
                    className={`w-6 h-6 ${progressValue > 90 ? 'text-red-500' : 'text-primary'}`}
                  />
                  {content.length > maxLength - 20 && (
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${content.length > maxLength ? 'text-red-500' : 'text-orange-500'}`}>
                      {maxLength - content.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors"
              >
                <Image className="w-5 h-5" />
              </button>
              <button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                <FileText className="w-5 h-5" />
              </button>
              <button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {content.length > 0 && (
                <>
                  <Button 
                    onClick={improveContent}
                    disabled={isImproving}
                    variant="outline" 
                    size="sm"
                    className="rounded-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    {isImproving ? (
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-1" />
                    )}
                    Enhance
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full"
                  >
                    Draft
                  </Button>
                </>
              )}
              
              <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                <PopoverTrigger asChild>
                  <Button 
                    onClick={generateSuggestions}
                    variant="outline" 
                    size="sm"
                    className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Bot className="w-4 h-4 mr-1" />
                    Ideas
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">AI Content Suggestions</h4>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setContent(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="p-2 text-sm bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || content.length > maxLength || createPost.isPending}
                className="rounded-full px-6 bg-primary hover:bg-primary/90"
              >
                {createPost.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            multiple
          />
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const likePost = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await apiRequest(`/api/posts/${post.id}/unlike`, 'DELETE');
      } else {
        await apiRequest(`/api/posts/${post.id}/like`, 'POST');
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
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
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now.getTime() - postTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  return (
    <div className="border-b border-border p-4 hover:bg-muted/50 cursor-pointer">
      <div className="flex space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.profileImageUrl || ""} />
          <AvatarFallback>
            {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{user?.firstName || user?.username}</span>
            <span className="text-muted-foreground">@{user?.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">
              {formatTimestamp(post.createdAt?.toString() || new Date().toISOString())}
            </span>
            <div className="ml-auto">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground hover:bg-muted rounded-full p-1 w-7 h-7" />
            </div>
          </div>
          
          <p className="mt-2 text-sm leading-relaxed">{post.content}</p>
          
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5 hover:bg-blue-500/10 rounded-full p-1 w-7 h-7" />
              <span className="text-sm">0</span>
            </button>
            
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors">
              <Repeat2 className="w-5 h-5 hover:bg-green-500/10 rounded-full p-1 w-7 h-7" />
              <span className="text-sm">0</span>
            </button>
            
            <button 
              onClick={() => likePost.mutate()}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 hover:bg-red-500/10 rounded-full p-1 w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors">
              <Share className="w-5 h-5 hover:bg-blue-500/10 rounded-full p-1 w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsList() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border p-4">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="font-semibold text-lg mb-2">Welcome to AfuChat!</h3>
        <p className="text-muted-foreground">
          This is your timeline. Share your first post to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your feed.</p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <TopBar title="Home" />
        
        <main className="flex-1 overflow-y-auto mobile-content pb-20">
          <div className="max-w-2xl mx-auto">
            <PostComposer />
            <PostsList />
          </div>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}