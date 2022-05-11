import React from 'react';
import '../styles/Slider.less';
import Photo from "./Photo";

type SliderProps = {
    imgsIds: Array<number>,
    imgsSLUGs: Array<string>
}

function Slider(props: SliderProps) {

    return (
        <div className='Slider'>
        {
            props.imgsIds.map((id:number) => {
                return <Photo photoSLUG={props.imgsSLUGs[id]} photoNumber={id}/>
            })
        }
        </div>
    )
}

export default Slider;