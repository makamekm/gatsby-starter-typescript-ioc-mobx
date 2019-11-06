// import { LoadingAnimation } from './loading-animation';

const animationFrames = 36;
const animationSpeed = 10; // ms
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const loggedInImage = document.getElementById('logged_in') as CanvasImageSource;
const canvasContext = canvas.getContext('2d');
// const pollIntervalMin = 1; // 1 minute
// const pollIntervalMax = 60; // 1 hour
// const requestTimeout = 1000 * 2; // 2 seconds
let rotation = 0;
// const loadingAnimation = new LoadingAnimation();

// canvas.addEventListener('mouseenter', () => {
//   chrome.tabs.getSelected(null, (tab) => {
//     chrome.tabs.executeScript(tab.id, {code: "toggleRJMenu(true);"}, (response) => {
//       console.log('Menu has been toggled');
//     });
//   });
// });

// Legacy support for pre-event-pages.
// const oldChromeVersion = !chrome.runtime;
// let requestTimerId;

function getGmailUrl() {
  return 'https://mail.google.com/mail/';
}

// Identifier used to debug the possibility of multiple instances of the
// extension making requests on behalf of a single user.
// function getInstanceId() {
//   if (!localStorage.hasOwnProperty('instanceId')) localStorage.instanceId = 'gmc' + parseInt(Date.now() * Math.random(), 10);
//   return localStorage.instanceId;
// }

function isGmailUrl(url) {
  // Return whether the URL starts with the Gmail prefix.
  return url.startsWith(getGmailUrl());
}

function updateIcon() {
  if (!Object.getOwnPropertyNames(localStorage).includes('unreadCount')) {
    chrome.browserAction.setIcon({ path: 'gmail_not_logged_in.png' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
    chrome.browserAction.setBadgeText({ text: '?' });
  } else {
    chrome.browserAction.setIcon({ path: 'gmail_logged_in.png' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [208, 0, 24, 255] });
    chrome.browserAction.setBadgeText({
      text: String(localStorage.unreadCount) !== '0' ? localStorage.unreadCount : ''
    });
  }
}

function ease(x) {
  return (1 - Math.sin(Math.PI / 2 + x * Math.PI)) / 2;
}

// function scheduleRequest() {
//   console.log('scheduleRequest');
//   let randomness = Math.random() * 2;
//   let exponent = Math.pow(2, localStorage.requestFailureCount || 0);
//   let multiplier = Math.max(randomness * exponent, 1);
//   let delay = Math.min(multiplier * pollIntervalMin, pollIntervalMax);
//   delay = Math.round(delay);
//   console.log('Scheduling for: ' + delay);

//   chrome.alarms.create('refresh', {periodInMinutes: delay});
// }

function drawIconAtRotation() {
  canvasContext.save();
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.translate(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
  canvasContext.rotate(2 * Math.PI * ease(rotation));
  canvasContext.drawImage(loggedInImage, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
  canvasContext.restore();

  chrome.browserAction.setIcon({ imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height) });
}

function animateFlip() {
  rotation += 1 / animationFrames;
  drawIconAtRotation();

  if (rotation <= 1) {
    setTimeout(animateFlip, animationSpeed);
  } else {
    rotation = 0;
    updateIcon();
  }
}

function updateUnreadCount(count) {
  const changed = String(localStorage.unreadCount) !== String(count);
  localStorage.unreadCount = count;
  updateIcon();
  if (changed) {
    animateFlip();
  }
}

function goToInbox() {
  chrome.tabs.getSelected(null, tab => {
    chrome.tabs.executeScript(tab.id, { code: 'toggleRJMenu();' }, () => {
      // console.log('Menu has been toggled');
    });
  });

  // console.log('Going to inbox...');
  // chrome.tabs.getAllInWindow(undefined, function(tabs) {
  //   for (let i = 0, tab; tab = tabs[i]; i++) {
  //     if (tab.url && isGmailUrl(tab.url)) {
  //       console.log('Found Gmail tab: ' + tab.url + '. ' +
  //                   'Focusing and refreshing count...');
  //       chrome.tabs.update(tab.id, {selected: true});
  //       startRequest({scheduleRequest:false, showLoadingAnimation:false});
  //       return;
  //     }
  //   }
  //   console.log('Could not find Gmail tab. Creating one...');
  //   chrome.tabs.create({url: getGmailUrl()});
  // });
}

function onInit() {
  // console.log('onInit');
  localStorage.requestFailureCount = 0;
  updateUnreadCount(10);
}

// function onAlarm(alarm) {
// console.log('Got alarm', alarm);
// // |alarm| can be undefined because onAlarm also gets called from
// // window.setTimeout on old chrome versions.
// if (alarm && alarm.name == 'watchdog') {
//   onWatchdog();
// } else {
//   startRequest({scheduleRequest:true, showLoadingAnimation:false});
// }
// }

// function onWatchdog() {
//   chrome.alarms.get('refresh', function(alarm) {
//     if (alarm) {
//       console.log('Refresh alarm exists. Yay.');
//     } else {
//       console.log('Refresh alarm doesn\'t exist!? ' +
//                   'Refreshing now and rescheduling.');
//       startRequest({scheduleRequest:true, showLoadingAnimation:false});
//     }
//   });
// }

// function stopLoadingAnimation() {
//   if (params && params.showLoadingAnimation) loadingAnimation.stop();
// }

// if (params && params.showLoadingAnimation)
//   loadingAnimation.start();

chrome.runtime.onInstalled.addListener(onInit);
// chrome.alarms.onAlarm.addListener(onAlarm);

const filters = {
  // TODO(aa): Cannot use urlPrefix because all the url fields lack the protocol
  // part. See crbug.com/140238.
  url: [{ urlContains: getGmailUrl().replace(/^https?:\/\//, '') }]
};

const onNavigate = details => {
  if (details.url && isGmailUrl(details.url)) {
    // console.log(`Recognized Gmail navigation to: ${details.url}.` + `Refreshing count...`);
  }
};
if (chrome.webNavigation && chrome.webNavigation.onDOMContentLoaded && chrome.webNavigation.onReferenceFragmentUpdated) {
  chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate, filters);
  chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate, filters);
} else {
  chrome.tabs.onUpdated.addListener((_, details) => {
    onNavigate(details);
  });
}

chrome.browserAction.onClicked.addListener(goToInbox);

chrome.runtime.onStartup.addListener(() => {
  // console.log('Starting browser... updating icon.');
  updateIcon();
});

export default true;
