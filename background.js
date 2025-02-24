var count = 0;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'start') {
		chrome.webRequest.onHeadersReceived.addListener(
			(details) => {
				const isVideoMp4 = details.responseHeaders.some(
					(header) =>
						header.name === "Content-Type" &&
						header.value.includes("video/mp4")
				);

				if (isVideoMp4 && count === 0) {

					count += 1;
					chrome.tabs.sendMessage(details.tabId, { action: "download", url: details.url }, (response) => {
						console.log(response);
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

async function downloadVideo(inlink) {
	try {
		const response = await fetch(inlink, { credentials: 'include' });
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `video_${Date.now()}.mp4`;
		document.body.appendChild(link);
		link.click();
		link.remove();

		setTimeout(() => window.URL.revokeObjectURL(url), 100);

		console.log("Download triggered:", message.url);
	} catch (error) {
		console.error("Error downloading video:", error);
	}

}
