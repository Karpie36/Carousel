import React from 'react';
import '../styles/Button.less';

interface ButtonProps {
    nameOfClass: string,
    name: string,
    direction: number,
    changePhotos: (direction: number) => void
}

function Button(props: ButtonProps) {
    return (
        <button
        className={props.nameOfClass}
        onClick={event => {
            event.preventDefault();
            props.changePhotos(props.direction);
        }
        }>{props.name}</button>
    )
}

export default Button;