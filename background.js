chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "folderPicked") {
		chrome.runtime.sendMessage({ action: "updateWarning", folderHandle: message.folderHandle });
	}
});
