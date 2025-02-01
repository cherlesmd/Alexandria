chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'start') {
		chrome.webRequest.onHeadersReceived.addListener(
			(details) => {
				const isVideoMp4 = details.responseHeaders.some(
					(header) =>
						header.name === "Content-Type" &&
						header.value.includes("video/mp4")
				);

				if (isVideoMp4) {
					//downloadVideo(details.url);
					console.log("URL:", details.url);
					chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
						if (tabs.length > 0) {
							chrome.tabs.sendMessage(tabs[0].id, {
								action: "download",
								url: details.url,
							});
						}
					});
				}
				return {};
			},
			{ urls: ["<all_urls>"] },
			["responseHeaders"]
		);
		sendResponse({ success: true });
	}
	return true;
});

async function downloadVideo(link) {
	try {
		const response = await fetch(link);
		const blob = response.blob;
		const url = URL.createObjectURL(blob);
		var currentdate = new Date();
		var datetime = currentdate.getHours() + ":"
			+ currentdate.getMinutes() + ":"
			+ currentdate.getSeconds();

		chrome.downloads.download({
			url: url,
			filename: datetime,
			saveAs: false
		});
	} catch (error) {
		console.log(error);
	}
}
