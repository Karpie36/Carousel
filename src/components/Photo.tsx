import React from "react";
import '../styles/Photo.less';

type PhotoProps ={
    photoSLUG: string,
    photoNumber: number
}

function Photo(props: PhotoProps) {
    return (
        <img className="Photo" src={`http://source.unsplash.com/${props.photoSLUG}`} alt={`Id number ${props.photoNumber}`} />
    )
}

export default Photo;