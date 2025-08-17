import { useContext } from 'react';
import { SocketContext } from '../Context/SocketContext.tsx';
const CreateRoom: React.FC = () => {
    const socket = useContext(SocketContext);
    const initroom = () =>{
        socket.emit("createRoom");
    }
    return (
        <button onClick={initroom} className="btn btn-secondary">
            Start a new meeting room
        </button>
    );
}
export default CreateRoom;  