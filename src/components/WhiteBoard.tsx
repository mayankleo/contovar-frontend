import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import 'tldraw/tldraw.css';
import PropTypes from 'prop-types';

const WhiteBoard = ({ roomId }) => {
    const store = useSyncDemo({ roomId: roomId });
    return (
        <div className='w-full h-full'>
            <Tldraw store={store} />
        </div>
    )
}

WhiteBoard.propTypes = {
    roomId: PropTypes.string.isRequired,
};

export default WhiteBoard
