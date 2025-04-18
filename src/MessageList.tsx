import { useAuth0 } from "@auth0/auth0-react";
import Hamburger from "./assets/Hamburger";
import addUserPng from "./assets/add-user-icon.png";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Container, ModalContainer } from "./styled";
import UserList from "./UserList";
import { useQuery } from "@tanstack/react-query";
import { fetchWrapper } from "./utils/fetchUtils";
import { formatChatTimestamp } from "./utils/loginUtils";
import { Socket } from "socket.io-client";

type MessageList = {
  lastMessage: string;
  isRead: boolean;
  timestamp: string;
  auth0_id: string;
  name: string;
  email: string;
  picture: string;
};

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

const MessageList = ({
  handleClickMessage,
  socket,
  onlineUsers,
}: {
  handleClickMessage: (id: string, name: string) => void;
  socket: Socket | null;
  onlineUsers: string[];
}) => {
  const { user } = useAuth0();
  const [openUsers, setOpenUsers] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      fetchWrapper("http://localhost:3001/api/messages/all-chats").then((res) =>
        res.json()
      ),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (data?.users?.[0]) {
      handleClickMessage(data?.users?.[0]?.auth0_id, data?.users?.[0]?.name);
    }
  }, [data]);

  const onSlide = (e: any) => {};

  const onChatClick = (message: MessageList) => {
    handleClickMessage(message?.auth0_id, message.name);
  };
  return (
    <Container className="col-span-3">
      <div className="flex items-center p-2 justify-between top-menu">
        <div className="flex items-center">
          <Hamburger onClick={onSlide} />
          <h2 className="ml-5 text-white font-bold">{user?.name}</h2>
        </div>
        <button className="add-btn" onClick={() => setOpenUsers((p) => !p)}>
          <img src={addUserPng} alt="Add-User" className="h-9 w-9" />
        </button>
      </div>
      <ul className="flex flex-col shadow-sm h-auto overflow-y-auto message-list">
        {/* Add Pending State */}
        {data?.users?.map((element: MessageList) => {
          return (
            <li
              key={element.auth0_id}
              className="cursor-pointer"
              onClick={() => onChatClick(element)}
            >
              <div className="flex px-4 py-8 items-center">
                <p className=" text-center flex items-center justify-center">
                  <img
                    style={{
                      borderRadius: "50%",
                      height: "50px",
                      width: "50px",
                      maxWidth: "none",
                    }}
                    src={element.picture}
                    alt={element.name.charAt(0)}
                  />
                </p>
                <div
                  className="flex flex-col items-start"
                  style={{ width: "100%" }}
                >
                  <p className="ml-8 font-bold">{element.name}</p>
                  <p className="ml-8">{element.lastMessage ?? ""}</p>
                </div>
                <p className="text-sm font-medium whitespace-nowrap">
                  {formatChatTimestamp(element?.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Modal isOpen={openUsers} style={customStyles} ariaHideApp={false}>
        <ModalContainer>
          <button
            className="close-btn"
            onClick={() => setOpenUsers((prevState) => !prevState)}
          >
            X
          </button>
          <UserList onlineUsers={onlineUsers} />
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default MessageList;
