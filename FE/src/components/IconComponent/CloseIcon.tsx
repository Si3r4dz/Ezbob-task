import React from 'react';
import IconComponent from './IconComponent';

const CloseIcon: React.FC = () => {
    return (
        <IconComponent width={24} height={24} fill="black">
            <path
                fill="#5e5e5e"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            ></path>
        </IconComponent>
    );
};

export default CloseIcon;
