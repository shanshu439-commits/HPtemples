let slideIndex = 0;
const slides = document.querySelector(".slides");
const totalSlides = document.querySelectorAll(".slide").length;

document.querySelector(".next").onclick = function(){
    slideIndex++;
    if(slideIndex >= totalSlides){
        slideIndex = 0;
    }
    updateSlide();
}

document.querySelector(".prev").onclick = function(){
    slideIndex--;
    if(slideIndex < 0){
        slideIndex = totalSlides - 1;
    }
    updateSlide();
}

function updateSlide(){
    slides.style.transform = "translateX(-" + slideIndex * 100 + "%)";
}

setInterval(function(){
    slideIndex++;
    if(slideIndex >= totalSlides){
        slideIndex = 0;
    }
    updateSlide();
}, 4000);
