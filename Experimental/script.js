// Create transition overlay if it doesn't exist
function createTransitionOverlay() {
    let overlay = document.getElementById('transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            transform: translateY(100%) scale(1);
            opacity: 0;
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}

// Handle page entry animation
window.addEventListener('DOMContentLoaded', () => {
    const pageElement = document.querySelector('.page');
    const transitionData = sessionStorage.getItem('pageTransition');
    
    if (pageElement && transitionData) {
        // Parse transition data
        const data = JSON.parse(transitionData);
        sessionStorage.removeItem('pageTransition');
        
        // Create overlay with old page appearance
        const overlay = createTransitionOverlay();
        overlay.style.background = data.background;
        overlay.style.transform = 'translateY(0) scale(1)';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'none';
        
        // Start new page hidden at bottom
        pageElement.style.transition = 'none';
        pageElement.style.transform = 'translateY(100%) scale(1)';
        pageElement.style.opacity = '0';
        pageElement.style.pointerEvents = 'none';
        
        // Force reflow
        void pageElement.offsetHeight;
        
        // Re-enable transitions
        pageElement.style.transition = '';
        
        // Animate both simultaneously
        requestAnimationFrame(() => {
            // Old page overlay exits (fade out, scale down, move up)
            overlay.style.transition = 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
            overlay.style.transform = 'translateY(-30%) scale(0.95)';
            overlay.style.opacity = '0';
            
            // New page enters (slide up and fade in)
            pageElement.style.transform = 'translateY(0) scale(1)';
            pageElement.style.opacity = '1';
            pageElement.style.pointerEvents = 'auto';
            
            // Clean up overlay after animation
            setTimeout(() => {
                overlay.remove();
            }, 850);
        });
    }
});

// Wait for nav to load
setTimeout(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetUrl = link.getAttribute('href');
            const pageElement = document.querySelector('.page');
            
            if (!pageElement) {
                window.location.href = targetUrl;
                return;
            }
            
            // Get current page background color
            const bgColor = window.getComputedStyle(pageElement).backgroundColor;
            
            // Store transition data
            sessionStorage.setItem('pageTransition', JSON.stringify({
                background: bgColor
            }));
            
            // Exit animation for current page
            pageElement.style.transition = 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
            pageElement.style.transform = 'translateY(-30%) scale(0.95)';
            pageElement.style.opacity = '0';
            
            // Navigate after animation starts (not completes)
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); // Navigate halfway through animation
        });
    });
}, 200);