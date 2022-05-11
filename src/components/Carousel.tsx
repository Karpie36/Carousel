import React, { useState, useEffect } from 'react';
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

function Carousel() {
    const [imgsIds, setImgsIds] = useState([0, 1, 2])
    const [imgsSLUGs, setImgsSLUGs]= useState([])

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

    return (
        <div className='Carousel'>
            <Slider imgsIds={imgsIds} imgsSLUGs={imgsSLUGs}/>
            <button
                className='nextBtn'
                onClick={event => {
                    event.preventDefault();
                    const newImgsIds : Array<number> = imgsIds.map(id => {
                        return (id + 3) % imgsSLUGs.length
                    });
                    setImgsIds(newImgsIds);
                }
            }>Next</button>
        </div>
    )
}

export default Carousel;