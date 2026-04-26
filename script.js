document.addEventListener('DOMContentLoaded', () => {
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
            if (btnText && btnText.textContent.trim() !== "Coming Soon") {
                btnText.textContent = `Download for ${browserName}`;
            }
        });
    }

    updateInstallButtons();

    // --- Scroll Reveal Logic ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.v-section, .product-card, .feature-card, .pricing-card');
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        revealObserver.observe(el);
    });

    // --- Horizontal Scroll Logic ---
    const horizontalTrigger = document.getElementById('horizontal-trigger');
    const panelTrack = document.getElementById('panel-track');
    const panels = document.querySelectorAll('.panel');

    if (horizontalTrigger && panelTrack && panels.length > 0) {
        // Set dynamic height for the scroll trigger
        // This allows the user to scroll vertically while the panels move horizontally
        const updateContainerHeight = () => {
            const trackWidth = panelTrack.scrollWidth;
            const viewportWidth = window.innerWidth;
            const horizontalScrollLength = trackWidth - viewportWidth;
            
            // The height of the container will be the viewport height + the horizontal distance to travel
            horizontalTrigger.style.height = `${horizontalScrollLength + window.innerHeight}px`;
        };

        window.addEventListener('resize', updateContainerHeight);
        updateContainerHeight();

        // Handle the scroll and translate the track
        window.addEventListener('scroll', () => {
            const offsetTop = horizontalTrigger.offsetTop;
            const scrollTop = window.pageYOffset;
            const scrollDistance = scrollTop - offsetTop;
            
            if (scrollDistance >= 0 && scrollDistance <= (horizontalTrigger.offsetHeight - window.innerHeight)) {
                panelTrack.style.transform = `translateX(-${scrollDistance}px)`;
            } else if (scrollDistance < 0) {
                panelTrack.style.transform = `translateX(0px)`;
            }
        });
    }

    // --- Parallax Mesh Gradient ---
    const mesh = document.querySelector('.bg-mesh');
    if (mesh) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            mesh.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(255, 42, 42, 0.1) 0%, transparent 40%),
                radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(255, 42, 42, 0.05) 0%, transparent 40%)
            `;
        });
    }
});
