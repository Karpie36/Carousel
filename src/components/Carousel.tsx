import React, { useState, useEffect, ReactNode } from 'react';
import Photo from "./Photo";

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
                    const slug = url_address.includes('https://unsplash.com/photos/') ? url_address.replace('https://unsplash.com/photos/', '') : ""
                    slug && slugs.push(slug);
                });
                setImgsSLUGs(slugs);
            });
        })
    }, [])

    return (
        <div className='Carousel'>
            {
                imgsIds.map((id:number) => {
                    return <Photo photoSLUG={imgsSLUGs[id]} photoNumber={id}/>
                })
            }
        </div>
    )

}

export default Carousel;