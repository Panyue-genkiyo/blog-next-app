import React from 'react';

interface IProps {
    msg: string;
}


const NotContent: React.FC<IProps> = ({ msg }) => {
    return (
        <div className="notification_not_found">
            <p>{msg}</p>
        </div>
    );
};

export default NotContent;
