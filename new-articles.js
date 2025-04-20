var swiper = new Swiper(".blog-slider", {
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  mousewheel: {
    invert: false,
  },
  // autoHeight: true,
  pagination: {
    el: ".blog-slider__pagination",
    clickable: true,
  },
});

// nav-bar hover animation
// const cursor = document.querySelector('.cursor');
// document.addEventListener('mousemove', (e) =>{
//     cursor.style.left = e.pageX + 'px';
//     cursor.style.top = e.pageY + 'px';
// })

// burger toggele button toggeling animation.

const toggelButton = document.getElementsByClassName("toggle-button")[0];
const navebarList = document.getElementsByClassName("nav-bar-list")[0];

toggelButton.addEventListener("click", () => {
  navebarList.classList.toggle("active");
});
