import {
  users,
  posts,
  likes,
  comments,
  follows,
  conversations,
  conversationParticipants,
  messages,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type Follow,
  type Conversation,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Post operations
  getPosts(limit?: number, offset?: number): Promise<Post[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  likePost(userId: string, postId: number): Promise<void>;
  unlikePost(userId: string, postId: number): Promise<void>;
  getPostLikes(postId: number): Promise<Like[]>;
  
  // Comment operations
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Search operations
  searchUsers(query: string): Promise<User[]>;
  searchPosts(query: string): Promise<Post[]>;
  
  // Follow operations
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  getUserFollowers(userId: string): Promise<Follow[]>;
  getUserFollowing(userId: string): Promise<Follow[]>;
  
  // Message operations
  getUserConversations(userId: string): Promise<Conversation[]>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  createConversation(participantIds: string[], name?: string): Promise<Conversation>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // Post operations
  async getPosts(limit: number = 20, offset: number = 0): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    
    // Update user's post count
    await db
      .update(users)
      .set({ postsCount: sql`${users.postsCount} + 1` })
      .where(eq(users.id, post.authorId));
    
    return newPost;
  }

  async likePost(userId: string, postId: number): Promise<void> {
    // Insert like
    await db.insert(likes).values({ userId, postId });
    
    // Update post likes count
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async unlikePost(userId: string, postId: number): Promise<void> {
    // Remove like
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    
    // Update post likes count
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    return await db.select().from(likes).where(eq(likes.postId, postId));
  }

  // Comment operations
  async getPostComments(postId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    
    // Update post comments count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, comment.postId));
    
    return newComment;
  }

  // Search operations
  async searchUsers(query: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.username, `%${query}%`),
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`)
        )
      )
      .limit(20);
  }

  async searchPosts(query: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(ilike(posts.content, `%${query}%`))
      .orderBy(desc(posts.createdAt))
      .limit(20);
  }

  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<void> {
    await db.insert(follows).values({ followerId, followingId });
    
    // Update follower and following counts
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} + 1` })
      .where(eq(users.id, followerId));
    
    await db
      .update(users)
      .set({ followersCount: sql`${users.followersCount} + 1` })
      .where(eq(users.id, followingId));
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.delete(follows).where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    );
    
    // Update follower and following counts
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} - 1` })
      .where(eq(users.id, followerId));
    
    await db
      .update(users)
      .set({ followersCount: sql`${users.followersCount} - 1` })
      .where(eq(users.id, followingId));
  }

  async getUserFollowers(userId: string): Promise<Follow[]> {
    return await db.select().from(follows).where(eq(follows.followingId, userId));
  }

  async getUserFollowing(userId: string): Promise<Follow[]> {
    return await db.select().from(follows).where(eq(follows.followerId, userId));
  }

  // Message operations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await db
      .select({ id: conversations.id, name: conversations.name, isGroup: conversations.isGroup, createdAt: conversations.createdAt, updatedAt: conversations.updatedAt })
      .from(conversations)
      .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
      .where(eq(conversationParticipants.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update conversation updated timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return newMessage;
  }

  async createConversation(participantIds: string[], name?: string): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ name, isGroup: participantIds.length > 2 })
      .returning();
    
    // Add participants
    const participantData = participantIds.map(userId => ({
      conversationId: conversation.id,
      userId,
    }));
    
    await db.insert(conversationParticipants).values(participantData);
    
    return conversation;
  }
}

export const storage = new DatabaseStorage();
