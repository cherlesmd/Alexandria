(function() {
	const e = document.createElement("script");
	e.src = chrome.runtime.getURL("work.js");
	e.type = "module";

	(document.head || document.documentElement).appendChild(e);
})();

function injectPanel() {
	const e = document.createElement("section");
	e.id = "alexandria-container";
	const c = document.createElement("iframe");
	c.style.width = "100%";
	c.style.overflow = "hidden";
	c.scrolling = "no";
	c.src = chrome.runtime.getURL("panel.html"),
		c.name = "ui",
		c.id = "alexandria",
		e.appendChild(c),
		document.body.prepend(e)
}

document.addEventListener("DOMContentLoaded", () => {
	injectPanel();
});


window.addEventListener("message", async (event) => {
	if (event.data.action === "chooseFolder") {
		try {
			const folderHandle = await window.showDirectoryPicker();

			window.postMessage({
				action: "folderpicked",
				folderHandle: folderHandle
			}, "*");

			chrome.runtime.sendMessage({ action: "folderPicked", folderHandle: folderHandle.name });
		} catch (error) {
			console.error("Error selecting folder:", error);
		}
	}
});
