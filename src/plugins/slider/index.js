import "./index.scss";

/* eslint func-names: ["error", "never"] */
(function () {
  function sliderEnhancer(slider) {
    let slideIndex = 1;
    const { autoStart } = slider.dataset;
    const interval = slider.dataset.interval ? slider.dataset.interval * 1000 : 4000;
    const btnPrev = slider.querySelector(".plugin-slider-prev");
    const btnNext = slider.querySelector(".plugin-slider-next");

    function showSlides(n) {
      const slides = Array.from(slider.getElementsByClassName("plugin-slider-item"));
      console.log("slides: ", slides);

      if (n > slides.length) {
        slideIndex = 1;
      }

      if (n < 1) {
        slideIndex = slides.length;
      }

      slides.forEach((slide) => {
        const slideItem = slide;
        slideItem.style.display = "none";
      });

      slides[slideIndex - 1].style.display = "block";
    }

    if (autoStart) {
      setInterval(() => {
        showSlides((slideIndex += 1));
      }, interval);
    }

    function nextSlide() {
      showSlides((slideIndex += 1));
    }

    function previousSlide() {
      showSlides((slideIndex -= 1));
    }

    btnPrev.addEventListener("click", previousSlide);
    btnNext.addEventListener("click", nextSlide);
  }

  function init() {
    const sliderElems = document.querySelectorAll(".plugin-slider");
    sliderElems.forEach((slider) => {
      sliderEnhancer(slider);
    });
  }

  window.addEventListener("load", init);
})();
