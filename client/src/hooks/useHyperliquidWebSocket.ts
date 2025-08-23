import { useEffect, useState, useCallback, useRef } from 'react';

interface WebSocketMessage {
  channel: string;
  data: any;
}

interface HyperliquidWebSocketHook {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  subscribe: (channels: string[]) => void;
  unsubscribe: (channels: string[]) => void;
  sendMessage: (message: any) => void;
  connectionError: string | null;
}

export const useHyperliquidWebSocket = (
  walletAddress?: string
): HyperliquidWebSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribedChannels = useRef<Set<string>>(new Set());

  const connect = useCallback(() => {
    if (!walletAddress) return;

    try {
      // Hyperliquid WebSocket endpoint
      const ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
      
      ws.onopen = () => {
        console.log('Connected to Hyperliquid WebSocket');
        setIsConnected(true);
        setConnectionError(null);
        
        // Resubscribe to channels after reconnection
        if (subscribedChannels.current.size > 0) {
          const channels = Array.from(subscribedChannels.current);
          subscribe(channels);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from Hyperliquid WebSocket');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('WebSocket connection error');
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to establish connection');
    }
  }, [walletAddress]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const subscribe = useCallback((channels: string[]) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    channels.forEach(channel => {
      subscribedChannels.current.add(channel);
      wsRef.current?.send(JSON.stringify({
        method: 'subscribe',
        subscription: { type: channel, user: walletAddress }
      }));
    });
  }, [walletAddress]);

  const unsubscribe = useCallback((channels: string[]) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    channels.forEach(channel => {
      subscribedChannels.current.delete(channel);
      wsRef.current?.send(JSON.stringify({
        method: 'unsubscribe',
        subscription: { type: channel, user: walletAddress }
      }));
    });
  }, [walletAddress]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [walletAddress, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
    connectionError
  };
};