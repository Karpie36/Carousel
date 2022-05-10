import React, { useState, useEffect } from 'react';
import { UrlWithStringQuery } from 'url';

interface PhotoObject {
    id: string,
    author: string,
    width: number,
    height: number,
    url: URL,
    downloadUrl: URL
}

function Carousel() {
    const [imgsIds, setImgsIds] = useState([0, 1, 2])
    const imgsUrls = []

    useEffect(() => {
        fetch('https://picsum.photos/v2/list', {
            method: 'GET'
        })
        .then(response => {
            response.json().then((data: Array<PhotoObject>) => {
                data.forEach((element: PhotoObject) => {
                    console.log(element);
                });
            });
        })
    })

    return (
        <div className='Carousel'>
            <h1>Hello Carousel</h1>
        </div>
    )

}

export default Carousel;