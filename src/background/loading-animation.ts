export class LoadingAnimation {
  timerId = 0;

  maxCount = 8;

  // Total number of states in animation
  current = 0;

  // Current state
  maxDot = 4; // Max number of dots in animation

  paintFrame() {
    let text = '';
    for (let i = 0; i < this.maxDot; i++) {
      text += i === this.current ? '.' : ' ';
    }
    if (this.current >= this.maxDot) text += '';

    chrome.browserAction.setBadgeText({ text });
    this.current++;
    if (this.current === this.maxCount) this.current = 0;
  }

  start() {
    if (this.timerId) return;

    this.timerId = window.setInterval(() => {
      this.paintFrame();
    }, 100);
  }

  stop() {
    if (!this.timerId) return;

    window.clearInterval(this.timerId);
    this.timerId = 0;
  }
}
