// Twitter の URL
const TWITTER_URL = "https://twitter.com/";

// ポップアップ先の URL
const INITIAL_POPUP_URL = "https://www.google.com/";
const INITIAL_DURATION = 3; // 3 分

// Titter のページを何回開いたかカウントする
let twitterCount = 0;
// Twitter のページを開いた時間を記録する
let twitterTimer = 0;
// Twitter のページを開いている時間の間隔
let interval

chrome.storage.sync.get({
	duration: INITIAL_DURATION,
	popupUrl: INITIAL_POPUP_URL
}, function (items) {
	duration = items.duration * 60;　// 分をミリ秒に変換
	popupUrl = items.popupUrl
	console.log(`duration: ${duration} sec. popupUrl: ${popupUrl}`);
});



async function getUrl() {
	let queryOptions = { active: true, currentWindow: true };
	let tabs = await chrome.tabs.query(queryOptions);
	if (tabs[0] === undefined) {
		return "";
	}
	if (tabs[0].url) return tabs[0].url;
	return "";
}

// 新しいページを開いたときに実行
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status !== "complete") return;
	if (twitterCount > 0) return;
	let url = await getUrl();
	console.log(`start url: ${url}`);
	if (!url.startsWith(TWITTER_URL)) return;
	twitterCount++;

	if (interval) clearInterval(interval);

	interval = setInterval(async () => {
		let url = await getUrl();
		console.log(`check url: ${url}`);
		if (url.startsWith(TWITTER_URL)) {
			console.log("You are on Twitter.");
			twitterCount = 0;
			if (twitterTimer < duration) {
				twitterTimer++;
				console.log(`twitterTimer: ${twitterTimer}`);
			} else {
				// duration 秒後にタブを開く
				chrome.tabs.create({
					url: popupUrl,
					active: true
				});
				twitterTimer = 0;
				interval = clearInterval(interval);
			}

		}
	}, 1000);
})	
