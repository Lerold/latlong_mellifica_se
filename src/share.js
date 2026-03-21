// Share pin feature — Web Share API with clipboard fallback

let shareBtn;
let shareFeedback;

export function shareInit() {
  shareBtn = document.getElementById('share-btn');
  shareFeedback = document.getElementById('share-feedback');

  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    sharePosition(url);
  });
}

export function updateShareState(hasPosition) {
  shareBtn.disabled = !hasPosition;
}

async function sharePosition(url) {
  // Use Web Share API on mobile if available
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Position — latlong.mellifica.se',
        text: 'Se denna position på kartan:',
        url,
      });
      showFeedback('Delad!');
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackCopy(url);
      }
    }
    return;
  }

  // Desktop fallback: copy to clipboard
  fallbackCopy(url);
}

async function fallbackCopy(url) {
  try {
    await navigator.clipboard.writeText(url);
    showFeedback('Länk kopierad!');
  } catch {
    // Final fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showFeedback('Länk kopierad!');
  }
}

function showFeedback(message) {
  shareFeedback.textContent = message;
  shareFeedback.hidden = false;
  clearTimeout(shareFeedback._timer);
  shareFeedback._timer = setTimeout(() => {
    shareFeedback.hidden = true;
  }, 2500);
}
