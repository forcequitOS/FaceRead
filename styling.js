let isMobile = /Android|iPhone|iPod|IEMobile/i.test(navigator.userAgent);

function checkDocumentFocus() {
  var lightHeader = document.getElementById('lightHeader');
  var darkHeader = document.getElementById('darkHeader');
  var body = document.body;
  
  if (document.hasFocus()) {
    if (isMobile) {
        lightHeader.setAttribute('content', '#ececec');
        darkHeader.setAttribute('content', '#1e1e1e');
    } else {
        lightHeader.setAttribute('content', '#f6f6f6');
        darkHeader.setAttribute('content', '#3b3b3b');
    }
  } else {
    if (isMobile) {
        lightHeader.setAttribute('content', '#ececec');
        darkHeader.setAttribute('content', '#1e1e1e');
    } else {
        lightHeader.setAttribute('content', '#e8e8e8');
        darkHeader.setAttribute('content', '#2f2f2f');
    }
  }
}

checkDocumentFocus();

window.addEventListener('focus', checkDocumentFocus);
window.addEventListener('blur', checkDocumentFocus);