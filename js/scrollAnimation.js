// Scroll animation for welcome panel
document.addEventListener('scroll', () => {
    const welcomePanel = document.getElementById('welcome-panel');
    const scrollY = window.scrollY;
    
    // Move the panel up as user scrolls (parallax effect)
    // Adjust the multiplier (0.5) for faster/slower movement
    welcomePanel.style.transform = `translateY(${scrollY * 0.5}px)`;
    
    // Optional: fade out the panel as you scroll
    const maxScroll = 2.0 * (window.innerHeight / 3.0); // Adjust this to control fade distance
    const opacity = Math.max(0, 1 - (scrollY / maxScroll));
    welcomePanel.style.opacity = opacity;
    
    // Hide panel completely when scrolled enough
    if (scrollY > 800) {
        welcomePanel.style.pointerEvents = 'none';
    } else {
        welcomePanel.style.pointerEvents = 'auto';
    }
});
