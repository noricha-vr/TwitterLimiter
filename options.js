const saveButton = document.getElementById("save");

// Saves options to chrome.storage
async function saveOptions() {
	const twitterTimerLimit = document.getElementById("twitter-timer-limit").value;
	const popupUrl = document.getElementById("popup-url").value;
	chrome.storage.sync.set({
		twitterTimerLimit: twitterTimerLimit,
		popupUrl: popupUrl,
	});

	// saveButton をSaved!に変更して、Saved!のまま1秒後にSaveに戻す。
	saveButton.textContent = "Saved!";
	setTimeout(function () {
		saveButton.textContent = "Save";
		// メッセージをバックグラウンドスクリプトに送信
		const message = { type: "settings_updated" };
		chrome.runtime.sendMessage(message);
	}, 1000);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
	chrome.storage.sync.get(
		{
			twitterTimerLimit: 3,
			popupUrl: "https://www.google.com/",
		},
		function (items) {
			document.getElementById("twitter-timer-limit").value = items.twitterTimerLimit;
			document.getElementById("popup-url").value = items.popupUrl;
		}
	);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
saveButton.addEventListener("click", saveOptions);
