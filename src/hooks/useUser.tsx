import { useState, useEffect } from "react";

type UserListProps = {
  page: number;
  searchParams: string;
};

// Todo: Add pagination in future
const userUserList = ({ page = 0, searchParams = "" }: UserListProps) => {
  console.log("first", page, searchParams);
  const [data, setData] = useState({ userList: [], loading: false });

  useEffect(() => {
    fetch("");
  }, []);
  return { data };
};

export default userUserList;
