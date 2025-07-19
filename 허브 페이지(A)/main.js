function goTo(url) {
  // GA 이벤트 트래킹 (선택)
  if (window.gtag) {
    gtag('event', 'click', {
      event_category: 'HUB Navigation',
      event_label: url,
    });
  }
  window.location.href = url;
}

function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  if (!localStorage.getItem('langChosen')) {
    document.getElementById('langPopup').style.display = 'block';
  }
}

function setLang(lang) {
  localStorage.setItem('langChosen', lang);
  document.getElementById('langPopup').style.display = 'none';
}

window.onload = detectLanguage;
