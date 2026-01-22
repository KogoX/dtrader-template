import React from 'react';

import { Stream } from '@cloudflare/stream-react';
import { LabelPairedPlayMdFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { CaptionText } from '@deriv-com/quill-ui';

type TVideoPreview = {
    contract_type: string;
    toggleVideoPlayer: () => void;
    video_src: string;
};

const VideoPreview = ({ contract_type, toggleVideoPlayer, video_src }: TVideoPreview) => (
    <div className='guide-video__wrapper' onClick={toggleVideoPlayer} onKeyDown={toggleVideoPlayer}>
        <div className='guide-video__preview' data-testid='dt_video_preview'>
            <Stream
                className='guide-video'
                letterboxColor='transparent'
                muted
                preload='auto'
                responsive={false}
                src={video_src}
                width='448px'
                height='252px'
            />
            <div className='guide-video__preview__icon__wrapper'>
                <LabelPairedPlayMdFillIcon className='guide-video__preview__icon' />
            </div>
        </div>
    </div>
);

export default VideoPreview;
