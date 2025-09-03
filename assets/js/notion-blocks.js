// Notion-style interactive blocks

document.addEventListener('DOMContentLoaded', function() {
  // Toggle 블록 기능
  initializeToggles();
  
  // Callout 블록 초기화
  initializeCallouts();
  
  // Copy 버튼 for 코드 블록
  initializeCodeBlocks();
});

// Toggle 블록 초기화
function initializeToggles() {
  const toggleHeaders = document.querySelectorAll('.notion-toggle .toggle-header');
  
  toggleHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const toggle = this.closest('.notion-toggle');
      const content = toggle.querySelector('.toggle-content');
      
      this.classList.toggle('open');
      content.classList.toggle('open');
    });
  });
}

// Callout 블록 초기화 (이모지 기반)
function initializeCallouts() {
  // blockquote를 callout으로 변환
  const blockquotes = document.querySelectorAll('.post-content blockquote');
  
  blockquotes.forEach(quote => {
    const firstLine = quote.textContent.trim().split('\n')[0];
    
    // 이모지로 시작하는지 확인
    const emojiMatch = firstLine.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
    
    if (emojiMatch) {
      const emoji = emojiMatch[0];
      const content = quote.innerHTML.replace(emoji, '').trim();
      
      // Callout 타입 결정
      let type = 'default';
      if (['💡', 'ℹ️', '📘'].includes(emoji)) type = 'info';
      if (['⚠️', '🚨', '⛔'].includes(emoji)) type = 'warning';
      if (['✅', '✓', '🎉'].includes(emoji)) type = 'success';
      if (['❌', '❗', '🔴'].includes(emoji)) type = 'error';
      
      // Callout 블록으로 변환
      const callout = document.createElement('div');
      callout.className = `notion-callout ${type}`;
      callout.innerHTML = `
        <div class="callout-emoji">${emoji}</div>
        <div class="callout-content">${content}</div>
      `;
      
      quote.replaceWith(callout);
    }
  });
}

// 코드 블록에 Copy 버튼 추가
function initializeCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.post-content pre');
  
  codeBlocks.forEach(block => {
    // 래퍼 div 생성
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    // Copy 버튼 생성
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function() {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });
    
    // DOM 재구성
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(copyBtn);
  });
}

// 키보드 단축키 지원
document.addEventListener('keydown', function(e) {
  // Cmd/Ctrl + K: 검색
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    // 검색 모달 열기 (구현 필요)
  }
  
  // Esc: 모든 팝업 닫기
  if (e.key === 'Escape') {
    // TOC, 검색 등 닫기
    const mobileToc = document.getElementById('mobile-toc');
    if (mobileToc && mobileToc.classList.contains('open')) {
      mobileToc.classList.remove('open');
    }
  }
});