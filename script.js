document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    const installBtns = document.querySelectorAll('.install-btn');

    // --- Browser Detection ---
    function updateInstallButtons() {
        const userAgent = navigator.userAgent;
        let browserName = "Browser";

        if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("Brave") === -1) {
            browserName = "Chrome";
        } else if (userAgent.indexOf("Edg") > -1) {
            browserName = "Edge";
        } else if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Firefox";
        } else if (userAgent.indexOf("Brave") > -1) {
            browserName = "Brave";
        }

        installBtns.forEach(btn => {
            const btnText = btn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = `Download for ${browserName}`;
            }
        });
    }

    updateInstallButtons();

    // --- Horizontal Slider Logic ---
    let currentSlide = 0;

    function scrollToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        slides[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        currentSlide = index;
        updateActiveStates(index);
    }

    function updateActiveStates(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Soften arrow visibility
        leftArrow.style.opacity = index === 0 ? '0.2' : '1';
        rightArrow.style.opacity = index === slides.length - 1 ? '0.2' : '1';
    }

    leftArrow.addEventListener('click', () => scrollToSlide(currentSlide - 1));
    rightArrow.addEventListener('click', () => scrollToSlide(currentSlide + 1));

    // --- Keyboard Navigation ---
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') scrollToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') scrollToSlide(currentSlide - 1);
    });

    // --- Intersection Observer for Active Slide State ---
    const observerOptions = {
        root: slider,
        threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                currentSlide = index;
                updateActiveStates(index);
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));

    // --- Parallax Mesh Gradient ---
    const mesh = document.querySelector('.bg-mesh');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        mesh.style.background = `
            radial-gradient(circle at ${x}% ${y}%, rgba(255, 42, 42, 0.1) 0%, transparent 40%),
            radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(255, 42, 42, 0.05) 0%, transparent 40%)
        `;
    });

    // --- Scroll Lock on Slider (Prevent vertical while horizontal) ---
    slider.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            // Natural horizontal scroll handled by browser
        } else {
            // If user scrolls vertically, we could translate it to horizontal if desired
            // But snap-scroll handles basic behavior well
        }
    });

});
