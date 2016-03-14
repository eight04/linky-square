// ==UserScript==
// @name        Linky Square
// @version     0.1.0
// @namespace   eight04.blogspot.com
// @description Grab links by dragging a square.
// @include     http*
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// ==/UserScript==

function createLinky(o){
	var enable = false;
	
	var ui = function(){
		var enable = false;
		
		var style = document.createElement("style");
		style.textContent = "\
			.linky .anchor-box {\
				/*outline: 1px solid yellow!important;*/\
				background: yellow;\
			}\
			.select-box {\
				border: 2px dashed red; \
				box-sizing: border-box;\
				position: absolute; \
				z-index: 65534;\
				display: none;\
			}\
			.info-box {\
				border: 1px solid grey;\
				background: white;\
				position: absolute;\
				z-index: 65534;\
				display: none;\
				padding: 0.3em 0.6em;\
			}\
			.link-box {\
				border: 3px solid black;\
				padding: 6px;\
				position: fixed; \
				top: 4px;\
				left: 4px;\
				height: 300px; \
				width: 180px; \
				background: white; \
				z-index: 65535; \
				display:none;\
				pointer-events: auto;\
			}\
			.link-box.link-box-corner {\
				top: auto;\
				left: auto;\
				right: 4px;\
				bottom: 4px;\
			}\
			.cover {\
				position: fixed; \
				width: 100%;\
				height: 100%;\
				top: 0; \
				left: 0;\
				z-index: 65533;\
				display: none;\
			}\
			.linky body {\
				-moz-user-select: none;\
				-webkit-user-select: none;\
				pointer-events: none;\
			}\
			.linky .link-box,\
			.linky .cover,\
			.linky .info-box {\
				display: block;\
			}\
			.linky-select .select-box {\
				display: block;\
			}\
			.linky-watch-mode .link-box,\
			.linky-watch-mode .cover {\
				display: none;\
			}\
		";
		document.head.appendChild(style);

		var selectBox = document.createElement("div");
		selectBox.className = "select-box";

		var infoBox = document.createElement("div");
		infoBox.className = "info-box";

		var area = document.createElement("textarea");
		area.className = "link-box";
		area.onmouseover = function(){
			this.classList.toggle("link-box-corner");
		};

		var cover = document.createElement("div");
		cover.className = "cover";

		var body = document.body;
		body.appendChild(selectBox);
		body.appendChild(area);
		body.appendChild(infoBox);
		// body.appendChild(cover);
		
		function focusArea(){
			area.select();
			area.focus();
		}

		function updateArea(s){
			if (s) {
				area.value += s;
				focusArea();
			}
		}
		
		function updateSelectBox(x, y, w, h){
			var s = selectBox.style;
			s.left = x + "px";
			s.top = y + "px";
			s.width = w + "px";
			s.height = h + "px";
		}
		
		function updateInfoBox(x, y, text) {
			var s = infoBox.style;
			s.left = x + 16 + "px";
			s.top = y + 16 + "px";
			infoBox.textContent = text;
		}
	
		function toggle(){
			var html = document.documentElement;
			if (!enable) {
				html.classList.add("linky");
				// html.setAttribute("draggable", "false");
			} else {
				html.classList.remove("linky");
				// html.removeAttribute("draggable");
			}
		}
		
		function on(){
			document.documentElement.classList.add("linky");
		}
		
		function off(){
			document.documentElement.classList.remove("linky");
			area.value = "";
		}
		
		if (o.watchMode) {
			document.documentElement.classList.add("linky-watch-mode");
		}
		
		return {
			on: on,
			off: off,
			focusArea: focusArea,
			updateArea: updateArea,
			updateSelectBox: updateSelectBox,
			updateInfoBox: updateInfoBox
		};
	}();

	function getOffset(node){
		var x = 0, y = 0;

		while (node) {
			x += node.offsetLeft;
			y += node.offsetTop;
			node = node.offsetParent;
		}

		return {
			x: x,
			y: y
		};
	}

	var tracker = function(){
		var ox = 0, oy = 0, x = 0, y = 0,
			enable = false, traceStart = false, isWatchMode = false,
			linkCount = 0;

		function updateSelectBox(){
			ui.updateSelectBox(
				Math.min(Math.min(x, ox)),
				Math.min(y, oy),
				Math.abs(x - ox),
				Math.abs(y - oy)
			);
		}

		function inSelect(node){
			var pos = getOffset(node);
			var centerx = pos.x + node.offsetWidth / 2;
			var centery = pos.y + node.offsetHeight / 2;

			if (centerx < Math.min(ox, x)) {
				return false;
			}
			if (centerx > Math.max(ox, x)) {
				return false;
			}
			if (centery < Math.min(oy, y)) {
				return false;
			}
			if (centery > Math.max(oy, y)) {
				return false;
			}
			return true;
		}
		
		function isJSURL(node){
			return node.href.lastIndexOf("javascript:", 0) != -1;
		}

		function updateLinkList(){
			var l = document.querySelectorAll("a[href]"), i;
			
			linkCount = 0;

			for (i = 0; i < l.length; i++) {
				if (inSelect(l[i]) && !isJSURL(l[i])) {
					l[i].classList.add("anchor-box");
					linkCount++;
				} else {
					l[i].classList.remove("anchor-box");
				}
				// l[i].classList.toggle("anchor-box", inSelect(l[i]) && !isJSURL(l[i]));
			}
		}
		
		function updateInfoBox() {
			ui.updateInfoBox(x, y, "selected " + linkCount + " link(s)");
		}

		function update(){
			updateSelectBox();
			updateLinkList();
			updateInfoBox();
		}

		function takeLinks(){
			var l = document.querySelectorAll("a[href]"), i, links = [];

			for (i = 0; i < l.length; i++) {
				if (inSelect(l[i]) && !isJSURL(l[i])) {
					links.push(l[i].href);
				}
			}
			return links;
		}

		function handler(e){
			if (e.type == "mousedown") {
				if (traceStart) {
					return;
				}
				if (isWatchMode) {
					if (!o.keyConfig.regular(e)) {
						return;
					}
					on();
					// ui.on();
					// call it directly will cause firefox to stop srcolling. why?
					setTimeout(ui.on);
				}
				traceStart = true;
				x = ox = e.pageX;
				y = oy = e.pageY;
				update();
				document.body.classList.add("linky-select");
			} else if (e.type == "mousemove") {
				if (!traceStart) {
					return;
				}
				x = e.pageX;
				y = e.pageY;
				update();
			} else if (e.type == "mouseup") {
				if (!traceStart) {
					return;
				}
				if (isWatchMode) {
					off();
					ui.off();
					o.callback(e, takeLinks());
				} else {
					ui.updateArea(takeLinks().join("\n"));
				}
				traceStart = false;
				document.body.classList.remove("linky-select");
			} else if (e.type == "keydown") {
				if (!traceStart) {
					return;
				}
				var links = null;
				if (o.keyConfig.copy(e)) {
					links = takeLinks();
				} else if (!o.keyConfig.esc(e)) {
					return;
				}
				if (isWatchMode) {
					off();
					ui.off();
					o.callback(e, links);
				} else {
					ui.updateArea(takeLinks().join("\n"));
				}
				traceStart = false;
				document.body.classList.remove("linky-select");
			}
		}
		
		function on(){
			if (enable) {
				return;
			}
			if (!isWatchMode) {
				window.addEventListener("mousedown", handler);
			}
			window.addEventListener("mousemove", handler);
			window.addEventListener("mouseup", handler);
			window.addEventListener("keydown", handler);
			enable = true;
		}
		
		function off(){
			if (!isWatchMode) {
				window.removeEventListener("mousedown", handler);
			}
			window.removeEventListener("mousemove", handler);
			window.removeEventListener("mouseup", handler);
			window.removeEventListener("keydown", handler);
			enable = false;
		}
		
		function watchMode(e) {
			isWatchMode = true;
			window.addEventListener("mousedown", handler);
			handler(e);
		}
		
		return {
			on: on,
			off: off,
			watchMode: watchMode
		};
	}();
	
	var tabFocus = function(){
		var enable = false;

		function handler(e){
			if (e.keyCode != 9 || e.ctrlKey || e.shiftKey || e.altKey) {
				return;
			}
			e.preventDefault();
			ui.focusArea();
		}

		function off(){
			window.removeEventListener("keydown", handler);
			enable = false;
		}
		
		function on(){
			if (enable) {
				return;
			}
			window.addEventListener("keydown", handler);
			enable = true;
		}

		return {
			on: on,
			off: off
		};
	}();
	
	if (o.watchMode) {
		tracker.watchMode(o.initEvent);
	}

	return {
		toggle: function (){
			if (!enable) {
				ui.on();
				tracker.on();
				tabFocus.on();
			} else {
				ui.off();
				tracker.off();
				tabFocus.off();
			}
			enable = !enable;
		}
	};
};

// linkySquare.toggle();

function openLinks(links) {
	var i;
	for (i = 0; i < links.length; i++) {
		GM_openInTab(links[i], true);
	}
}

function handler(e, links) {
	if (e.type == "mouseup") {
		openLinks(links);
	} else if (e.type == "keydown") {
		if (e.key == "Escape") {
			return;
		} else if (e.key == "c") {
			if (links.length) {
				GM_setClipboard(links.join("\n"));
			}
		}
	}
}

var keyConfig = {
	regular: function(e){
		return e.altKey && !e.ctrlKey && !e.shiftKey && e.button == 0;
	},
	esc: function(e) {
		return e.key == "Escape";
	},
	copy: function(e) {
		return e.key == "c";
	}
};

window.addEventListener("mousedown", function init(e){
	if (keyConfig.regular(e)) {
		window.removeEventListener("mousedown", init);
		createLinky({
			watchMode: true,
			callback: handler,
			initEvent: e,
			keyConfig: keyConfig
		});
	}
});
