// Saves options to chrome.storage
async function saveOptions() {
	const duration = document.getElementById("duration").value;
	const popupUrl = document.getElementById("popup_url").value;
	const status = document.getElementById("status");

	chrome.storage.sync.set({
		duration: duration,
		popupUrl: popupUrl,
	});

	status.classList.remove("hide");
	await new Promise((resolve) => setTimeout(resolve, 5000));
	status.classList.add("hide");
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
	chrome.storage.sync.get(
		{
			duration: 3,
			popupUrl: "https://www.google.com/",
		},
		function (items) {
			document.getElementById("duration").value = items.duration;
			document.getElementById("popup_url").value = items.popupUrl;
		}
	);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
