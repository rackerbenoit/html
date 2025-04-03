// Use performance optimization techniques
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for better performance
    const currentYearEl = document.getElementById('current-year');
    const heroBackground = document.querySelector('.hero-background');
    const bars = document.querySelectorAll('.bar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.querySelector('body');
    
    // Set current year in footer
    currentYearEl.textContent = new Date().getFullYear();
    
    // Smooth scrolling for navigation links - use event delegation for better performance
    document.querySelector('.main-nav').addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Use requestAnimationFrame for smoother animations
    let ticking = false;
    
    // Optimize scroll event handling with requestAnimationFrame
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                
                // Parallax effect for background
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
                }
                
                // Animate bars on scroll
                if (scrollPosition < 500) {
                    const scrollRatio = 1 - (scrollPosition / 500);
                    const heights = [70, 100, 80, 40]; // Pre-define heights for better performance
                    
                    bars.forEach((bar, index) => {
                        bar.style.height = `${heights[index] * scrollRatio}%`;
                    });
                }
                
                // Update active nav links
                updateActiveNavLinks(scrollPosition);
                
                // Update scroll-to-top button visibility
                updateScrollTopButton(scrollPosition);
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Function to update active nav links - extracted for better organization
    function updateActiveNavLinks(scrollPosition) {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
    // Function to update scroll-to-top button visibility
    function updateScrollTopButton(scrollPosition) {
        if (scrollTopBtn) {
            scrollTopBtn.style.display = scrollPosition > 300 ? 'block' : 'none';
        }
    }
    
    // Add CSS for active nav links
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            background-color: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.6);
        }
    `;
    document.head.appendChild(style);
    
    // Add animation for skills section
    const skillItems = document.querySelectorAll('.skill-list li');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to animate skills when they come into view
    function animateSkillsOnScroll() {
        skillItems.forEach((item, index) => {
            if (isInViewport(item) && !item.classList.contains('animated')) {
                // Add animated class to prevent re-animation
                item.classList.add('animated');
                
                // Set animation with delay based on index
                item.style.animation = `fadeInRight 0.5s ease-out ${index * 0.1}s forwards`;
                item.style.opacity = '0';
            }
        });
    }
    
    // Add animation keyframes
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .skill-list li {
            opacity: 0;
        }
        
        .skill-list li.animated {
            opacity: 1;
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Run animation check on scroll and on page load
    window.addEventListener('scroll', animateSkillsOnScroll);
    window.addEventListener('load', animateSkillsOnScroll);
    document.head.appendChild(style);
    
    // Create scroll-to-top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '&uarr;';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #2b20a3;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        opacity: 0.8;
        transition: all 0.3s ease;
    `;
    
    scrollTopBtn.addEventListener('mouseover', function() {
        this.style.opacity = '1';
        this.style.transform = 'translateY(-3px)';
    });
    
    scrollTopBtn.addEventListener('mouseout', function() {
        this.style.opacity = '0.8';
        this.style.transform = 'translateY(0)';
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    body.appendChild(scrollTopBtn);
    
    // Initial calls to set up the page
    updateActiveNavLinks(window.scrollY);
    updateScrollTopButton(window.scrollY);
});
