import { intializeSocketConnection } from "../../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../../service/chat.api";
import {
  createNewChat,
  addNewMessage,
  addMessages,
  setChats,
  setLoading,
  setError,
  setCurrentChatId,
} from "../../chat.slice";

import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessages } = data;

      const resolvedChatId = chatId || chat?._id;

      if (!resolvedChatId) {
        dispatch(setError("Chat ID missing"));
        return;
      }

      if (!chatId) {
        //  Only create new chat if it's a brand new conversation
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(
        addNewMessage({
          chatId: resolvedChatId,
          content: message,
          role: "user",
        }),
      );

      if (aiMessages) {
        dispatch(
          addNewMessage({
            chatId: resolvedChatId,
            content: aiMessages.content,
            role: aiMessages.role,
          }),
        );
      }

      dispatch(setCurrentChatId(resolvedChatId));
    } catch (error) {
      console.error("Send message error:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }
    dispatch(setCurrentChatId(chatId));
  }

  return {
    intializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
