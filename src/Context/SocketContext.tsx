import SocketIoClient from 'socket.io-client';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as UUIDv4 } from 'uuid';
import Peer from 'peerjs';
import { peerReducer } from '../Reducers/peerReducer';
import { addPeerAction } from '../Actions/peerActions';

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
    const [stream,setStream] = useState<MediaStream>();
    const [peers,dispatch] = useReducer(peerReducer, {});
    const fetchUserFeed= async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
    }
    useEffect(()=>{
        const userId = UUIDv4();
        const newPeer = new Peer(userId,{
            host: 'localhost',
            port: 3000,
            path: '/myapp'
        });
        setUser(newPeer);
        fetchUserFeed();
        const enterRoom=({roomId}:{roomId:string})=>{
            navigate(`/room/${roomId}`);
        }
        socket.on('roomCreated', enterRoom);
    }, []);
    useEffect(() => {
        if(!user||!stream) return;
        socket.on("user-joined",({peerId})=>{
            const call=user.call(peerId, stream);
            console.log(`Calling new peer: ${peerId}`);
            call.on('stream', () => {
                dispatch(addPeerAction(peerId, stream));
            });
        });
        user.on('call', (call) => {
            console.log("Received a call from peer:", call.peer);
            call.answer(stream); // Answer the call with our stream
            call.on('stream', () => {
                console.log(`Received stream from peer: ${call.peer}`);
                dispatch(addPeerAction(call.peer, stream));
            });
        });
        socket.emit("ready");
    },[user, stream]);
    return (
        <SocketContext.Provider value={{socket,user,stream,peers}}>
            {children}
        </SocketContext.Provider>
    );
};