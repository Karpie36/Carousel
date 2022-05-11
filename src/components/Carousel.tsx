import { resolve } from 'path';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Carousel.less';
import Slider from './Slider';

interface PhotoObject {
    id: string,
    author: string,
    width: number,
    height: number,
    url: string,
    downloadUrl: string
}

let sliderDirection = 1;

function Carousel() {
    const [imgsIds, setImgsIds] = useState([0, 1, 2]);
    const [imgsSLUGs, setImgsSLUGs]= useState([]);
    const isInitialMount = useRef(true);

    useEffect(() => {
        fetch('https://picsum.photos/v2/list', {
            method: 'GET'
        })
        .then(response => {
            response.json().then((data: Array<PhotoObject>) => {
                const slugs : Array<string> = []
                data.forEach((element: PhotoObject) => {
                    const url_address = element["url"];
                    const slug = url_address.includes('https://unsplash.com/photos/') ? url_address.replace('https://unsplash.com/photos/', '') : '';
                    slug && slugs.push(slug);
                });
                setImgsSLUGs(slugs);
            });
        })
    }, [])

    useEffect(() => {
        if (isInitialMount.current) {
           isInitialMount.current = false;
        } else {
            // Your useEffect code here to be run on update
            const slider : HTMLElement = document.querySelector('.Slider');
            slider.style.animation = sliderDirection==1 ? 'movingLeftInside 2s forwards' : 'movingRightInside 2s forwards';
        }
    });

    function changePhotos(direction : number) {
        sliderDirection = direction;
        const slider : HTMLElement = document.querySelector('.Slider');
        slider.style.animation = direction == 1 ? 'movingLeftOutside 1s forwards' : 'movingRightOutside 1s forwards';
        Promise.all(
            slider.getAnimations().map(animation => {
                return animation.finished
            })
        )
        .then(result => {
            const newImgsIds : Array<number> = imgsIds.map(id => {
                return (id + direction*imgsIds.length + imgsSLUGs.length) % imgsSLUGs.length
            });
            setImgsIds(newImgsIds);
            slider.style.marginLeft = direction == 1 ? '200%' : '-200%';
        })
    }

    return (
        <div className='Carousel'>
            <button
                className='prevBtn'
                onClick={event => {
                    event.preventDefault();
                    changePhotos(-1);
                }
            }>Prev</button>
            <Slider imgsIds={imgsIds} imgsSLUGs={imgsSLUGs}/>
            <button
                className='nextBtn'
                onClick={event => {
                    event.preventDefault();
                    changePhotos(1);
                }
            }>Next</button>
        </div>
    )
}

export default Carousel;