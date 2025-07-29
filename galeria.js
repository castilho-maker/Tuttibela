const slides = document.querySelector('.grupo_slides');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentIndex = 0;

function updateSlides() {
    const itensSlides = slides.querySelectorAll('.item_slides');
    // console.log(itensSlides);
    const totalSlides = itensSlides.length;//quantidade de itens do array
    if(currentIndex < 0){
        currentIndex = totalSlides - 1;
    }else if(currentIndex >= totalSlides){
        currentIndex = 0;
    }
itensSlides.forEach((item, index) => {
    // item.style.display = (index ===currentIndex)? 'block':'none';
    item.classList.remove('active');
    if(index === currentIndex){
        item.classList.add('active');
    }
});
}
prev.addEventListener('click', ()=>{
    currentIndex--;
    updateSlides();
})
next.addEventListener('click', () =>{
    currentIndex++;
    updateSlides();
})
updateSlides();

setInterval(()=>{
    updateSlides()
    currentIndex++;
}, 3000);