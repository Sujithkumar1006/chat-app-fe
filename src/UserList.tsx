import profilePic from "./assets/profile-pic.png";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { fetchWrapper } from "./utils/fetchUtils";
import { Tooltip } from "react-tooltip";

const UserList = ({
  onlineUsers,
  onUserClick,
}: {
  onlineUsers: string[];
  onUserClick: (e: any) => void;
}) => {
  const { isPending, data } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      fetchWrapper("http://localhost:3001/api/user").then((res: any) =>
        res.json()
      ),
    staleTime: 1000 * 60 * 10,
  });

  if (isPending)
    return (
      <>
        <Skeleton height={25} count={5} />
      </>
    );
  return (
    <ul className="user-list">
      {data?.users?.map((e: any) => {
        return (
          <li key={e.userId} onClick={() => onUserClick(e)}>
            <img
              src={e?.profilePicture ?? profilePic}
              alt="Default Pic"
              referrerPolicy="no-referrer"
            />
            <p>{e.name}</p>
            <span
              className={`round-status ${
                onlineUsers.includes(e.userId) ? "bg-green-500" : "bg-gray-400"
              }`}
              data-tooltip-id="my-tooltip"
              data-tooltip-content={
                onlineUsers.includes(e.userId) ? "Online" : "Offline"
              }
              data-tooltip-place="top"
            ></span>
            <Tooltip id="my-tooltip" />
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
