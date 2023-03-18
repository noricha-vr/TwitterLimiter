// Twitter の URL
const TWITTER_URL = "https://twitter.com/";
const MINUTES = 60;

// 初期値
const INITIAL_POPUP_URL = "https://www.example.com/";
const INITIAL_DURATION = 3; // 3 分

// Twitter のページを開いた時間を記録する
let twitterTimer = 0;
let popupUrl = INITIAL_POPUP_URL;
// Twitter のページを開いている時間の間隔
let twitterTimerLimit = INITIAL_DURATION * MINUTES; // 分を秒に変換
let interval


// 設定を同期する
function syncSettings() {
	chrome.storage.sync.get({
		popupUrl: popupUrl,
		twitterTimerLimit: twitterTimerLimit
	}, function (items) {
		twitterTimerLimit = items.twitterTimerLimit * MINUTES; // 分をミリ秒に変換
		popupUrl = items.popupUrl
		console.log(`Sync settings. twitterTimerLimit: ${twitterTimerLimit} sec. popupUrl: ${popupUrl}`);
	});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "settings_updated") {
		syncSettings();
	}
});


// 現在のタブの URL を取得する
async function getCurrentUrl() {
	const queryOptions = { active: true, currentWindow: true };
	const tabs = await chrome.tabs.query(queryOptions);
	const url = tabs[0]?.url || '';
	console.log(`Current url: ${url}`);
	return url;
}


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status !== "complete" || twitterTimer > 0) {
		return;
	}
	const url = await getCurrentUrl();
	if (!url.startsWith(TWITTER_URL)) {
		return;
	}
	syncSettings();
	clearInterval(interval);
	interval = setInterval(async () => {
		const url = await getCurrentUrl();
		if (url.startsWith(TWITTER_URL)) {
			console.log("You are on Twitter.");
			if (twitterTimer < twitterTimerLimit) {
				twitterTimer++;
				console.log(`twitterTimer: ${twitterTimer}`);
			} else {
				// twitterTimerLimit 秒後にタブを開く
				chrome.tabs.create({
					url: popupUrl,
					active: true,
				});
				twitterTimer = 0;
				console.log('Redirect to', popupUrl);
				clearInterval(interval);
			}
		}
	}, 1000);
});
