// Saves options to chrome.storage
async function save_options() {
	var duration = document.getElementById('duration').value;
	var popupUrl = document.getElementById('popup_url').value;
	var status = document.getElementById('status');
	chrome.storage.sync.set({
		duration: duration,
		popupUrl: popupUrl
	});
	status.classList.remove('hide');
	await new Promise((resolve) => setTimeout(resolve, 5000));
	status.classList.add('hide');
	// Update status to let user know options were saved.
	// status.classList.add('hide');
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value limitMin = 3 and popupUrl = 'https://www.example.com/'.
	chrome.storage.sync.get({
		duration: 3,
		popupUrl: 'https://www.google.com/'
	}, function (items) {
		document.getElementById('duration').value = items.duration;
		document.getElementById('popup_url').value = items.popupUrl;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
