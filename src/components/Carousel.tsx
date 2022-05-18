import React from 'react';
import '../styles/Carousel.less';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../styles/Button.less';
import PhotosContainer from './PhotosContainer';
import { act } from 'react-dom/test-utils';

interface PhotoObject {
    id: string,
    author: string,
    width: number,
    height: number,
    url: string,
    downloadUrl: string
}

let direction = 1;
const mobileViewPort = window.matchMedia('(max-width: 700px)');

type CarouselPropsType = {
    changeCarouselSize: () => {}
}

type CarouselStateType = {
    activePhotosContainer: boolean,
    firstPhotosContainer: { position: string, imgsIds: Array<number> },
    secondPhotosContainer: { position: string, imgsIds: Array<number> },
    imgsSLUGs: Array<string>
}

class Carousel extends React.Component<CarouselPropsType, CarouselStateType> {
    constructor(props: CarouselPropsType) {
        super(props);
        this.state = {
            activePhotosContainer: true,
            firstPhotosContainer: {
                position: '0',
                imgsIds: [0, 1, 2]
            },
            secondPhotosContainer: {
                position: '0',
                imgsIds: [3, 4, 5]
            },
            imgsSLUGs: []
        };
    }

    componentDidMount() {
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
                this.setState({
                    ...this.state,
                    imgsSLUGs: slugs
                })
            });
        })
    }

    // componentDidUpdate() {
    //     const PhotosContainer : HTMLElement = document.querySelector('.PhotosContainer');
    //     PhotosContainer.style.animation = PhotosContainerDirection === 1 ? 'movingLeftInside 2s forwards' : 'movingRightInside 2s forwards';
    // }



    // mobileViewPort.addListener(mq => {
        // const carousel = document.querySelector('.Carousel');
        // if(mq.matches) {
        //     carousel.setAttribute('style', 'width: 70%');
        //     setImgsIds([imgsIds[1]]);
        // }
        // else {
        //     carousel.setAttribute('style', 'width: 100%');
        //     setImgsIds([imgsIds[0], imgsIds[0] + 1, imgsIds[0] + 2]);
        // }
        // changeCarouselSize();
    // })

    countNewImgsIds(imgsIds: Array<number>, direction: number, imgsSLUGsLength: number) {
        return imgsIds.map(id => {
            return (id + direction*imgsIds.length + imgsSLUGsLength) % imgsSLUGsLength
        });
    }

    changePhotos(direction: number = 1) {
        const { activePhotosContainer, firstPhotosContainer, secondPhotosContainer, imgsSLUGs } = this.state;
        if(activePhotosContainer === true) {
            const newImgsIds: Array<number> = this.countNewImgsIds(firstPhotosContainer.imgsIds, direction, imgsSLUGs.length);          
            this.setState({
                ...this.state,
                firstPhotosContainer: {
                    ...firstPhotosContainer,
                    position: '0'
                },
                secondPhotosContainer: {
                    position: direction === 1 ? '200%' : '-200%',
                    imgsIds: newImgsIds
                }
            })
        }
        else {
            const newImgsIds: Array<number> = this.countNewImgsIds(secondPhotosContainer.imgsIds, direction, imgsSLUGs.length);          
            this.setState({
                ...this.state,
                firstPhotosContainer: {
                    position: direction === 1 ? '200%' : '-200%',
                    imgsIds: newImgsIds
                },
                secondPhotosContainer: {
                    ...secondPhotosContainer,
                    position: '0'
                }
            })
        }
        const PhotosContainerPrev: HTMLElement = document.querySelector('.PhotosContainer.prev');
        PhotosContainerPrev.style.animation = direction === 1 ? 'movingLeftOutside 0.3s ease-in forwards' : 'movingRightOutside 0.3s ease-out forwards';
        Promise.all(
                PhotosContainerPrev.getAnimations().map(animation => {
                        return animation.finished
                })
        )
        .then(result => {
            const PhotosContainerNext: HTMLElement = document.querySelector('.PhotosContainer.next');
            PhotosContainerNext.style.animation = direction === 1 ? 'movingLeftInside 0.3s ease-in forwards' : 'movingRightInside 0.3s ease-out forwards';
            Promise.all(
                    PhotosContainerNext.getAnimations().map(animation => {
                            return animation.finished
                    })
            )
            .then(result => {
                this.setState({
                    ...this.state,
                    activePhotosContainer: !activePhotosContainer,
                })
            })
            // this.props.changeCarouselSize();
            // PhotosContainer.style.marginLeft = direction === 1 ? '200%' : '-200%';
        })
    }

    render() {
        const { activePhotosContainer, firstPhotosContainer, secondPhotosContainer, imgsSLUGs } = this.state;
        return (
            <div className='Carousel'>
                <button
                    className='prevBtn'
                    onClick={event => {
                        event.preventDefault();
                        this.changePhotos(-1);
                        }
                    }
                >Prev</button>
                <PhotosContainer
                    active={activePhotosContainer}
                    position={firstPhotosContainer.position}
                    imgsIds={firstPhotosContainer.imgsIds}
                    imgsSLUGs={imgsSLUGs}
                />
                <PhotosContainer
                    active={!activePhotosContainer}
                    position={secondPhotosContainer.position}
                    imgsIds={secondPhotosContainer.imgsIds}
                    imgsSLUGs={imgsSLUGs}
                />
                <button
                className='nextBtn'
                    onClick={event => {
                        event.preventDefault();
                        this.changePhotos(1);
                        }
                    }
                >Next</button>
            </div>
        );
    }
}

export default Carousel;