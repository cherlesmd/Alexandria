chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "folderPicked") {
		chrome.runtime.sendMessage({ action: "updateWarning", folderHandle: message.folderHandle });
	}
	if (message.action === "finished") {
		chrome.runtime.sendMessage({ action: "displayCount", count: message.count });
	}
});
