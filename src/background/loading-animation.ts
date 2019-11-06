export class LoadingAnimation {
  timerId_ = 0;
  maxCount_ = 8; // Total number of states in animation
  current_ = 0; // Current state
  maxDot_ = 4; // Max number of dots in animation

  paintFrame() {
    let text = '';
    for (let i = 0; i < this.maxDot_; i++) {
      text += i == this.current_ ? '.' : ' ';
    }
    if (this.current_ >= this.maxDot_) text += '';

    chrome.browserAction.setBadgeText({ text: text });
    this.current_++;
    if (this.current_ == this.maxCount_) this.current_ = 0;
  }

  start() {
    if (this.timerId_) return;

    let self = this;
    this.timerId_ = window.setInterval(() => {
      self.paintFrame();
    }, 100);
  }

  stop() {
    if (!this.timerId_) return;

    window.clearInterval(this.timerId_);
    this.timerId_ = 0;
  }
}
