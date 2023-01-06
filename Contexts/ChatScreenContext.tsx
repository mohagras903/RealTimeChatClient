import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { userContext } from "./UserContext";
export const chatScreenContext = createContext(null);

export default function ChatScreenContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, token } = useContext(userContext);
  const [newChat, setNewChat] = useState<string>("");
  const [existingChats, setExistingChats] = useState<Array<string>>([]);
  const [selectedChat, setSelectedChat] = useState<string>(); //other username of selected chat
  /*
  screen modes: (mobile)      -      (desktop)
        0: first sidebar only        first sidebar only   
        1: second sidebar: chats     first and second sidebar: chats
        2: second sidebar: requests  first and second sidebar: requests 
        3: chat box only             chat box only
  */
  const [displayMode, setDisplayMode] = useState<number>(0);
  const [showFriendRequestBox, setShowFriendRequestBox] =
    useState<boolean>(false);
  const createNewChat = async (otherUsername: string) => {
    try {
      const response = await fetch("https://localhost:7298/api/Chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [user.username, otherUsername],
          messages: [],
        }),
      });
      if (response.status >= 400) {
        alert(await response.text());
        return;
      }
      return response.json();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (newChat.length) {
      createNewChat(newChat);
    }
  }, [newChat]);

  return (
    <chatScreenContext.Provider
      value={{
        newChat,
        setNewChat,
        existingChats,
        setExistingChats,
        selectedChat,
        setSelectedChat,
        displayMode,
        setDisplayMode,
        showFriendRequestBox,
        setShowFriendRequestBox,
      }}
    >
      {children}
    </chatScreenContext.Provider>
  );
}