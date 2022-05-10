import React from "react";

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