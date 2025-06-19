import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DesktopSidebar, MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  MessageCircle,
  Zap,
  Brain,
  Palette,
  Code
} from "lucide-react";

const aiFeatures = [
  {
    icon: Brain,
    title: "Smart Assistant",
    description: "Get intelligent answers to your questions",
    color: "bg-blue-500",
  },
  {
    icon: Palette,
    title: "Content Creator",
    description: "Generate creative content and ideas",
    color: "bg-purple-500",
  },
  {
    icon: ImageIcon,
    title: "Image Generator",
    description: "Create amazing images from text",
    color: "bg-green-500",
  },
  {
    icon: Code,
    title: "Code Helper",
    description: "Get help with programming tasks",
    color: "bg-orange-500",
  },
];

const sampleConversations = [
  {
    id: 1,
    title: "Creative Writing Tips",
    preview: "How can I improve my storytelling?",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    title: "Tech Career Advice",
    preview: "What skills should I learn for AI development?",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    title: "Recipe Ideas",
    preview: "Suggest healthy dinner recipes",
    timestamp: "3 days ago",
  },
];

export default function AfuAI() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm AfuAI, your intelligent assistant. How can I help you today?",
      timestamp: new Date(),
    }
  ]);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsGenerating(true);

    // Simulate AI response (in real app, this would call an AI API)
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai' as const,
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIResponse = (input: string): string => {
    // Simple response generator for demo purposes
    const responses = [
      "That's an interesting question! Let me help you with that. Here are some insights based on your query...",
      "I understand what you're looking for. Based on current trends and best practices, I'd recommend...",
      "Great question! This is a topic I can definitely help with. Here's what you should know...",
      "I'd be happy to assist you with that. Let me break this down into actionable steps...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

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
        <TopBar title="AfuAI" />
        
        <main className="flex-1 overflow-hidden pb-20 lg:pb-6">
          <Tabs defaultValue="chat" className="h-full">
            <div className="border-b border-border px-4 lg:px-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="h-full p-0">
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={msg.type === 'ai' ? 'bg-primary text-white' : 'bg-secondary text-white'}>
                            {msg.type === 'ai' ? 'AI' : (user?.firstName?.[0] || user?.username?.[0] || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-4 py-3 ${
                          msg.type === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-[80%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-border p-4 bg-card">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Ask me anything..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[60px] resize-none border-0 bg-muted focus-visible:ring-2 focus-visible:ring-primary/20"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isGenerating}
                      className="bg-primary hover:bg-primary/90 text-white p-3"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="p-4 lg:p-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">AI-Powered Features</h2>
                    <p className="text-muted-foreground">
                      Discover what AfuAI can do for you
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                              <Button variant="outline" size="sm" className="mt-3">
                                Try Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <FileText className="w-6 h-6" />
                      <span className="text-xs">Summarize Text</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs">Generate Image</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-xs">Write Post</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Lightbulb className="w-6 h-6" />
                      <span className="text-xs">Get Ideas</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-4 lg:p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Chat History</h2>
                  <Button variant="outline" size="sm">
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  {sampleConversations.map((conversation) => (
                    <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{conversation.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{conversation.preview}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {conversation.timestamp}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {sampleConversations.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                      <p className="text-muted-foreground">
                        Start chatting with AfuAI to see your history here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
