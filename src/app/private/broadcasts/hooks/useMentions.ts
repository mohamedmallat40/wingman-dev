import { useCallback, useState, useRef, useEffect } from 'react';
import { searchNetworkUsers, type NetworkUser } from '../services/networkService';

export interface MentionMatch {
  index: number;
  query: string;
  beforeMatch: string;
}

export const useMentions = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<NetworkUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse text for mention trigger (@)
  const findMentionMatch = useCallback((text: string, cursorPosition: number): MentionMatch | null => {
    // Find the last @ symbol before cursor position
    const beforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = beforeCursor.lastIndexOf('@');
    
    if (lastAtIndex === -1) return null;
    
    // Check if there's a space after the @ (which would end the mention)
    const textAfterAt = beforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(' ')) return null;
    
    // Check if @ is at start or preceded by whitespace
    const charBeforeAt = lastAtIndex > 0 ? beforeCursor[lastAtIndex - 1] : ' ';
    if (charBeforeAt !== ' ' && charBeforeAt !== '\n') return null;

    return {
      index: lastAtIndex,
      query: textAfterAt,
      beforeMatch: beforeCursor.substring(0, lastAtIndex)
    };
  }, []);

  // Search for users with debouncing
  const searchUsers = useCallback((query: string) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.length < 1) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Show loading immediately
    setIsSearching(true);

    // Debounce the actual API call
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const users = await searchNetworkUsers(query, 1, 10);
        setSuggestions(users);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Error searching users:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce delay
  }, []);

  // Select a user mention
  const selectUser = useCallback((user: NetworkUser, text: string, mentionMatch: MentionMatch): { 
    newText: string; 
    newCursorPosition: number;
    taggedUsers: string[];
  } => {
    const userMention = `@${user.firstName} ${user.lastName}`;
    const textAfterCursor = text.substring(mentionMatch.index + mentionMatch.query.length + 1);
    
    const newText = mentionMatch.beforeMatch + userMention + ' ' + textAfterCursor;
    const newCursorPosition = mentionMatch.beforeMatch.length + userMention.length + 1;

    // Add user ID to tagged users
    const taggedUsers = [user.id];

    setSuggestions([]);
    setSelectedIndex(0);

    return {
      newText,
      newCursorPosition,
      taggedUsers
    };
  }, []);

  // Navigation helpers
  const navigateUp = useCallback(() => {
    setSelectedIndex(prev => Math.max(0, prev - 1));
  }, []);

  const navigateDown = useCallback(() => {
    setSelectedIndex(prev => Math.min(suggestions.length - 1, prev + 1));
  }, [suggestions.length]);

  const getSelectedUser = useCallback(() => {
    return suggestions[selectedIndex] || null;
  }, [suggestions, selectedIndex]);

  const closeSuggestions = useCallback(() => {
    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSuggestions([]);
    setSelectedIndex(0);
    setIsSearching(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSearching,
    suggestions,
    selectedIndex,
    findMentionMatch,
    searchUsers,
    selectUser,
    navigateUp,
    navigateDown,
    getSelectedUser,
    closeSuggestions
  };
};