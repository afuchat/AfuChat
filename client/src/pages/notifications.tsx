import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Repeat2, UserPlus, Settings } from "lucide-react";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'retweet' | 'follow';
  user: {
    id: string;
    username: string;
    firstName: string;
    profileImageUrl?: string;
  };
  content?: string;
  timestamp: Date;
  read: boolean;
}

export default function Notifications() {
  // Mock notifications - would come from API
  const notifications: Notification[] = [
    {
      id: "1",
      type: "like",
      user: {
        id: "user1",
        username: "johndoe",
        firstName: "John",
        profileImageUrl: "",
      },
      content: "Your tweet about web development",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: "2",
      type: "follow",
      user: {
        id: "user2",
        username: "sarahsmith",
        firstName: "Sarah",
        profileImageUrl: "",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: "3",
      type: "retweet",
      user: {
        id: "user3",
        username: "techguru",
        firstName: "Alex",
        profileImageUrl: "",
      },
      content: "Your post about mobile development",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
    },
    {
      id: "4",
      type: "comment",
      user: {
        id: "user4",
        username: "designerpro",
        firstName: "Emma",
        profileImageUrl: "",
      },
      content: "Great insights on UI design!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'retweet':
        return <Repeat2 className="w-5 h-5 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.user.firstName} liked ${notification.content}`;
      case 'comment':
        return `${notification.user.firstName} replied: ${notification.content}`;
      case 'retweet':
        return `${notification.user.firstName} retweeted ${notification.content}`;
      case 'follow':
        return `${notification.user.firstName} started following you`;
      default:
        return `${notification.user.firstName} interacted with your content`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
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
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <div className="sticky top-0 z-40 bg-card border-b border-border glass-effect">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-primary">Notifications</h1>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto mobile-content">
          <Tabs defaultValue="all" className="w-full">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <TabsList className="grid w-full grid-cols-2 h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="mentions" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4"
                >
                  Mentions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={notification.user.profileImageUrl} />
                            <AvatarFallback>
                              {notification.user.firstName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">
                                {notification.user.firstName}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                @{notification.user.username}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                · {formatTimestamp(notification.timestamp)}
                              </span>
                            </p>
                            <p className="text-sm mt-1">
                              {getNotificationText(notification)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentions" className="mt-0">
              <div className="p-4">
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No mentions yet</h3>
                  <p className="text-muted-foreground">
                    When someone mentions you, you'll find it here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}