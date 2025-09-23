// Enhanced Sidebar Toggle Button
console.log('[Sidebar Toggle] Initializing...');

window.addEventListener('load', function() {
    console.log('[Sidebar Toggle] Page loaded, creating button...');
    
    // Check if button already exists
    if (document.querySelector('.sidebar-toggle')) {
        console.log('[Sidebar Toggle] Button already exists');
        return;
    }
    
    // Check if drawer exists
    const drawer = document.querySelector('hy-drawer');
    if (!drawer) {
        console.log('[Sidebar Toggle] No drawer found - skipping button creation');
        return;
    }
    
    // Create the floating action button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle sidebar');
    toggleButton.setAttribute('title', '메뉴 열기/닫기 (단축키: Ctrl+B 또는 ⌘+B)');
    
    // Floating action button style - modern glassmorphism design
    toggleButton.style.cssText = `
        position: fixed !important;
        bottom: 32px !important;
        right: 48px !important;
        width: 52px !important;
        height: 52px !important;
        background: rgba(255, 255, 255, 0.92) !important;
        backdrop-filter: blur(10px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(10px) saturate(180%) !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
        border-radius: 16px !important;
        cursor: pointer !important;
        z-index: 10000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
                    0 4px 12px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        overflow: visible !important;
    `;
    
    // Modern menu icon with gradient
    toggleButton.innerHTML = `
        <div class="menu-icon-wrapper" style="
            width: 24px;
            height: 24px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        ">
            <svg viewBox="0 0 24 24" width="24" height="24" class="menu-icon">
                <defs>
                    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <g class="menu-bars" style="transform-origin: center;">
                    <rect class="bar-top" x="3" y="5" width="18" height="2" rx="1"
                          fill="url(#iconGradient)"
                          style="transform-origin: center; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"/>
                    <rect class="bar-middle" x="3" y="11" width="18" height="2" rx="1"
                          fill="url(#iconGradient)"
                          style="transform-origin: center; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); opacity: 1;"/>
                    <rect class="bar-bottom" x="3" y="17" width="18" height="2" rx="1"
                          fill="url(#iconGradient)"
                          style="transform-origin: center; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"/>
                </g>
            </svg>
        </div>
    `;
    
    // Add CSS animations and styles
    const style = document.createElement('style');
    style.textContent = `
        /* Sidebar toggle button animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; }
        }
        
        .sidebar-toggle {
            animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .sidebar-toggle:hover {
            transform: translateY(-2px) scale(1.02) !important;
            box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2),
                        0 8px 24px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
            background: rgba(255, 255, 255, 0.98) !important;
        }
        
        .sidebar-toggle:active {
            transform: translateY(0) scale(0.98) !important;
            box-shadow: 0 4px 12px rgba(31, 38, 135, 0.12),
                        0 2px 4px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
        }
        
        /* Pulse animation for attention - more subtle */
        @keyframes buttonPulse {
            0% {
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
                            0 4px 12px rgba(0, 0, 0, 0.08),
                            inset 0 1px 0 rgba(255, 255, 255, 0.6),
                            0 0 0 0 rgba(102, 126, 234, 0.3);
            }
            50% {
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
                            0 4px 12px rgba(0, 0, 0, 0.08),
                            inset 0 1px 0 rgba(255, 255, 255, 0.6),
                            0 0 0 12px rgba(102, 126, 234, 0);
            }
            100% {
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
                            0 4px 12px rgba(0, 0, 0, 0.08),
                            inset 0 1px 0 rgba(255, 255, 255, 0.6),
                            0 0 0 0 rgba(102, 126, 234, 0);
            }
        }
        
        .sidebar-toggle.pulse {
            animation: buttonPulse 2.5s ease-out infinite;
        }
        
        /* Transform menu icon to X when sidebar is hidden */
        body.sidebar-hidden .sidebar-toggle .bar-top {
            transform: rotate(45deg) translateY(6px) !important;
            width: 20px !important;
        }
        
        body.sidebar-hidden .sidebar-toggle .bar-middle {
            opacity: 0 !important;
            transform: scaleX(0) !important;
        }
        
        body.sidebar-hidden .sidebar-toggle .bar-bottom {
            transform: rotate(-45deg) translateY(-6px) !important;
            width: 20px !important;
        }
        
        /* Subtle visual change when sidebar is hidden */
        body.sidebar-hidden .sidebar-toggle {
            background: rgba(255, 255, 255, 0.95) !important;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2),
                        0 4px 12px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
        }
        
        body.sidebar-hidden .sidebar-toggle svg stop:first-child {
            stop-color: #f093fb !important;
        }
        
        body.sidebar-hidden .sidebar-toggle svg stop:last-child {
            stop-color: #f5576c !important;
        }
        
        /* Always show button */
        .sidebar-toggle {
            display: flex !important;
        }
        
        /* Adjust button position on medium screens to avoid content overlap */
        @media (min-width: 1024px) and (max-width: 1400px) {
            .sidebar-toggle {
                bottom: 24px !important;
                right: 36px !important;
                width: 48px !important;
                height: 48px !important;
                border-radius: 14px !important;
            }
            
            .sidebar-toggle svg {
                width: 22px !important;
                height: 22px !important;
            }
        }
        
        /* Ensure button doesn't overlap with content */
        @media (min-width: 1024px) {
            main {
                padding-bottom: 100px !important;
            }
        }
        
        /* Sidebar and content transitions */
        hy-drawer {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        main, hy-push-state {
            transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        body.sidebar-hidden hy-drawer {
            transform: translateX(-100%) !important;
            pointer-events: none !important;
        }
        
        body.sidebar-hidden main,
        body.sidebar-hidden hy-push-state {
            margin-left: 0 !important;
        }
        
        /* Tooltip styles */
        .sidebar-tooltip {
            position: fixed;
            bottom: 96px;
            right: 48px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.3s ease;
        }
        
        @media (min-width: 1024px) and (max-width: 1400px) {
            .sidebar-tooltip {
                bottom: 80px;
                right: 36px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Append button to body
    document.body.appendChild(toggleButton);
    console.log('[Sidebar Toggle] Button added to page');
    
    // Restore saved state
    const savedState = localStorage.getItem('sidebarHidden') === 'true';
    if (savedState) {
        document.body.classList.add('sidebar-hidden');
        const drawer = document.querySelector('hy-drawer');
        if (drawer) {
            drawer.style.transform = 'translateX(-100%)';
        }
        const main = document.querySelector('main');
        const pushState = document.querySelector('hy-push-state');
        if (main) main.style.marginLeft = '0';
        if (pushState) pushState.style.marginLeft = '0';
    }
    
    // Add tooltip on first visit
    const hasSeenTooltip = localStorage.getItem('hasSeenSidebarTooltip');
    if (!hasSeenTooltip) {
        const tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.textContent = '클릭하여 메뉴를 열거나 닫을 수 있습니다';
        document.body.appendChild(tooltip);
        
        // Add pulse animation to draw attention
        toggleButton.classList.add('pulse');
        
        setTimeout(() => {
            tooltip.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                tooltip.remove();
                toggleButton.classList.remove('pulse');
            }, 300);
            localStorage.setItem('hasSeenSidebarTooltip', 'true');
        }, 4000);
    }
    
    // Handle toggle button click
    toggleButton.addEventListener('click', function() {
        console.log('[Sidebar Toggle] Toggling sidebar');
        
        // Visual feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
        
        const drawer = document.querySelector('hy-drawer');
        const main = document.querySelector('main');
        const pushState = document.querySelector('hy-push-state');
        const isHidden = document.body.classList.contains('sidebar-hidden');
        
        if (!isHidden) {
            // Hide sidebar
            document.body.classList.add('sidebar-hidden');
            
            if (drawer) {
                drawer.style.transform = 'translateX(-100%)';
            }
            if (main) {
                main.style.marginLeft = '0';
            }
            if (pushState) {
                pushState.style.marginLeft = '0';
            }
            
            localStorage.setItem('sidebarHidden', 'true');
        } else {
            // Show sidebar
            document.body.classList.remove('sidebar-hidden');
            
            if (drawer) {
                drawer.style.transform = 'translateX(0)';
            }
            if (main) {
                main.style.marginLeft = '';
            }
            if (pushState) {
                pushState.style.marginLeft = '';
            }
            
            localStorage.setItem('sidebarHidden', 'false');
        }
        
        // Trigger resize event for layout adjustment
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 400);
    });
    
    // Keyboard shortcut (Ctrl+B or Cmd+B)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleButton.click();
        }
    });
    
    // Handle dropdown menus
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parentItem = this.closest('.sidebar-nav-item');
            const isOpen = parentItem.classList.contains('open');
            
            // Close all other dropdowns
            document.querySelectorAll('.sidebar-nav-item.open').forEach(function(item) {
                if (item !== parentItem) {
                    item.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            if (isOpen) {
                parentItem.classList.remove('open');
            } else {
                parentItem.classList.add('open');
            }
        });
    });
    
    // Check visibility on resize
    function checkVisibility() {
        const width = window.innerWidth;
        const drawer = document.querySelector('hy-drawer');
        
        if (!drawer || width < 1024) {
            toggleButton.style.display = 'none';
        } else {
            toggleButton.style.display = 'flex';
        }
    }
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkVisibility, 100);
    });
    
    // Initial visibility check
    checkVisibility();
    
    console.log('[Sidebar Toggle] Setup complete');
});