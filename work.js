let list_json;
let folderHandle;
let scroll;
let previousHeight;
let count = 0;

const simulateScroll = async () => {
	previousHeight = document.documentElement.scrollHeight;
	window.scrollBy(0, 300);
	await new Promise(resolve => setTimeout(resolve, 1000));

	const newHeight = document.documentElement.scrollHeight;
	if (newHeight === previousHeight) {
		return false;
	}

	previousHeight = newHeight;
	return true;
}

const interceptFetch = async () => {
	const originalFetch = window.fetch;
	window.fetch = async function (...args) {
		const response = await originalFetch(...args);
		const clone = response.clone();

		clone.text().then(body => {
			if (args[0].startsWith("https://www.tiktok.com/api/collection/item_list/?WebIdLastTime=")) {
				window.fetch = originalFetch;

				list_json = JSON.parse(body);
				list_json = list_json.itemList;
				list_json = list_json.filter(item => item.video.playAddr !== undefined && item.video.playAddr !== null);
				console.log(list_json);
			}
		});
		return response;
	};
	if (scroll) {
		const bottom = await simulateScroll();
		return bottom;
	}
	scroll = true;
}
interceptFetch();

async function initDownloads() {
	let vidQueue = list_json;

	async function processBatch() {
		if (vidQueue.length === 0) {
			const more = await interceptFetch();
			if (more) {
				vidQueue = list_json;
			} else {
				window.postMessage({
					action: "finished",
					count: count
				}, "*");
				return;
			}
		}

		const videoUrl = vidQueue.shift();
		const videoName = `${videoUrl.id}.mp4`;

		fetchAndWrite(videoUrl.video.playAddr, videoName)
			.then(() => console.log(`Finished: ${videoName}`))
			.catch(err => console.error(`Failed: ${videoName}`, err))
			.finally(() => {
				count++;
				processBatch();
			});

	}
	await processBatch();
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
	if (event.data.action === "folderpicked") {
		folderHandle = event.data.folderHandle;
	}
});

