import { useCallback, useState } from 'react';
import type { CommentUIState, UseCommentUIReturn } from '../types/comments';

export const useCommentUI = (): UseCommentUIReturn => {
  const [uiState, setUIState] = useState<Record<string, CommentUIState>>({});

  const getCommentUIState = useCallback((commentId: string): CommentUIState => {
    return uiState[commentId] || {
      isExpanded: false,
      isReplying: false,
      isEditing: false,
      showReplies: true,
      replyInputValue: '',
      editInputValue: ''
    };
  }, [uiState]);

  const updateCommentUIState = useCallback((
    commentId: string, 
    updates: Partial<CommentUIState>
  ) => {
    setUIState(prev => ({
      ...prev,
      [commentId]: {
        ...getCommentUIState(commentId),
        ...updates
      }
    }));
  }, [getCommentUIState]);

  const toggleExpanded = useCallback((commentId: string) => {
    const currentState = getCommentUIState(commentId);
    updateCommentUIState(commentId, { isExpanded: !currentState.isExpanded });
  }, [getCommentUIState, updateCommentUIState]);

  const setReplying = useCallback((commentId: string, isReplying: boolean) => {
    updateCommentUIState(commentId, { 
      isReplying,
      // Close editing when starting to reply
      isEditing: isReplying ? false : getCommentUIState(commentId).isEditing
    });
  }, [getCommentUIState, updateCommentUIState]);

  const setEditing = useCallback((commentId: string, isEditing: boolean) => {
    updateCommentUIState(commentId, { 
      isEditing,
      // Close replying when starting to edit
      isReplying: isEditing ? false : getCommentUIState(commentId).isReplying
    });
  }, [getCommentUIState, updateCommentUIState]);

  const toggleShowReplies = useCallback((commentId: string) => {
    const currentState = getCommentUIState(commentId);
    updateCommentUIState(commentId, { showReplies: !currentState.showReplies });
  }, [getCommentUIState, updateCommentUIState]);

  const setReplyInput = useCallback((commentId: string, value: string) => {
    updateCommentUIState(commentId, { replyInputValue: value });
  }, [updateCommentUIState]);

  const setEditInput = useCallback((commentId: string, value: string) => {
    updateCommentUIState(commentId, { editInputValue: value });
  }, [updateCommentUIState]);

  const resetUI = useCallback((commentId: string) => {
    setUIState(prev => {
      const { [commentId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    uiState,
    actions: {
      toggleExpanded,
      setReplying,
      setEditing,
      toggleShowReplies,
      setReplyInput,
      setEditInput,
      resetUI
    }
  };
};