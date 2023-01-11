

// Twitter の URL
const TWITTER_URL = "https://twitter.com/";

// ポップアップ先の URL
const INITIAL_POPUP_URL = "https://www.google.com/";
const INITIAL_DURATION = 3; // 3 分

chrome.storage.sync.get({
	duration: INITIAL_DURATION,
	popupUrl: INITIAL_POPUP_URL
}, function (items) {
	duration = items.duration * 1000 * 60;　// 分をミリ秒に変換
	popupUrl = items.popupUrl
	console.log(`duration: ${duration} popupUrl: ${popupUrl}`);
});

// Titter のページを何回開いたかカウントする
let twitterCount = 0;

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
	// duration 秒後にリダイレクト
	setTimeout(async () => {
		let url = await getUrl();
		console.log(`check url: ${url}`);
		if (!url.startsWith(TWITTER_URL)) return;
		console.log("You are still on Twitter.");
		twitterCount = 0;
		chrome.tabs.create({
			url: popupUrl,
			active: true
		});
	}, duration);
})	
