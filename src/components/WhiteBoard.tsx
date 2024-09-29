import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import 'tldraw/tldraw.css';
interface WhiteBoardProps {
    roomId: string;
}

const WhiteBoard = ({ roomId }: WhiteBoardProps) => {
    const store = useSyncDemo({ roomId: roomId });
    return (
        <div className='w-full h-full'>
            <Tldraw store={store} />
        </div>
    )
}

export default WhiteBoard
