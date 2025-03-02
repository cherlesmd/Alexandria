let list_json;
let folderHandle;
const channel = new BroadcastChannel("alexandria");

window.addEventListener("message", async (event) => {
	if (event.data.action === "folderpicked") {
		folderHandle = event.data.folderHandle;
		console.log("Folder handle received:", folderHandle);
	}
});

(() => {
	const interceptFetch = () => {
		const originalFetch = window.fetch;
		window.fetch = async function(...args) {
			const response = await originalFetch(...args);
			const clone = response.clone();

			clone.text().then(body => {
				if (args[0].startsWith("https://www.tiktok.com/api/collection/item_list/?WebIdLastTime=")) {
					window.fetch = originalFetch;

					list_json = body;
					//window.postMessage({
					//action: "tiktokResponse",
					//responseBody: body
					//}, "*");
				}
			});
			return response;
		};
	}
	interceptFetch();
})();
