import React from 'react';

interface IProps {
    isLike: boolean;
    handleLike: (res: boolean) => void;
}

const LikeButton: React.FC<IProps> = ({ isLike, handleLike }) => {

    return (
        <>
            {
                isLike ? <i className="fas fa-heart text-danger" onClick={() => handleLike(false)}/> :
                    <i className="far fa-heart" onClick={() => handleLike(true)}/>
            }
        </>
    );
};

export default LikeButton;
