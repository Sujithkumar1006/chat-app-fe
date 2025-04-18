import { ChatBoxContiner } from "./styled";
import sendIcon from "./assets/send-icon.png";
import threeDots from "./assets/three-dots.png";
import { useEffect, useState, useRef } from "react";
import logOutPng from "./assets/logout.png";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { fetchWrapper } from "./utils/fetchUtils";
import { useQuery } from "@tanstack/react-query";
import { formatChatTimestamp } from "./utils/loginUtils";
import { Socket } from "socket.io-client";
import { Tooltip } from "react-tooltip";

interface IChatBox {
  currentSender: { name: string; id: string };
  socket: Socket | null;
  isUserOnline: boolean;
}

const ChatBox = ({ currentSender, socket, isUserOnline }: IChatBox) => {
  const { logout, user } = useAuth0();
  const [data, setData] = useState<any>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { isPending, error } = useQuery({
    queryKey: [`chats-${currentSender?.id}`],
    queryFn: () =>
      fetchWrapper(
        `http://localhost:3001/api/messages?sender_id=${currentSender?.id}`
      )
        .then((res) => res.json())
        .then((response: any) => {
          setData(response?.messages);
          return response;
        }),
    staleTime: 1000 * 60 * 10,
  });
  const [settingsModal, setSettingsModal] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    socket?.on("receive_message", (msg: any) => {
      console.log("Received message is ", msg);
      // if (msg.recipient === user?.sub) {
      setData((prev: any) => [...prev, msg]);

      if (msg.sender === currentSender.id && msg.recipient === user?.sub) {
        socket.emit("read_message", {
          messageId: msg._id,
          senderId: msg.sender,
        });
      }
      // }
    });
    return () => {
      socket?.off("receive_message");
    };
  }, [socket, currentSender.id, user?.sub]);

  useEffect(() => {
    socket?.on("message_read", ({ messageId }) => {
      setData((prev: any) =>
        prev.map((msg: any) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket?.off("message_read");
    };
  }, [socket]);

  useEffect(() => {
    const unreadMessages = data.filter(
      (msg: any) =>
        msg.sender === currentSender.id &&
        msg.recipient === user?.sub &&
        !msg.isRead
    );
    console.log("unreadMessages", unreadMessages);
    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg: any) => {
        socket?.emit("read_message", {
          messageId: msg._id,
          senderId: msg.sender,
        });
      });
    }
  }, [data, currentSender.id, user?.sub, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  const logOut = () => {
    Cookies.remove("access_token");
    logout();
    return;
  };
  const onKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(text);
    }
  };

  const sendMessage = (message: string) => {
    const messageObj = {
      reciever_id: currentSender?.id,
      message,
      time: new Date().toISOString(),
      sender_id: user?.sub,
    };
    socket?.emit("send_message", messageObj);
    setText("");
  };

  return (
    <ChatBoxContiner className="col-span-7">
      <div className="top-ctn">
        <h4>
          {currentSender?.name}{" "}
          <span
            className={`round-status ${
              isUserOnline ? "bg-green-500" : "bg-gray-400"
            }`}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={isUserOnline ? "Online" : "Offline"}
            data-tooltip-place="top"
          ></span>
          <Tooltip id="my-tooltip" />
        </h4>
        <div className="settings-ctn">
          <button
            className="three-dots-btn"
            onClick={() => setSettingsModal((prevState) => !prevState)}
          >
            <img src={threeDots} alt="Settings" />
          </button>
          {settingsModal ? (
            <div className="settings-modal">
              <button className="lg-btn" onClick={() => logOut()}>
                <img src={logOutPng} alt="Logout Image" />
                Log Out
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="chats-ctn">
        {isPending && <p>Loading...</p>}
        {error && <p>Error loading messages</p>}
        {data?.length > 0 &&
          data?.map((msg: any) => {
            const isCurrentUser = msg.sender === user?.sub;
            return (
              <div
                key={msg._id}
                className={`message-bubble ${isCurrentUser ? "right" : "left"}`}
              >
                <div className="bubble-content">
                  <p>{msg.content}</p>
                  <span className="timestamp">
                    {formatChatTimestamp(msg.timestamp || msg.createdAt)}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs">
                        {msg.isRead ? "✔✔" : "✔"}{" "}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>
      <div className="input-ctn">
        <div>
          <input
            type="text"
            placeholder="Send a message"
            onChange={handleChange}
            value={text}
            onKeyDown={onKeyEnter}
          />
          <button className="send-icon" onClick={() => sendMessage(text)}>
            <img src={sendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </ChatBoxContiner>
  );
};
export default ChatBox;
