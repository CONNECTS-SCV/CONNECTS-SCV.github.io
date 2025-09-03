// Notion-style callout functionality
document.addEventListener('DOMContentLoaded', function() {
  // blockquote를 callout으로 변환
  convertBlockquotesToCallouts();
  
  // 이스케이프된 마크다운 볼드 처리
  fixEscapedMarkdownBold();
  
  // 기존 TOC 스타일 문제 수정
  fixProgressRing();
});

function convertBlockquotesToCallouts() {
  const blockquotes = document.querySelectorAll('.post-content blockquote, article blockquote');
  
  blockquotes.forEach(quote => {
    // blockquote의 전체 텍스트 가져오기
    const text = quote.textContent.trim();
    const innerHTML = quote.innerHTML;
    
    // 키워드와 이모지 매핑
    const calloutPatterns = [
      // 이모지로 시작하는 경우
      { pattern: /^💡/, type: 'tip', emoji: '💡' },
      { pattern: /^ℹ️/, type: 'info', emoji: 'ℹ️' },
      { pattern: /^📘/, type: 'info', emoji: '📘' },
      { pattern: /^⚠️/, type: 'warning', emoji: '⚠️' },
      { pattern: /^🚨/, type: 'warning', emoji: '🚨' },
      { pattern: /^⛔/, type: 'error', emoji: '⛔' },
      { pattern: /^❌/, type: 'error', emoji: '❌' },
      { pattern: /^✅/, type: 'success', emoji: '✅' },
      { pattern: /^🎉/, type: 'success', emoji: '🎉' },
      { pattern: /^📝/, type: 'note', emoji: '📝' },
      { pattern: /^🔖/, type: 'note', emoji: '🔖' },
      
      // 키워드로 시작하는 경우
      { pattern: /^참고[:：]/i, type: 'info', emoji: 'ℹ️' },
      { pattern: /^note[:：]/i, type: 'note', emoji: '📝' },
      { pattern: /^tip[:：]/i, type: 'tip', emoji: '💡' },
      { pattern: /^warning[:：]/i, type: 'warning', emoji: '⚠️' },
      { pattern: /^주의[:：]/i, type: 'warning', emoji: '⚠️' },
      { pattern: /^danger[:：]/i, type: 'error', emoji: '🚨' },
      { pattern: /^important[:：]/i, type: 'warning', emoji: '❗' },
      { pattern: /^중요[:：]/i, type: 'warning', emoji: '❗' },
      { pattern: /^success[:：]/i, type: 'success', emoji: '✅' },
      { pattern: /^info[:：]/i, type: 'info', emoji: 'ℹ️' }
    ];
    
    // 매칭되는 패턴 찾기
    let matched = false;
    for (const calloutInfo of calloutPatterns) {
      if (calloutInfo.pattern.test(text)) {
        matched = true;
        
        // callout 블록 생성
        const callout = document.createElement('div');
        callout.className = `notion-callout ${calloutInfo.type}`;
        
        // 키워드나 이모지 제거
        let content = innerHTML;
        
        // 이모지로 시작하는 경우
        if (text.startsWith(calloutInfo.emoji)) {
          content = innerHTML.replace(calloutInfo.emoji, '').trim();
        } 
        // 키워드로 시작하는 경우
        else {
          content = innerHTML.replace(calloutInfo.pattern, '').trim();
        }
        
        callout.innerHTML = `
          <div class="callout-emoji">${calloutInfo.emoji}</div>
          <div class="callout-content">${content}</div>
        `;
        
        // 기존 blockquote 교체
        quote.parentNode.replaceChild(callout, quote);
        break;
      }
    }
    
    // 매칭되지 않은 일반 blockquote는 기본 info 타입으로 변환
    if (!matched) {
      const callout = document.createElement('div');
      callout.className = 'notion-callout info';
      
      callout.innerHTML = `
        <div class="callout-emoji">ℹ️</div>
        <div class="callout-content">${innerHTML}</div>
      `;
      
      quote.parentNode.replaceChild(callout, quote);
    }
  });
}

function fixProgressRing() {
  // 진행률 표시기의 % 글자 위치 수정
  const progressPercentage = document.querySelector('.progress-percentage');
  if (progressPercentage) {
    // CSS로 해결할 수 있도록 클래스 추가
    progressPercentage.classList.add('progress-text-fixed');
  }
}

function fixEscapedMarkdownBold() {
  // 포스트 콘텐츠에서 이스케이프된 마크다운 볼드 패턴을 찾아서 처리
  const postContent = document.querySelector('.post-content, article');
  
  if (!postContent) return;
  
  // 모든 텍스트 노드를 순회
  const walker = document.createTreeWalker(
    postContent,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  while(walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  textNodes.forEach(node => {
    const text = node.textContent;
    // 이스케이프된 마크다운 볼드 패턴: \*\*text\*\*
    if (text.includes('\\*\\*')) {
      const span = document.createElement('span');
      span.innerHTML = text
        .replace(/\\\*\\\*([^*]+)\\\*\\\*/g, '<strong>$1</strong>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      if (span.innerHTML !== text) {
        node.parentNode.replaceChild(span, node);
      }
    }
  });
}