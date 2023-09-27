// function updateIcon() {
//     chrome.storage.local.get({ birthdays: [] }, function (result) {
//         displayUpcomingBirthday();
//     });
// }

// chrome.alarms.create('updateIcon', { periodInMinutes: 1440 }); // 1440 minutes = 1 day

// chrome.alarms.onAlarm.addListener(function (alarm) {
//     if (alarm.name === 'updateIcon') {
//         updateIcon();
//     }
// });

// // Update the icon when the background script is loaded or the extension is installed/updated.
// updateIcon();
