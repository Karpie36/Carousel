import React from "react";

type PhotoProps ={
    photoSLUG: string,
    photoNumber: number
}

function Photo(props: PhotoProps) {
    return (
        <img src={`http://source.unsplash.com/${props.photoSLUG}`} alt={`Id number ${props.photoNumber}`} />
    )
}

export default Photo;