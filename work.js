let list_json;
let folderHandle;

(() => {
	const interceptFetch = () => {
		const originalFetch = window.fetch;
		window.fetch = async function (...args) {
			const response = await originalFetch(...args);
			const clone = response.clone();

			clone.text().then(body => {
				if (args[0].startsWith("https://www.tiktok.com/api/collection/item_list/?WebIdLastTime=")) {
					window.fetch = originalFetch;

					list_json = JSON.parse(body);
					list_json = list_json.itemList;
					console.log(list_json.filter(item => item.video.playAddr !== undefined && item.video.playAddr !== null));
				}
			});
			return response;
		};
	}
	interceptFetch();
})();

window.addEventListener("message", (event) => {
	if (event.data.action === "folderpicked") {
		folderHandle = event.data.folderHandle;
	}
});

async function initDownloads() {
	const vidQueue = list_json.filter(item => item.video.playAddr !== undefined && item.video.playAddr !== null);

	async function processBatch() {
		if (vidQueue.length === 0) return;

		const videoUrl = vidQueue.shift();
		const videoName = `${videoUrl.id}.mp4`;

		fetchAndWrite(videoUrl.video.playAddr, videoName)
			.then(() => console.log(`Finished: ${videoName}`))
			.catch(err => console.error(`Failed: ${videoName}`, err))
			.finally(() => {
				processBatch();
			});

	}
	const initialBatch = Array.from({ length: 3 }, () => processBatch());
	await Promise.all(initialBatch);
}

async function fetchAndWrite(videoUrl, videoName) {
	try {
		const response = await fetch(videoUrl, { credentials: "include" });
		const blob = await response.blob();
		const fileHandle = await folderHandle.getFileHandle(videoName, { create: true });
		const writable = await fileHandle.createWritable();
		await writable.write(blob);
		await writable.close();
	} catch (error) {
		console.log(error);
	}
}

window.addEventListener("message", async (event) => {
	if (event.data.action === "startWrite") {
		await initDownloads();
	}
});

