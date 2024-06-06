let isMobile = /Android|iPhone|iPod|IEMobile/i.test(navigator.userAgent);

function checkDocumentFocus() {
  var lightHeader = document.getElementById('lightHeader');
  var darkHeader = document.getElementById('darkHeader');
  var body = document.body;
  
  var isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (document.hasFocus()) {
    if (isMobile) {
        lightHeader.setAttribute('content', '#ececec');
        darkHeader.setAttribute('content', '#1e1e1e');
    } else {
        lightHeader.setAttribute('content', '#f6f6f6');
        darkHeader.setAttribute('content', '#3b3b3b');
    }
    if (isLightMode) {
      body.classList.add('light-mode-focused');
      body.classList.remove('light-mode-unfocused');
    }
  } else {
    if (isMobile) {
        lightHeader.setAttribute('content', '#ececec');
        darkHeader.setAttribute('content', '#1e1e1e');
    } else {
        lightHeader.setAttribute('content', '#e8e8e8');
        darkHeader.setAttribute('content', '#2f2f2f');
    }
    if (isLightMode) {
      body.classList.add('light-mode-unfocused');
      body.classList.remove('light-mode-focused');
    } else {
      body.classList.remove('light-mode-unfocused');
      body.classList.remove('light-mode-focused');
    }
  }
}

checkDocumentFocus();

window.addEventListener('focus', checkDocumentFocus);
window.addEventListener('blur', checkDocumentFocus);

window.matchMedia('(prefers-color-scheme: light), (prefers-color-scheme: dark)').addEventListener('change', checkDocumentFocus);