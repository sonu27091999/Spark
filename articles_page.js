console.clear();

const articles = document.querySelector(".articles");

Array.from(document.querySelectorAll(".article"), (article, i) => {
  article.addEventListener("click", () => {
    articles.classList.toggle("full");
    article.classList.toggle("full");
  });
});

// nav-bar hover animation
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) =>{
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
})

// burger toggele button toggeling animation.

const toggelButton = document.getElementsByClassName('toggle-button')[0];
const navebarList= document.getElementsByClassName('nav-bar-list')[0]

toggelButton.addEventListener('click', () => {
    navebarList.classList.toggle('active')
})