import React from 'react';

interface IProps{
    isSaved: boolean;
    handleSave: (res: boolean) => void;
}

const SaveButton: React.FC<IProps> = ({ isSaved, handleSave }) => {
    return (
        <>
            {
              isSaved ? <i className="fas fa-bookmark text-info"
                           onClick={() => handleSave(false)} /> :
                  <i className="far fa-bookmark"
                     onClick={() => handleSave(true)} />
            }
        </>
    );
};

export default SaveButton;
