import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef,useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { apiClient } from '../api/api';
import { chatMessagesState, userProfileState } from '../recoil/Object.recoil';
import { ChatMessage } from '../types/types';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const user = useRecoilValue(userProfileState);
  // * Recoil State
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
  
    // Fetch messages on load
    // todo 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: chatHistory, error, isFetching } = useQuery({
      queryKey: ['messages', user?.userId], 
      queryFn: async () => {
        if (!user?.userId) {
          throw new Error('User ID is undefined');
        }
        return apiClient.getMessagesByUserId(user.userId);
      },
      enabled: !!user?.userId, // Only run the query when userId exists
    });
  
    useEffect(() => {
      if (chatHistory) {
        const sortedChatHistory = [...chatHistory].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setChatMessages(sortedChatHistory);
      }
      else if (error) {
        console.error('Error fetching messages:', error);
      }
    }, [chatHistory, error, setChatMessages]);

    
  // todo: refactor to antoher file
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      apiClient.sendMessageToGPT(JSON.stringify({ message })),
    onSuccess: (data) => {
      if (!user?.userId) return;

      const botMessage: ChatMessage = {
        msgId: `msg-${  uuidv4()}`,
        userId: user.userId,
        sender: 'bot',
        message: data.response,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((oldMessages) => [...oldMessages, botMessage]);
  
    saveMessageMutation.mutate(botMessage);
    },
    onError: (err) => {
      console.error('Error sending message to GPT:', err);
    },
    
  });

  const { mutate: sendToGPT, isPending } = sendMessageMutation;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user?.userId) return;

    const userMessage: ChatMessage = {
      msgId: `msg-${  uuidv4()}`,
      userId: user?.userId,
      sender: 'user',
      message: inputValue,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((oldMessages) => [...oldMessages, userMessage]);
    
    sendToGPT(inputValue);
    setInputValue('');

    saveMessageMutation.mutate(userMessage);
  };

  // todo: refactor to another file
  const saveMessageMutation = useMutation({
    mutationFn: async (message: ChatMessage) => {
      await apiClient.saveMessage(message);
    },
    onError: (err) => {
      console.error('Error saving message:', err);
    },
  });
   
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false); // Hide the scroll button after scrolling
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    // Show button if the user is not at the bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  // scroll to bottom when new message is added by user
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.sender === 'user') {
        scrollToBottom();
      }
    }
  }, [chatMessages]); 

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (!chatContainer) return;

    chatContainer.addEventListener('scroll', handleScroll);
    // eslint-disable-next-line consistent-return
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg h-full" style={{ maxHeight: '90vh' }}>
      {/* Display messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto bg-gray-100 rounded-t-lg p-4 space-y-4 overflow-x-hidden"
      >

        {chatMessages.map((msg) => (
          <div
            key={msg.msgId}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-100 text-gray-700'
              } p-3 rounded-lg max-w-xs break-words`}
            >
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-700 p-3 rounded-lg max-w-xs">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
      <button
        type="button"
        onClick={scrollToBottom}
        className="absolute bg-blue-300 text-white rounded-full shadow-lg hover:bg-blue-600"
        style={{
          top: '80%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          padding: '12px', 
          zIndex: 10, 
        }}
      >
        ↓
      </button>
      )}
      </div>

      {/* Input field for new message */}
      <div className="w-full flex items-center bg-gray-100 p-2" style={{ height: '72px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;