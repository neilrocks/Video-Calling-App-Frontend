import SocketIoClient from 'socket.io-client';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as UUIDv4 } from 'uuid';
import Peer from 'peerjs';

const WS_Server="http://localhost:5500";
export const SocketContext = createContext<any|null>(null);
const socket=SocketIoClient(WS_Server);
interface Props{
    children: React.ReactNode;  
}
export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    //state variable to hold the user peer instance
    const [user,setUser] = useState<Peer>();
    useEffect(()=>{
        const userId = UUIDv4();
        const newPeer = new Peer(userId);
        setUser(newPeer);
        const enterRoom=({roomId}:{roomId:string})=>{
            navigate(`/room/${roomId}`);
        }
        socket.on('roomCreated', enterRoom);
    }, []);
    return (
        <SocketContext.Provider value={{socket,user}}>
            {children}
        </SocketContext.Provider>
    );
};