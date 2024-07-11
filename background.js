// Twitter と X（旧Twitter）の URL
const TWITTER_URLS = ["https://twitter.com/", "https://x.com/"];
const MINUTES = 60;

// 初期値
const INITIAL_POPUP_URL = "https://www.example.com/";
const INITIAL_DURATION = 3; // 3 分

// Twitter/X のページを開いた時間を記録する
let twitterTimer = 0;
let popupUrl = INITIAL_POPUP_URL;
// Twitter/X のページを開いている時間の間隔
let twitterTimerLimit = INITIAL_DURATION * MINUTES; // 分を秒に変換
let interval;

// 設定を同期する
function syncSettings() {
    chrome.storage.sync.get({
        popupUrl: popupUrl,
        twitterTimerLimit: twitterTimerLimit
    }, function (items) {
        twitterTimerLimit = items.twitterTimerLimit * MINUTES; // 分を秒に変換
        popupUrl = items.popupUrl;
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

// URL が Twitter/X のものかチェックする
function isTwitterUrl(url) {
    return TWITTER_URLS.some(twitterUrl => url.startsWith(twitterUrl));
}


// chrome.tabs.onUpdated.addListener を修正
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log(`[${new Date().toISOString()}] Tab updated - tabId: ${tabId}, changeInfo:`, changeInfo);

    if (changeInfo.status !== "complete") {
        console.log(`[${new Date().toISOString()}] Tab update not complete, returning`);
        return;
    }

    if (twitterTimer > 0) {
        console.log(`[${new Date().toISOString()}] Twitter timer already running (${twitterTimer}s), returning`);
        return;
    }

    const url = await getCurrentUrl(tabId);
    console.log(`[${new Date().toISOString()}] Current URL: ${url}`);

    if (!isTwitterUrl(url)) {
        console.log(`[${new Date().toISOString()}] Not a Twitter/X URL, returning`);
        return;
    }

    console.log(`[${new Date().toISOString()}] Twitter/X URL detected, syncing settings`);
    syncSettings();

    console.log(`[${new Date().toISOString()}] Clearing previous interval`);
    clearInterval(interval);

    console.log(`[${new Date().toISOString()}] Starting new interval`);
    interval = setInterval(async () => {
        const currentUrl = await getCurrentUrl(tabId);
        console.log(`[${new Date().toISOString()}] Current URL in interval: ${currentUrl}`);

        if (isTwitterUrl(currentUrl)) {
            console.log(`[${new Date().toISOString()}] Still on Twitter/X`);

            if (twitterTimer < twitterTimerLimit) {
                twitterTimer++;
                console.log(`[${new Date().toISOString()}] Twitter timer: ${twitterTimer}s / ${twitterTimerLimit}s`);
            } else {
                console.log(`[${new Date().toISOString()}] Time limit reached, redirecting`);
                chrome.tabs.create({
                    url: popupUrl,
                    active: true,
                }, (tab) => {
                    if (chrome.runtime.lastError) {
                        console.error(`[${new Date().toISOString()}] Error creating new tab:`, chrome.runtime.lastError);
                    } else {
                        console.log(`[${new Date().toISOString()}] New tab created with id: ${tab.id}`);
                    }
                });
                twitterTimer = 0;
                console.log(`[${new Date().toISOString()}] Redirected to ${popupUrl}, resetting timer`);
                clearInterval(interval);
                console.log(`[${new Date().toISOString()}] Interval cleared`);
            }
        } else {
            console.log(`[${new Date().toISOString()}] Not on Twitter/X anymore, clearing interval`);
            clearInterval(interval);
            twitterTimer = 0;
        }
    }, 1000);
});

// 他の関数にもログを追加
function syncSettings() {
    console.log(`[${new Date().toISOString()}] Syncing settings`);
    chrome.storage.sync.get({
        popupUrl: popupUrl,
        twitterTimerLimit: twitterTimerLimit
    }, function (items) {
        twitterTimerLimit = items.twitterTimerLimit * MINUTES;
        popupUrl = items.popupUrl;
        console.log(`[${new Date().toISOString()}] Settings synced. twitterTimerLimit: ${twitterTimerLimit}s, popupUrl: ${popupUrl}`);
    });
}

async function getCurrentUrl(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);
        console.log(`[${new Date().toISOString()}] getCurrentUrl: tabId=${tabId}, url=${tab.url}`);
        return tab.url || '';
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in getCurrentUrl:`, error);
        return '';
    }
}

function isTwitterUrl(url) {
    const result = TWITTER_URLS.some(twitterUrl => url.startsWith(twitterUrl));
    console.log(`[${new Date().toISOString()}] isTwitterUrl: ${url} - ${result}`);
    return result;
}
