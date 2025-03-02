chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "folderPicked") {
		console.log("recieved");

		chrome.runtime.sendMessage({ action: "updateWarning", folderHandle: message.folderHandle });
	}
});
