import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { syncAuth0ToServer } from "./utils/loginUtils";
import { useSocket } from "./hooks/useSocket";

function Home() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [currentSender, setCurrentSender] = useState({ id: "", name: "" });
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [tokenReady, setTokenReady] = useState(false);

  const socketRef = useSocket(user?.sub);

  useEffect(() => {
    getAccessTokenSilently()
      .then(async (response) => {
        Cookies.set("access_token", response);
        setTokenReady(true);
      })
      .catch((_) => {
        toast("Error in setting cookies !");
      });
  }, []);

  useEffect(() => {
    if (socketRef) {
      console.log("Socket connected:", socketRef?.connected);
      socketRef?.on("online_users", (users: string[]) => {
        console.log("chats---->", users);
        setOnlineUsers(users);
      });
    }
  }, [socketRef]);

  useEffect(() => {
    if (user?.name && tokenReady)
      syncAuth0ToServer(user).catch((err) => {
        toast.error(err);
      });
  }, [user, tokenReady]);

  const handleChangeChatScreen = (userId: string, name: string) => {
    setCurrentSender({ id: userId, name });
  };
  return (
    <div className="grid grid-cols-10">
      {tokenReady && (
        <>
          <MessageList
            handleClickMessage={handleChangeChatScreen}
            socket={socketRef}
            onlineUsers={onlineUsers}
          />
          {currentSender?.id && (
            <ChatBox
              currentSender={currentSender}
              socket={socketRef}
              isUserOnline={onlineUsers.includes(currentSender?.id)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;
