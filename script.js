const container = document.querySelector('.snap-container');
const sections = document.querySelectorAll('.snap-section');
const nextBtn = document.getElementById('nextSection');
const prevBtn = document.getElementById('prevSection');

let currentIndex = 0;

const updateScroll = (index) => {
    sections[index].scrollIntoView({ behavior: 'smooth' });
};

nextBtn.addEventListener('click', () => {
    if (currentIndex < sections.length - 1) {
        currentIndex++;
        updateScroll(currentIndex);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateScroll(currentIndex);
    }
});

// Update index based on manual scroll
container.addEventListener('scroll', () => {
    const scrollPos = container.scrollTop;
    const windowHeight = window.innerHeight;
    currentIndex = Math.round(scrollPos / windowHeight);
});
