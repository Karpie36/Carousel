import React from "react";
import '../styles/Photo.less';

type PhotoProps ={
    photoSLUG: string,
    photoNumber: number
}

function Photo(props: PhotoProps) {
    return (
        <img 
            className="Photo" 
            src={`http://source.unsplash.com/${props.photoSLUG}`}
            alt={`Id number ${props.photoNumber}`} 
            onError={event => {
                const photo = event.target as HTMLElement;
                photo.setAttribute('alt', 'Image not found');
                photo.setAttribute('title', 'Image not found');
            }} 
        />
    )
}

export default Photo;