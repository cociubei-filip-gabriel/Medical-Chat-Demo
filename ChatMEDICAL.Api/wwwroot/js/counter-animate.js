document.addEventListener("DOMContentLoaded", () => {
    const stats = document.querySelectorAll(".stat-number");
    
    const animateCounter = (el) => {
        const target = +el.getAttribute("data-target");
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();
        
        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quad
            const ease = progress * (2 - progress);
            const value = Math.floor(ease * target);
            
            if (target === 98) {
                el.innerText = value + "%";
            } else {
                el.innerText = value.toLocaleString() + "+";
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target === 98) {
                    el.innerText = target + "%";
                } else {
                    el.innerText = target.toLocaleString() + "+";
                }
            }
        };
        
        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    stats.forEach(stat => {
        observer.observe(stat);
    });
});
