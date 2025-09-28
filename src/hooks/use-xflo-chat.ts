'use client';

import { useState, useCallback, useRef } from 'react';
import { xfloChatAPI } from '@/lib/xflo-chat-api';
import type { Message } from '@/components/ui/chat-message';

interface UseXFloChatOptions {
  onError?: (error: Error) => void;
  onAuthSuccess?: () => void;
}

export function useXFloChat({ onError, onAuthSuccess }: UseXFloChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [processingMessage, setProcessingMessage] = useState<{
    message: string;
    flash: boolean;
  } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setProcessingMessage(null); // Clear processing message on stop
    }
  }, []);

  const handleSubmit = useCallback(async (
    event?: { preventDefault?: () => void }
  ) => {
    event?.preventDefault?.();
    
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create a new assistant message ID for later use
    const assistantMessageId = (Date.now() + 1).toString();

    try {
      // No auth token needed for public endpoint
      onAuthSuccess?.();
      
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // Show default processing message immediately
      setProcessingMessage({
        message: "Just one moment, let me take a look...",
        flash: true
      });

      let accumulatedContent = '';

      await xfloChatAPI.streamChat(
        {
          content: input.trim(),
          thread_id: threadId
        },
        null, // No token needed for public endpoint
        (data) => {
          console.log('🔍 Received data:', data);
          
          // Handle status messages (processing, searching, etc.)
          if (data.status && data.message) {
            setProcessingMessage({
              message: data.message,
              flash: data.flash || false
            });
            return;
          }
          
          // xFlo public endpoint sends direct content, not typed objects
          if (data.content) {
            // Hide processing message when content starts streaming
            setProcessingMessage(null);
            
            // Create the assistant message if it doesn't exist yet
            setMessages(prev => {
              const hasAssistantMessage = prev.some(msg => msg.id === assistantMessageId);
              if (!hasAssistantMessage) {
                return [...prev, {
                  id: assistantMessageId,
                  role: 'assistant' as const,
                  content: ''
                }];
              }
              return prev;
            });
            
            accumulatedContent += data.content;
            
            // Process the content to ensure proper markdown formatting
            let processedContent = accumulatedContent;
            
            // Fix common markdown formatting issues from streaming
            processedContent = processedContent
              // Ensure headers have proper line breaks
              .replace(/(\S)(#{1,6}\s)/g, '$1\n\n$2')
              // Ensure list items have proper line breaks
              .replace(/(\S)(\n-\s)/g, '$1\n$2')
              // Ensure paragraphs have proper spacing
              .replace(/(\.\s+)([A-Z])/g, '$1\n\n$2')
              // Clean up excessive line breaks
              .replace(/\n{3,}/g, '\n\n');
            
            // Update the assistant message with processed content
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: processedContent }
                : msg
            ));
          } else if (data.thread_id) {
            setThreadId(data.thread_id);
          }
        },
        (error) => {
          console.error('Chat error:', error);
          // Hide processing message on error
          setProcessingMessage(null);
          // Update the assistant message with error
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: 'Sorry, an error occurred. Please try again.' }
              : msg
          ));
          onError?.(error);
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      console.error('Chat error:', error);
      // Update the assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, an error occurred. Please try again.' }
          : msg
      ));
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setProcessingMessage(null); // Clear processing message when done
      abortControllerRef.current = null;
    }
  }, [input, isLoading, threadId, onError, onAuthSuccess]);

  // Append function for prompt suggestions
  const append = useCallback(async (message: { role: 'user'; content: string }) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create a new assistant message ID for later use
    const assistantMessageId = (Date.now() + 1).toString();

    try {
      // No auth token needed for public endpoint
      onAuthSuccess?.();
      
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // Show default processing message immediately
      setProcessingMessage({
        message: "Just one moment, let me take a look...",
        flash: true
      });

      let accumulatedContent = '';

      await xfloChatAPI.streamChat(
        {
          content: message.content,
          thread_id: threadId
        },
        null, // No token needed for public endpoint
        (data) => {
          // xFlo public endpoint sends direct content, not typed objects
          if (data.content) {
            accumulatedContent += data.content;
            // Update the assistant message with accumulated content
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: accumulatedContent }
                : msg
            ));
          } else if (data.thread_id) {
            setThreadId(data.thread_id);
          }
        },
        (error) => {
          console.error('Chat error:', error);
          // Hide processing message on error
          setProcessingMessage(null);
          // Update the assistant message with error
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: 'Sorry, an error occurred. Please try again.' }
              : msg
          ));
          onError?.(error);
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      console.error('Chat error:', error);
      // Update the assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, an error occurred. Please try again.' }
          : msg
      ));
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setProcessingMessage(null); // Clear processing message when done
      abortControllerRef.current = null;
    }
  }, [isLoading, threadId, onError, onAuthSuccess]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
    threadId,
    processingMessage
  };
}