import { ChatBoxContiner } from "./styled";
import sendIcon from "./assets/send-icon.png";
import threeDots from "./assets/three-dots.png";
import { useEffect, useState, useRef } from "react";
import logOutPng from "./assets/logout.png";
import settingsPng from "./assets/setting.png";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import { fetchWrapper } from "./utils/fetchUtils";
import { useQuery } from "@tanstack/react-query";
import { formatChatTimestamp } from "./utils/loginUtils";
import { Socket } from "socket.io-client";
import { Tooltip } from "react-tooltip";
import attachFile from "./assets/attach-file.png";
import Modal from "react-modal";
import { ModalContainer } from "./styled";

interface IChatBox {
  currentSender: { name: string; id: string };
  socket: Socket | null;
  isUserOnline: boolean;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
  },
};

const ChatBox = ({ currentSender, socket, isUserOnline }: IChatBox) => {
  const { logout, user } = useAuth0();
  const [data, setData] = useState<any>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [ttl, setTtl] = useState(0);

  const { isPending, error } = useQuery({
    queryKey: [`chats-${currentSender?.id}`],
    queryFn: () =>
      fetchWrapper(
        `http://localhost:3001/api/messages?sender_id=${currentSender?.id}`
      )
        .then((res) => res.json())
        .then((response: any) => {
          setData(response?.messages);
          setTtl(() => {
            return response?.settings.filter(
              (e: any) => e.recipientId === currentSender.id
            )?.[0]?.ttl;
          });
          return response;
        }),
  });
  const [settingsModal, setSettingsModal] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    socket?.on("receive_message", (msg: any) => {
      setData((prev: any) => [...prev, { ...msg }]);

      if (msg.sender === currentSender.id && msg.recipient === user?.sub) {
        socket.emit("read_message", {
          messageId: msg._id,
          senderId: msg.sender,
          recieverId: msg.recipient,
        });
      }
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
    if (data) {
      const unreadMessages = data.filter(
        (msg: any) => msg.recipient === user?.sub && !msg.isRead
      );

      if (unreadMessages.length > 0) {
        unreadMessages.forEach((msg: any) => {
          socket?.emit("read_message", {
            messageId: msg._id,
            senderId: msg.sender,
            recieverId: msg.recipient,
          });
        });
      }
    }
  }, [data, currentSender.id, user?.sub, socket]);

  useEffect(() => {
    socket?.on("receive_image", (msg: any) => {
      setData((p: any) => [...p, msg]);
    });

    socket?.on("message_deleted", ({ messageId }) => {
      setData((prev: any) => {
        return prev.map((msg: any) => {
          if (msg._id === messageId) {
            return { ...msg, isDeleted: true };
          } else return msg;
        });
      });
    });

    return () => {
      socket?.off("receive_image");
      socket?.off("message_deleted");
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeout);
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
    socket?.emit("send_message", { ...messageObj });
    setText("");
  };

  const openFileUpload = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      socket?.emit("send_image", {
        imageBuffer: arrayBuffer,
        fileName: file.name,
        time: new Date().toISOString(),
        reciever_id: currentSender?.id,
        sender_id: user?.sub,
        message: null,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const updateMessageTimer = () => {
    fetchWrapper(`http://localhost:3001/api/user/message-settings`, "POST", {
      senderId: user?.sub,
      recipientId: currentSender?.id,
      ttl,
    })
      .then((res) => res.json())
      .then(() => {
        setOpenSettings(!openSettings);
      });
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
              <button
                className="lg-btn"
                onClick={() => setOpenSettings(!openSettings)}
              >
                <img src={settingsPng} alt="Settings Image" />
                Chat Settings
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
                  {msg?.isDeleted ? (
                    <p style={{ fontStyle: "italic" }}>
                      ** Message is deleted **
                    </p>
                  ) : msg.imageUrl ? (
                    <div className="chat-image">
                      <img
                        src={msg.imageUrl}
                        alt="sent"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <span className="timestamp">
                    {formatChatTimestamp(msg.timestamp || msg.createdAt)}
                    {isCurrentUser && (
                      <span
                        className="ml-2 text-xs"
                        style={{ color: msg.isRead ? "green" : "" }}
                      >
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
          <div>
            <button onClick={openFileUpload}>
              <img
                src={attachFile}
                alt="Add file"
                style={{ height: "2em", marginLeft: "20px" }}
              />
            </button>

            <input
              type="file"
              ref={uploadInputRef}
              style={{ display: "none" }}
              onChange={onImageUpload}
              accept="image/*"
            />
          </div>

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
      <Modal isOpen={openSettings} style={customStyles} ariaHideApp={false}>
        <ModalContainer>
          <button
            className="close-btn"
            onClick={() => setOpenSettings((prevState) => !prevState)}
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4" style={{ color: "black" }}>
            Message Options
          </h2>
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "black" }}
          >
            Auto-Destruct After
          </label>
          <select
            value={ttl}
            onChange={(e) => setTtl(Number(e.target.value))}
            className="w-full border rounded p-2 mb-4"
            style={{ border: "1px solid black", color: "black" }}
          >
            <option value={0}>Do not auto-delete</option>
            <option value={5}>5 seconds</option>
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
          </select>
          <button
            onClick={updateMessageTimer}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </ModalContainer>
      </Modal>
    </ChatBoxContiner>
  );
};
export default ChatBox;
