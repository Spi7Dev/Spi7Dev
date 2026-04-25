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
        updateActiveStates();
    }

    function updateActiveStates() {
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle arrow visibility
        leftArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
        rightArrow.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
    }

    leftArrow.addEventListener('click', () => scrollToSlide(currentSlide - 1));
    rightArrow.addEventListener('click', () => scrollToSlide(currentSlide + 1));

    // --- Keyboard Navigation ---
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') scrollToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') scrollToSlide(currentSlide - 1);
    });

    // --- Interaction Observer for Peeking Effect ---
    const observerOptions = {
        root: slider,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const index = Array.from(slides).indexOf(entry.target);
                currentSlide = index;
                updateActiveStates();
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));

    // --- Parallax Effect on Mesh Gradient ---
    const mesh = document.querySelector('.bg-mesh');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        mesh.style.background = `
            radial-gradient(circle at ${x}% ${y}%, rgba(255, 42, 42, 0.15) 0%, transparent 40%),
            radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(255, 42, 42, 0.1) 0%, transparent 40%)
        `;
    });

    // --- Typing Effect Subtitle (Optional) ---
    // Kept for future use if needed, but unobserved for now as badges are static.

    // --- Smooth Navbar Blur ---
    slider.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (slider.scrollLeft > 50) {
            nav.style.transform = 'translateX(-50%) translateY(-10px)';
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        } else {
            nav.style.transform = 'translateX(-50%) translateY(0)';
            nav.style.background = 'rgba(10, 10, 10, 0.6)';
        }
    });

});
