import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { useContext, useEffect } from "react";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
    const { id } = useParams();
    const { socket, user, stream, peers } = useContext(SocketContext);
    useEffect(() => {
        if (user) socket.emit("joinRoom", { roomId: id, peerId: user._id });
    }, [id, user, socket]);
    // ...existing code...
    return (
        <div>
            room:{id}
            <br />
            Your user feed {user && <span>(Peer ID: {user.id})</span>}
            <UserFeedPlayer stream={stream} />
            <div>
                Other Users feed
                {Object.entries(peers).map(([peerId]) => (
                    <div key={peerId}>
                        <h3>Peer ID: {peerId}</h3>
                        <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Room;