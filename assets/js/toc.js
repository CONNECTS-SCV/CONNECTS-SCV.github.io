// Table of Contents (TOC) JavaScript for Jekyll Posts
(function() {
  'use strict';
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    initTOC();
  }
  
  function initTOC() {
    // Check if we're on a post page with TOC enabled
    const tocNav = document.getElementById('toc-nav');
    const mobileTocNav = document.getElementById('mobile-toc-nav');
    
    if (!tocNav && !mobileTocNav) {
      return; // No TOC elements found, exit
    }
    
    const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');
    
    // Generate TOC
    if (headings.length > 0) {
      generateTOC(headings, tocNav, mobileTocNav);
      setupScrollHighlight(headings);
      setupProgressRing();
      setupTOCToggle();
      setupSmoothScroll();
    }
  }
  
  function generateTOC(headings, tocNav, mobileTocNav) {
    const tocList = document.createElement('ul');
    let currentH2List = null;
    let currentH3List = null;
    
    headings.forEach(function(heading) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      li.appendChild(a);
      
      if (heading.tagName === 'H2') {
        tocList.appendChild(li);
        currentH2List = document.createElement('ul');
        li.appendChild(currentH2List);
        currentH3List = null;
      } else if (heading.tagName === 'H3') {
        if (currentH2List) {
          currentH2List.appendChild(li);
          currentH3List = document.createElement('ul');
          li.appendChild(currentH3List);
        } else {
          tocList.appendChild(li);
        }
      } else if (heading.tagName === 'H4') {
        if (currentH3List) {
          currentH3List.appendChild(li);
        } else if (currentH2List) {
          currentH2List.appendChild(li);
        } else {
          tocList.appendChild(li);
        }
      }
    });
    
    if (tocNav) {
      tocNav.appendChild(tocList);
    }
    if (mobileTocNav) {
      mobileTocNav.appendChild(tocList.cloneNode(true));
    }
  }
  
  function setupScrollHighlight(headings) {
    const tocLinks = document.querySelectorAll('.floating-toc a, .mobile-toc a');
    
    function highlightToc() {
      let current = '';
      
      headings.forEach(function(heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      tocLinks.forEach(function(link) {
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Throttled scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(function() {
        highlightToc();
      });
    });
    
    // Initial highlight
    highlightToc();
  }
  
  function setupProgressRing() {
    const progressRing = document.querySelector('.progress-ring__progress');
    const progressText = document.querySelector('.progress-percentage');
    
    if (!progressRing || !progressText) {
      return;
    }
    
    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = Math.round((scrollTop / Math.max(scrollHeight, 1)) * 100);
      
      const circumference = 2 * Math.PI * 27; // r=27
      const offset = circumference - (scrollPercentage / 100) * circumference;
      
      progressRing.style.strokeDashoffset = offset;
      progressText.textContent = scrollPercentage + '%';
    }
    
    // Throttled scroll event for progress
    let progressTimeout;
    window.addEventListener('scroll', function() {
      if (progressTimeout) {
        window.cancelAnimationFrame(progressTimeout);
      }
      progressTimeout = window.requestAnimationFrame(function() {
        updateProgress();
      });
    });
    
    // Initial progress
    updateProgress();
  }
  
  function setupTOCToggle() {
    const progressRingContainer = document.querySelector('.progress-ring-container');
    const floatingToc = document.getElementById('floating-toc');
    const tocToggle = document.getElementById('toc-toggle');
    
    // 화면 크기에 따른 TOC 동작 설정
    function checkScreenSize() {
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1700) {
        // 대형 화면: 기본 표시, 퍼센티지로 토글
        if (floatingToc) {
          floatingToc.classList.remove('hide');
        }
      } else {
        // 중소형 화면: 기본 숨김, 버튼으로 토글
        if (floatingToc) {
          floatingToc.classList.remove('show');
        }
      }
    }
    
    // 초기 화면 크기 창이
    checkScreenSize();
    
    // 화면 크기 변경 시 재찼상이
    window.addEventListener('resize', checkScreenSize);
    
    // 대형 화면용 퍼센티지 토글
    if (progressRingContainer && floatingToc) {
      progressRingContainer.addEventListener('click', function() {
        if (window.innerWidth >= 1700) {
          floatingToc.classList.toggle('hide');
        }
      });
    }
    
    // 중소형 화면용 플로팅 버튼 토글
    if (tocToggle && floatingToc) {
      tocToggle.addEventListener('click', function() {
        if (window.innerWidth < 1700 && window.innerWidth >= 768) {
          floatingToc.classList.toggle('show');
        } else if (window.innerWidth < 768) {
          // 모바일에서는 모바일 TOC 열기
          const mobileToc = document.getElementById('mobile-toc');
          if (mobileToc) {
            mobileToc.classList.add('active');
          }
        }
      });
    }
    
    // 모바일 TOC 설정
    const mobileToc = document.getElementById('mobile-toc');
    const tocClose = document.getElementById('toc-close');
    
    if (tocClose && mobileToc) {
      tocClose.addEventListener('click', function() {
        mobileToc.classList.remove('active');
      });
      
      // 바깥쪽 클릭으로 닫기
      mobileToc.addEventListener('click', function(e) {
        if (e.target === mobileToc) {
          mobileToc.classList.remove('active');
        }
      });
    }
  }
  
  function setupSmoothScroll() {
    const tocLinks = document.querySelectorAll('.floating-toc a, .mobile-toc a');
    const mobileToc = document.getElementById('mobile-toc');
    const floatingToc = document.getElementById('floating-toc');
    
    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
          
          // 모바일 TOC 닫기
          if (mobileToc && mobileToc.classList.contains('active')) {
            mobileToc.classList.remove('active');
          }
          
          // 중소형 화면에서 플로팅 TOC 닫기
          if (floatingToc && window.innerWidth < 1700 && window.innerWidth >= 768) {
            floatingToc.classList.remove('show');
          }
        }
      });
    });
  }
})();