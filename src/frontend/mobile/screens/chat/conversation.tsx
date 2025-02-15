// src/frontend/screens/chat/conversation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useChat } from '../../hooks/useChat';
import { MessageInput } from '../../components/message-input';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMedical: boolean;
}

const ConversationScreen = () => {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() !== '') {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
      {item.isMedical && <Text style={styles.medicalAlert}>Medical Content</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageListContainer}
      />
      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageListContainer: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#ECE5DD',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  medicalAlert: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ConversationScreen;

// src/frontend/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMedical: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender: 'me',
      text: text,
      timestamp: new Date(),
      isMedical: text.toLowerCase().includes('medical') || text.toLowerCase().includes('health'),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate receiving a message from the other user after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: uuidv4(),
        sender: 'them',
        text: `Received: ${text}`,
        timestamp: new Date(),
        isMedical: text.toLowerCase().includes('medical') || text.toLowerCase().includes('health'),
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 500);
  };

  return { messages, sendMessage };
};

// src/frontend/components/message-input.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, onChangeText, onSend }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Feather name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});