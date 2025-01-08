import React from 'react';

interface IconComponentProps {
    width?: number;
    height?: number;
    fill?: string;
    className?: string;
    children: React.ReactNode;
}

const IconComponent: React.FC<IconComponentProps> = ({
    width = 24,
    height = 24,
    fill = 'black',
    className = 'icon-component',
    children
}) => {
    return (
        <svg
            className={className}
            focusable="false"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    );
};

export default IconComponent;
