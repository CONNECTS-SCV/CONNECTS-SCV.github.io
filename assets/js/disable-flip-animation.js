// Disable FLIP animations for Related Posts
document.addEventListener('DOMContentLoaded', function() {
  // Remove flip-title class from related posts links
  const relatedPostLinks = document.querySelectorAll('.related-posts .flip-title');
  relatedPostLinks.forEach(link => {
    link.classList.remove('flip-title');
    link.removeAttribute('data-flip');
  });
  
  // Override getFlipType for related posts
  if (window.getFlipType) {
    const originalGetFlipType = window.getFlipType;
    window.getFlipType = function(el) {
      // Check if element is within related posts
      if (el && el.closest && el.closest('.related-posts')) {
        return null; // Return null to prevent FLIP animation
      }
      return originalGetFlipType(el);
    };
  }
  
  // Prevent animations on navigation
  document.addEventListener('hy-push-state-start', function(e) {
    if (e.detail && e.detail.anchor) {
      const anchor = e.detail.anchor;
      if (anchor.closest('.related-posts')) {
        // Disable animation for this navigation
        if (e.detail.opts) {
          e.detail.opts.animate = false;
        }
      }
    }
  });
});