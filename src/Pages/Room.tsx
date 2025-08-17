import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { useContext, useEffect } from "react";

const Room: React.FC = () => {
    const {id} = useParams();
    const socket= useContext(SocketContext);
    useEffect(() => {
        socket.emit("joinRoom", { roomId: id });
    }, []);
    return (
        <div>
            room:{id}
        </div>
    );
}

export default Room;