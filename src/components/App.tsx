import React, { useEffect } from 'react';
import '../styles/App.less';
import Carousel from './Carousel';

function App() {
  function changeCarouselSize() {
    const photos = document.querySelectorAll('.Photo');
    photos.forEach((p : HTMLElement) => {
      p.setAttribute("style", `max-height: none`);
    })
    const slider : HTMLElement = document.querySelector('.Slider');
    const app : HTMLElement = document.querySelector('.App');
    const appWidth = app.offsetWidth;
    slider.setAttribute("style", `width: ${appWidth/3.5}px`);
    const sliderHeight = slider.offsetHeight;
    slider.setAttribute("style", `height: ${sliderHeight + 20}px`);
    photos.forEach(photo => {
      photo.setAttribute("style", `max-height: ${sliderHeight}px`);
    });
  }

  window.addEventListener('load', () => {
    changeCarouselSize();
  })

  window.addEventListener('resize', event => {
    event.preventDefault();
    changeCarouselSize();
  })

  return (
    <div className="App">
      <Carousel />
    </div>
  );
}

export default App;
