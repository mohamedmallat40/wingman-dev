import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { type BroadcastPost } from '../types';

// ===== TYPES =====
interface RealtimeEvent {
  type: 'new_post' | 'post_updated' | 'post_deleted' | 'new_like' | 'new_comment' | 'new_share' | 'user_online' | 'user_offline';
  data: any;
  timestamp: string;
}

interface WebSocketMessage {
  event: string;
  data: any;
}

interface RealtimeOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// ===== WEBSOCKET HOOK =====

/**
 * Hook for managing WebSocket connection for real-time updates
 */
export const useRealtimeBroadcasts = (options: RealtimeOptions = {}) => {
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const connect = () => {
    try {
      const token = localStorage.getItem('token');
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/broadcasts?token=${token}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleRealtimeEvent(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handleRealtimeEvent = (message: WebSocketMessage) => {
    const { event, data } = message;

    switch (event) {
      case 'new_post':
        handleNewPost(data);
        break;
      case 'post_updated':
        handlePostUpdated(data);
        break;
      case 'post_deleted':
        handlePostDeleted(data);
        break;
      case 'new_like':
        handleNewLike(data);
        break;
      case 'new_comment':
        handleNewComment(data);
        break;
      case 'new_share':
        handleNewShare(data);
        break;
      case 'active_users_count':
        setActiveUsers(data.count);
        break;
      case 'user_online':
      case 'user_offline':
        // Handle user presence updates
        break;
      default:
        console.log('Unknown realtime event:', event, data);
    }
  };

  const handleNewPost = (post: BroadcastPost) => {
    // Add new post to the top of the feed
    queryClient.setQueryData(['broadcasts', 'feed'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      
      const newData = { ...oldData };
      newData.pages[0].data.unshift(post);
      return newData;
    });

    // Update trending posts if applicable
    if (post.isTrending) {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'trending'] });
    }
  };

  const handlePostUpdated = (updatedPost: BroadcastPost) => {
    // Update specific post in cache
    queryClient.setQueryData(['broadcasts', 'post', updatedPost.id], updatedPost);
    
    // Update feed data
    queryClient.setQueryData(['broadcasts', 'feed'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      
      const newData = { ...oldData };
      newData.pages = newData.pages.map((page: any) => ({
        ...page,
        data: page.data.map((post: BroadcastPost) => 
          post.id === updatedPost.id ? updatedPost : post
        )
      }));
      return newData;
    });
  };

  const handlePostDeleted = (postId: string) => {
    // Remove post from cache
    queryClient.removeQueries({ queryKey: ['broadcasts', 'post', postId] });
    
    // Remove from feed
    queryClient.setQueryData(['broadcasts', 'feed'], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      
      const newData = { ...oldData };
      newData.pages = newData.pages.map((page: any) => ({
        ...page,
        data: page.data.filter((post: BroadcastPost) => post.id !== postId)
      }));
      return newData;
    });
  };

  const handleNewLike = (data: { postId: string; likesCount: number }) => {
    // Update engagement count
    queryClient.setQueryData(['broadcasts', 'post', data.postId], (oldPost: BroadcastPost | undefined) => {
      if (!oldPost) return oldPost;
      return {
        ...oldPost,
        engagement: {
          ...oldPost.engagement,
          likes: data.likesCount
        }
      };
    });
  };

  const handleNewComment = (data: { postId: string; commentsCount: number }) => {
    // Update comment count
    queryClient.setQueryData(['broadcasts', 'post', data.postId], (oldPost: BroadcastPost | undefined) => {
      if (!oldPost) return oldPost;
      return {
        ...oldPost,
        engagement: {
          ...oldPost.engagement,
          comments: data.commentsCount
        }
      };
    });
    
    // Invalidate comments for this post
    queryClient.invalidateQueries({ queryKey: ['broadcasts', 'comments', data.postId] });
  };

  const handleNewShare = (data: { postId: string; sharesCount: number }) => {
    // Update share count
    queryClient.setQueryData(['broadcasts', 'post', data.postId], (oldPost: BroadcastPost | undefined) => {
      if (!oldPost) return oldPost;
      return {
        ...oldPost,
        engagement: {
          ...oldPost.engagement,
          shares: data.sharesCount
        }
      };
    });
  };

  // Subscribe to specific events
  const subscribeToPost = (postId: string) => {
    sendMessage({
      event: 'subscribe_to_post',
      data: { postId }
    });
  };

  const unsubscribeFromPost = (postId: string) => {
    sendMessage({
      event: 'unsubscribe_from_post',
      data: { postId }
    });
  };

  const subscribeToSubcast = (subcastId: string) => {
    sendMessage({
      event: 'subscribe_to_subcast',
      data: { subcastId }
    });
  };

  const unsubscribeFromSubcast = (subcastId: string) => {
    sendMessage({
      event: 'unsubscribe_from_subcast',
      data: { subcastId }
    });
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionError,
    activeUsers,
    connect,
    disconnect,
    sendMessage,
    subscribeToPost,
    unsubscribeFromPost,
    subscribeToSubcast,
    unsubscribeFromSubcast
  };
};

// ===== SERVER-SENT EVENTS HOOK =====

/**
 * Hook for Server-Sent Events as an alternative to WebSocket
 */
export const useRealtimeSSE = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  const connect = () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasts/events?token=${token}`;
      
      eventSourceRef.current = new EventSource(url);

      eventSourceRef.current.onopen = () => {
        console.log('SSE connected');
        setIsConnected(true);
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleRealtimeEvent(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsConnected(false);
    }
  };

  const handleRealtimeEvent = (data: any) => {
    // Similar event handling as WebSocket implementation
    switch (data.type) {
      case 'new_post':
        queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
        break;
      case 'post_updated':
        queryClient.setQueryData(['broadcasts', 'post', data.post.id], data.post);
        break;
      case 'active_users_count':
        setActiveUsers(data.count);
        break;
      default:
        console.log('Unknown SSE event:', data.type, data);
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    activeUsers,
    connect,
    disconnect
  };
};

// ===== TYPING INDICATOR HOOK =====

/**
 * Hook for managing typing indicators in comments
 */
export const useTypingIndicator = (postId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { sendMessage } = useRealtimeBroadcasts();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = () => {
    sendMessage({
      event: 'typing_start',
      data: { postId }
    });

    // Reset typing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

  const stopTyping = () => {
    sendMessage({
      event: 'typing_stop',
      data: { postId }
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopTyping();
    };
  }, []);

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};