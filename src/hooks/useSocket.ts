import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const useSocket = (userId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (userId) {
            const socket = io(SOCKET_URL);
            setSocket(socket);

            socket.on("connect", () => {
                console.log("Socket connected", socket.id);
                socket.emit("register", userId);
            });
            return () => {
                socket.disconnect();
            };
        }

    }, [userId]);

    return socket;
};
