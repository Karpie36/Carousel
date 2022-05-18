import { resolve } from 'path';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Carousel.less';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Button from './Button';
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
const mobileViewPort = window.matchMedia('(max-width: 700px)');

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

    function changeCarouselSize() {
        const photos = document.querySelectorAll('.Photo');
        photos.forEach((p : HTMLElement) => {
            p.setAttribute("style", `max-height: none`);
        })
        const slider : HTMLElement = document.querySelector('.Slider');
        const app : HTMLElement = document.querySelector('.App');
        const appWidth = app.offsetWidth;
        const sliderWidth = imgsIds.length == 3 ? 3.5 : 1;
        slider.setAttribute("style", `width: ${appWidth/sliderWidth}px`);
        const sliderHeight = slider.offsetHeight;
        slider.setAttribute("style", `height: ${sliderHeight + 20}px`);
        photos.forEach(photo => {
            photo.setAttribute("style", `max-height: ${sliderHeight}px`);
        });
    
        return app;
    }

    window.addEventListener('load', () => {
        const app = changeCarouselSize();
        app.style.display = "flex";
    })

    mobileViewPort.addListener(mq => {
        const carousel = document.querySelector('.Carousel');
        if(mq.matches) {
            carousel.setAttribute('style', 'width: 70%');
            setImgsIds([imgsIds[1]]);
        }
        else {
            carousel.setAttribute('style', 'width: 100%');
            setImgsIds([imgsIds[0], imgsIds[0] + 1, imgsIds[0] + 2]);
        }
        changeCarouselSize();
    })

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
            <Button nameOfClass={'prevBtn'} name={'Prev'} changePhotos={changePhotos} direction={-1}/>
            <Slider imgsIds={imgsIds} imgsSLUGs={imgsSLUGs}/>
            <Button nameOfClass={'nextBtn'} name={'Next'} changePhotos={changePhotos} direction={1}/>
        </div>
    )
}

export default Carousel;