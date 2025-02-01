chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.action === "download") {
		try {
			const response = await fetch(message.url);
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
			sendResponse({ success: true });
		} catch (error) {
			console.error("Error downloading video:", error);
			sendResponse({ success: false, error: error.message });
		}
	}
	return true;
});
