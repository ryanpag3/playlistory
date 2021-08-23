import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import Platforms from '../util/Platforms';

const PlatformIcon = (props: any) => {
    switch(props.platform) {
        case Platforms.SPOTIFY:
            return <FaSpotify {...props } />;
        default:
            return null;
    }
};

export default PlatformIcon;