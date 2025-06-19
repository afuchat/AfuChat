import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { DesktopSidebar, MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  Plus,
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip
} from "lucide-react";
import type { Conversation, Message, User } from "@shared/schema";

interface ConversationWithLastMessage extends Conversation {
  lastMessage?: Message;
  participants?: User[];
  unreadCount?: number;
}

interface MessageWithSender extends Message {
  sender?: User;
}

export default function Messages() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery<ConversationWithLastMessage[]>({
    queryKey: ["/api/conversations"],
    enabled: isAuthenticated,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery<MessageWithSender[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    enabled: isAuthenticated && selectedConversation !== null,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; conversationId: number }) => {
      const response = await apiRequest("POST", `/api/conversations/${messageData.conversationId}/messages`, {
        content: messageData.content,
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConversation, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
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
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      content: newMessage.trim(),
      conversationId: selectedConversation,
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getConversationName = (conversation: ConversationWithLastMessage) => {
    if (conversation.name) return conversation.name;
    if (conversation.isGroup) return "Group Chat";
    return "Direct Message";
  };

  const getConversationAvatar = (conversation: ConversationWithLastMessage) => {
    if (conversation.isGroup) {
      return (
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      );
    }
    return (
      <Avatar className="w-12 h-12">
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
    );
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

  const selectedConversationData = conversations?.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-background">
      <DesktopSidebar />
      
      <div className="flex-1 lg:ml-64">
        <TopBar title="Messages" />
        
        <main className="flex-1 overflow-hidden pb-20 lg:pb-6">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-full lg:w-80 border-r border-border flex flex-col">
              {/* Search Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <h2 className="text-lg font-semibold flex-1">Messages</h2>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted border-0"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1">
                {conversationsLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="py-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-muted transition-colors ${
                          selectedConversation === conversation.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        {getConversationAvatar(conversation)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium truncate">{getConversationName(conversation)}</h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage?.content || "No messages yet"}
                            </p>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <Badge className="ml-2 min-w-[20px] h-5 rounded-full text-xs bg-primary">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No conversations</h3>
                    <p className="text-muted-foreground text-sm">
                      Start a new conversation to begin messaging
                    </p>
                    <Button className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Message
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedConversationData && getConversationAvatar(selectedConversationData)}
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversationData && getConversationName(selectedConversationData)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversationData?.isGroup ? "Group conversation" : "Online"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'} rounded-2xl p-3`}>
                              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwnMessage = message.senderId === user?.id;
                        return (
                          <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end space-x-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {!isOwnMessage && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {message.sender?.firstName?.[0] || message.sender?.username?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`rounded-2xl px-4 py-2 ${
                                isOwnMessage 
                                  ? 'bg-primary text-white' 
                                  : 'bg-muted'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-muted-foreground">
                          Send the first message to start the conversation
                        </p>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex items-end space-x-3">
                    <Button variant="ghost" size="sm" className="mb-2">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[40px] border-0 bg-muted focus-visible:ring-2 focus-visible:ring-primary/20"
                        disabled={sendMessageMutation.isPending}
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="mb-2">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-white mb-2"
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
