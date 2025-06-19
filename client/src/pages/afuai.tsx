import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Send, Sparkles, Zap, Brain, MessageCircle, FileText, Image, Code, Lightbulb } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AfuAI() {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm AfuAI, your intelligent assistant. I can help you with content creation, analysis, coding, and much more. What would you like to work on today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = chatMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const aiFeatures = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Content Creation",
      description: "Generate posts, articles, and creative content"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Assistant",
      description: "Get help with programming and debugging"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Analysis",
      description: "Data analysis and insights generation"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Ideas & Strategy",
      description: "Brainstorming and strategic planning"
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Visual Concepts",
      description: "Image descriptions and visual ideas"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Tasks",
      description: "Fast answers and quick solutions"
    }
  ];

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to access AfuAI.</p>
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
      <div className="flex-1">
        <TopBar title="AfuAI" />
        
        <main className="flex-1 overflow-hidden mobile-content">
          <Tabs defaultValue="chat" className="h-full">
            <div className="border-b border-border px-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="h-full p-0">
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          {msg.type === 'ai' ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <>
                              <AvatarImage src={user?.profileImageUrl || ""} />
                              <AvatarFallback>
                                {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-[80%]">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        </Avatar>
                        <div className="bg-muted rounded-2xl px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask AfuAI anything..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      size="icon"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="p-4 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">AI-Powered Features</h2>
                <p className="text-muted-foreground">Discover what AfuAI can help you accomplish</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {aiFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 text-center">
                  <Bot className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Start Chatting</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ready to explore AI capabilities? Switch to the Chat tab and start a conversation!
                  </p>
                  <Button 
                    onClick={() => {
                      const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                      chatTab?.click();
                    }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open Chat
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="p-4">
              <div className="text-center py-8">
                <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Chat History</h3>
                <p className="text-muted-foreground mb-4">
                  Your conversation history will appear here once you start chatting with AfuAI.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                    chatTab?.click();
                  }}
                >
                  Start Your First Chat
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}