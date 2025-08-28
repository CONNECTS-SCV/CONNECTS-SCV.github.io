// Enhanced DNA Helix Sidebar Toggle
console.log('[DNA Toggle] Initializing enhanced version...');

window.addEventListener('load', function() {
    console.log('[DNA Toggle] Page loaded, creating enhanced button...');
    
    // Check if button already exists
    if (document.querySelector('.sidebar-toggle')) {
        console.log('[DNA Toggle] Button already exists');
        return;
    }
    
    // Check if we're on mobile where sidebar doesn't exist
    const drawer = document.querySelector('hy-drawer');
    if (!drawer) {
        console.log('[DNA Toggle] No drawer found, likely mobile view - skipping button creation');
        return;
    }
    
    // Create the enhanced DNA helix toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle sidebar');
    toggleButton.setAttribute('title', 'Toggle sidebar (Ctrl+B)');
    
    // Enhanced inline styles with glassmorphism effect
    toggleButton.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 20px !important;
        transform: translateY(-50%) !important;
        width: 48px !important;
        height: 48px !important;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 2px solid rgba(255, 255, 255, 0.18) !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        overflow: visible !important;
    `;
    
    // Enhanced DNA helix SVG with glow effects
    toggleButton.innerHTML = `
        <svg viewBox="0 0 30 40" width="28" height="36" style="filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));">
            <defs>
                <linearGradient id="dna-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="dna-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g class="dna-helix" style="transform-origin: 15px 20px; animation: dna-rotate 4s linear infinite;">
                <!-- Left helix strand -->
                <path d="M 8 0 Q 11 10, 8 20 Q 5 30, 8 40" 
                      stroke="url(#dna-grad1)" stroke-width="2.5" fill="none" 
                      stroke-linecap="round" opacity="0.95"/>
                <!-- Right helix strand -->
                <path d="M 22 0 Q 19 10, 22 20 Q 25 30, 22 40" 
                      stroke="url(#dna-grad1)" stroke-width="2.5" fill="none" 
                      stroke-linecap="round" opacity="0.95"/>
                <!-- Base pairs with animation -->
                <g class="base-pairs" filter="url(#glow)">
                    <line x1="8" y1="4" x2="22" y2="4" stroke="#fbbf24" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out infinite"/>
                    <line x1="9" y1="8" x2="21" y2="8" stroke="#a78bfa" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 0.3s infinite"/>
                    <line x1="9" y1="12" x2="21" y2="12" stroke="#60a5fa" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 0.6s infinite"/>
                    <line x1="8" y1="16" x2="22" y2="16" stroke="#34d399" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 0.9s infinite"/>
                    <line x1="8" y1="20" x2="22" y2="20" stroke="#fbbf24" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 1.2s infinite"/>
                    <line x1="9" y1="24" x2="21" y2="24" stroke="#a78bfa" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 1.5s infinite"/>
                    <line x1="9" y1="28" x2="21" y2="28" stroke="#60a5fa" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 1.8s infinite"/>
                    <line x1="8" y1="32" x2="22" y2="32" stroke="#34d399" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 2.1s infinite"/>
                    <line x1="8" y1="36" x2="22" y2="36" stroke="#fbbf24" stroke-width="1.5" opacity="0.9" 
                          style="animation: pulse 2s ease-in-out 2.4s infinite"/>
                </g>
            </g>
        </svg>
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dna-rotate {
            from { transform: rotateY(0deg) rotateX(5deg); }
            to { transform: rotateY(360deg) rotateX(5deg); }
        }
        @keyframes pulse {
            0%, 100% { 
                opacity: 0.4; 
                transform: scaleX(0.8);
            }
            50% { 
                opacity: 1; 
                transform: scaleX(1.1);
            }
        }
        .sidebar-toggle {
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(-50%); }
            50% { transform: translateY(calc(-50% - 3px)); }
        }
        .sidebar-toggle:hover {
            transform: translateY(-50%) scale(1.08) !important;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
            background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%) !important;
        }
        .sidebar-toggle:active {
            transform: translateY(-50%) scale(0.95) !important;
        }
        
        /* Hide button below 1024px where Hydejack doesn't show sidebar */
        @media (max-width: 1023px) {
            .sidebar-toggle {
                display: none !important;
            }
        }
        
        /* Pulse effect on first load */
        @keyframes intro-pulse {
            0% { 
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35),
                           inset 0 1px 0 rgba(255, 255, 255, 0.2),
                           0 0 0 0 rgba(102, 126, 234, 0.7);
            }
            70% { 
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35),
                           inset 0 1px 0 rgba(255, 255, 255, 0.2),
                           0 0 0 20px rgba(102, 126, 234, 0);
            }
            100% { 
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35),
                           inset 0 1px 0 rgba(255, 255, 255, 0.2),
                           0 0 0 0 rgba(102, 126, 234, 0);
            }
        }
        .sidebar-toggle.intro {
            animation: intro-pulse 1.5s ease-out, float 3s ease-in-out infinite 1.5s;
        }
        
        /* Smooth transition for sidebar */
        hy-drawer {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        main, hy-push-state {
            transition: margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Styles for hidden sidebar state */
        body.sidebar-hidden hy-drawer {
            transform: translateX(-100%) !important;
            pointer-events: none !important;
        }
        body.sidebar-hidden main,
        body.sidebar-hidden hy-push-state {
            margin-left: 0 !important;
        }
        
        /* Smooth width transition for content */
        .content {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add intro animation class
    toggleButton.classList.add('intro');
    setTimeout(() => toggleButton.classList.remove('intro'), 1500);
    
    // Append button to body
    document.body.appendChild(toggleButton);
    console.log('[DNA Toggle] Enhanced button added to page');
    
    // Restore saved state and set initial button position with z-index
    const savedState = localStorage.getItem('sidebarHidden') === 'true';
    if (savedState) {
        document.body.classList.add('sidebar-hidden');
        toggleButton.style.left = '20px'; // Button on left when sidebar is hidden
        toggleButton.style.zIndex = '99999'; // High z-index when sidebar is hidden
    } else {
        toggleButton.style.left = '220px'; // Button position when sidebar is visible
        toggleButton.style.zIndex = '999'; // Low z-index to stay behind sidebar
    }
    
    // Handle toggle with smooth animation
    toggleButton.addEventListener('click', function() {
        console.log('[DNA Toggle] Toggling sidebar');
        
        // Add smooth rotation to button icon during toggle
        const svg = this.querySelector('svg .dna-helix');
        if (svg) {
            svg.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            svg.style.transform = 'rotateY(720deg)';
            setTimeout(() => {
                svg.style.transition = '';
                svg.style.transform = '';
            }, 500);
        }
        
        const drawer = document.querySelector('hy-drawer');
        const main = document.querySelector('main');
        const pushState = document.querySelector('hy-push-state');
        const isHidden = document.body.classList.contains('sidebar-hidden');
        
        // Add transitioning class for smoother animation
        document.body.style.overflow = 'hidden';
        
        if (!isHidden) {
            // Hide sidebar with smooth animation
            document.body.classList.add('sidebar-hidden');
            
            // Move button to left edge when sidebar is hidden and restore z-index
            this.style.left = '20px';
            this.style.zIndex = '99999'; // High z-index when sidebar is hidden
            
            // Animate drawer
            if (drawer) {
                drawer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                drawer.style.transform = 'translateX(-100%)';
            }
            
            // Animate content area
            if (main) {
                main.style.transition = 'margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                main.style.marginLeft = '0';
            }
            if (pushState) {
                pushState.style.transition = 'margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                pushState.style.marginLeft = '0';
            }
            
            localStorage.setItem('sidebarHidden', 'true');
        } else {
            // Show sidebar with smooth animation
            document.body.classList.remove('sidebar-hidden');
            
            // Move button behind sidebar and lower z-index to avoid dropdown conflict
            this.style.left = '220px'; // Position under sidebar
            this.style.zIndex = '999'; // Lower than sidebar (drawer usually has z-index 1000+)
            
            // Animate drawer
            if (drawer) {
                drawer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                drawer.style.transform = 'translateX(0)';
            }
            
            // Animate content area
            if (main) {
                main.style.transition = 'margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                main.style.marginLeft = '';
            }
            if (pushState) {
                pushState.style.transition = 'margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                pushState.style.marginLeft = '';
            }
            
            localStorage.setItem('sidebarHidden', 'false');
        }
        
        // Re-enable scrolling after animation
        setTimeout(() => {
            document.body.style.overflow = '';
            window.dispatchEvent(new Event('resize'));
        }, 500);
    });
    
    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleButton.click();
        }
    });
    
    // Check if sidebar is actually functional
    function checkSidebarFunctionality() {
        const width = window.innerWidth;
        const drawer = document.querySelector('hy-drawer');
        
        // Simple check: Hydejack shows sidebar at 1024px and above
        if (width < 1024) {
            // Force hide with !important to override inline styles
            toggleButton.style.setProperty('display', 'none', 'important');
            console.log('[DNA Toggle] Below 1024px threshold - width:', width, '- button hidden');
            return;
        }
        
        if (!drawer) {
            toggleButton.style.setProperty('display', 'none', 'important');
            console.log('[DNA Toggle] No drawer found - button hidden');
            return;
        }
        
        // For 1024px and above, show the button
        toggleButton.style.setProperty('display', 'flex', 'important');
        console.log('[DNA Toggle] Above 1024px threshold - width:', width, '- button shown');
    }
    
    // Check on resize with minimal debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Immediate check for critical threshold
        const width = window.innerWidth;
        if (width < 1024) {
            // Immediately hide if below threshold
            toggleButton.style.setProperty('display', 'none', 'important');
        }
        
        // Debounced full check
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkSidebarFunctionality, 50);
    });
    
    // Initial check
    checkSidebarFunctionality();
    
    // Also check after a delay to ensure Hydejack has initialized
    setTimeout(checkSidebarFunctionality, 1000);
    
    console.log('[DNA Toggle] Setup complete with enhanced features');
});