import React, { useEffect } from 'react';
import '../styles/App.less';
import Carousel from './Carousel';

function App() {
  function changeCarouselSize() {
    const photos = document.querySelectorAll('.Photo');
    photos.forEach((p : HTMLElement) => {
        p.setAttribute("style", `max-height: none`);
    })
    const PhotosContainer : HTMLElement = document.querySelector('.PhotosContainer');
    const app : HTMLElement = document.querySelector('.App');
    const appWidth = app.offsetWidth;
    // const PhotosContainerWidth = imgsIds.length == 3 ? 3.5 : 1;
    PhotosContainer.setAttribute("style", `width: ${appWidth/3.5}px`);
    const PhotosContainerHeight = PhotosContainer.offsetHeight;
    PhotosContainer.setAttribute("style", `height: ${PhotosContainerHeight}px`);
    photos.forEach(photo => {
        photo.setAttribute("style", `max-height: ${PhotosContainerHeight}px`);
    });

    return app;
}

window.addEventListener('resize', event => {
    event.preventDefault();
    changeCarouselSize();
})

  window.addEventListener('load', () => {
    const app = changeCarouselSize();
    app.style.display = "flex";
  })

  return (
    <div className="App">
      <Carousel changeCarouselSize={changeCarouselSize}/>
    </div>
  );
}

export default App;
