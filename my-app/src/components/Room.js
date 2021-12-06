import { useParams } from 'react-router-dom';
import Chat from "./Chat";

const Room  = () => {
    const { id } = useParams();    
    return <Chat id={id}/>
}

export default Room;