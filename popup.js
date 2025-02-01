// TODO: learn how to open new tab
// TODO: learn how to download video from new tab
document.getElementById('start').addEventListener("click", () => {
	chrome.runtime.sendMessage({ action: "start" }, (response) => {
		console.log(response);
	});
});




