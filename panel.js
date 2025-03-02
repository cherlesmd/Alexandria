const chooseFolderButton = document.getElementById("folderButton");
const downloadButton = document.getElementById("downloadButton");
let picked;

chooseFolderButton.addEventListener("click", () => {
	window.parent.postMessage({
		action: "chooseFolder"
	}, "*");
});

downloadButton.addEventListener("click", () => {
	if (picked) {
		window.parent.postMessage({
			action: "startWrite"
		}, "*");

	} else {
		document.getElementById("warningD").style.display = "block";
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "updateWarning") {
		document.getElementById("folderButton").textContent = message.folderHandle;
		document.getElementById("warningD").style.display = "none";
		picked = true;
	}
});
