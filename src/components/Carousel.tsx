import React from 'react';
import '../styles/Carousel.less';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PhotosContainer from './PhotosContainer';

interface PhotoObject {
    id: string,
    author: string,
    width: number,
    height: number,
    url: string,
    downloadUrl: string
}

type CarouselStateType = {
    activePhotosContainer: boolean,
    firstPhotosContainer: { position: string, imgsIds: Array<number> },
    secondPhotosContainer: { position: string, imgsIds: Array<number> },
    imgsSLUGs: Array<string>
}

class Carousel extends React.Component<{}, CarouselStateType> {
    
    imgsDimensions: {width: number, height: number}[];
    photoContainerHeightWidthRatio: number;

    constructor(props: {}) {
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

    countNormalizedPhotoContainerDimensions() {
        const imgsDimensSorted: {width: number, height: number}[] = this.imgsDimensions.sort((a, b): number => {
            if(a['width']/a['height'] < b['width']/b['height']) {
                return 1;
            }
            else if(a['width'] / a['height'] > b['width'] / b['height']) {
                return -1;
            }
            return 0;
        })
        const { firstPhotosContainer } = this.state;
        const imgsVisibleNumber = firstPhotosContainer.imgsIds.length;
        const norm3Widest = imgsDimensSorted.slice(0, imgsVisibleNumber).map(i => {
            return { height: imgsDimensSorted[0]['height'], width: (imgsDimensSorted[0]['height']/i['height']) * i['width'] }
        })

        const photoContainerWidth = norm3Widest.reduce((a,b) => a+b['width'], 0);
        const photoContainerHeight = norm3Widest[0]['height'];

        this.photoContainerHeightWidthRatio = photoContainerHeight / photoContainerWidth;
    }

    changeCarouselSize() {
        const app : HTMLElement = document.querySelector('.App');
        const appWidth = app.offsetWidth;
        const containerHeight = this.photoContainerHeightWidthRatio * appWidth;
        document.querySelector('.PhotosContainer.prev').setAttribute("style", `height: ${containerHeight}px`);
        document.querySelector('.PhotosContainer.next').setAttribute("style", `height: ${containerHeight}px; display: none`);
        document.querySelectorAll('.Photo').forEach(photo => {
            photo.setAttribute("style", `max-height: ${containerHeight}px`);
        });
        return app;
    }

    initWindowOnloadHandler() {
        window.addEventListener('load', () => {
            this.countNormalizedPhotoContainerDimensions();
            const app = this.changeCarouselSize();
            app.style.display = "flex";
        })
    }

    initWindowResizeHandler() {
        window.addEventListener('resize', event => {
            event.preventDefault();
            this.changeCarouselSize();
        })
    }

    changeImgsIds(mq: MediaQueryListEvent, visibleImgId: number) {
        if(mq.matches) {
            return { active: [visibleImgId], inactive: [0] }
        }
        else {
            return { active: [visibleImgId, visibleImgId + 1, visibleImgId + 2], inactive: [0, 1, 2] }
        }
    }

    initMobileScreenHandler() {
        const mobileViewPort = window.matchMedia('(max-width: 700px)');
        mobileViewPort.addEventListener("change", mq => {
            const { activePhotosContainer, firstPhotosContainer, secondPhotosContainer } = this.state;
            const visibleImgId = activePhotosContainer ? firstPhotosContainer.imgsIds[0] : secondPhotosContainer.imgsIds[0]
            console.log(activePhotosContainer, firstPhotosContainer, secondPhotosContainer);
            const newImgsIdsArray = this.changeImgsIds(mq, visibleImgId);
            this.setState({
                firstPhotosContainer: {
                    position: '0',
                    imgsIds: activePhotosContainer ? newImgsIdsArray['active'] : newImgsIdsArray['inactive']
                },
                secondPhotosContainer: {
                    position: '0',
                    imgsIds: !activePhotosContainer ? newImgsIdsArray['active'] : newImgsIdsArray['inactive']
                }
            })
            this.countNormalizedPhotoContainerDimensions();
        })
    }

    initWindowListeners() {
        this.initWindowOnloadHandler();
        this.initWindowResizeHandler();
        this.initMobileScreenHandler();
    }

    componentDidMount() {
        fetch('https://picsum.photos/v2/list', {
            method: 'GET'
        })
        .then(response => {
            response.json().then((data: Array<PhotoObject>) => {
                const slugs : Array<string> = [];
                const dimens: {width: number, height: number}[] = [];
                data.forEach((element: PhotoObject) => {
                    const urlAddress = element["url"];
                    const slug = urlAddress.includes('https://unsplash.com/photos/') ? urlAddress.replace('https://unsplash.com/photos/', '') : '';
                    slug && slugs.push(slug);
                    dimens.push({
                        width: Number(element['width']),
                        height: Number(element['height'])
                    })
                    this.imgsDimensions = dimens;
                });
                this.initWindowListeners();
                this.setState({
                    ...this.state,
                    imgsSLUGs: slugs
                })
            });
        })
    }

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
                    position: direction === 1 ? '100%' : '-100%',
                    imgsIds: newImgsIds
                }
            })
        }
        else {
            const newImgsIds: Array<number> = this.countNewImgsIds(secondPhotosContainer.imgsIds, direction, imgsSLUGs.length);          
            this.setState({
                ...this.state,
                firstPhotosContainer: {
                    position: direction === 1 ? '100%' : '-100%',
                    imgsIds: newImgsIds
                },
                secondPhotosContainer: {
                    ...secondPhotosContainer,
                    position: '0'
                }
            })
        }
        const PhotosContainerPrev: HTMLElement = document.querySelector('.PhotosContainer.prev');
        PhotosContainerPrev.style.animation = direction === 1 ? 'movingLeftOutside 0.5s ease-in forwards' : 'movingRightOutside 0.5s ease-out forwards';
        Promise.all(
                PhotosContainerPrev.getAnimations().map(animation => {
                        return animation.finished
                })
        )
        .then(result => {
            const PhotosContainerNext: HTMLElement = document.querySelector('.PhotosContainer.next');
            PhotosContainerNext.style.animation = direction === 1 ? 'movingLeftInside 0.5s ease-in forwards' : 'movingRightInside 0.5s ease-out forwards';
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