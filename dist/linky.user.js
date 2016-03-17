// ==UserScript==
// @name        Linky Square
// @author 		eight <eight04@gmail.com>
// @version     0.1.1
// @namespace   eight04.blogspot.com
// @description Grab links by dragging a square.
// @include     http*
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// ==/UserScript==

function createLinky(o){
	var delay = function(){
		function wrap(target) {
			target();
			target.delay = false;
		}
		
		return function(target) {
			if (!target.delay) {
				target.delay = true;
				setTimeout(wrap, 0, target);
			}
		};
	}();
	
	var tracker = function(o){
		var ox = 0, oy = 0, x = 0, y = 0,
			traceStart = false,
			linkCount = 0,
			enable = false;

		var ui = function(){
			GM_addStyle(".linky .linky-anchor-box{background:#ff0}.linky-select-box{border:2px dashed red;box-sizing:border-box;position:absolute;z-index:65534;display:none}.linky-info-box{color:#000;border:1px solid grey;background:#fff;position:absolute;z-index:65534;display:none;padding:.3em .6em}.linky body{-moz-user-select:none;-webkit-user-select:none;pointer-events:none}.linky .linky-info-box,.linky .linky-select-box{display:block}");

			var selectBox = document.createElement("div");
			selectBox.className = "linky-select-box";

			var infoBox = document.createElement("div");
			infoBox.className = "linky-info-box";

			var body = document.body;
			body.appendChild(selectBox);
			body.appendChild(infoBox);
			
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
		
			function on(){
				document.documentElement.classList.add("linky");
			}
			
			function off(){
				document.documentElement.classList.remove("linky");
			}
			
			return {
				on: on,
				off: off,
				updateSelectBox: updateSelectBox,
				updateInfoBox: updateInfoBox
			};
		}();

		function getOffset(node){
			var rect = node.getBoundingClientRect();

			return {
				x: window.pageXOffset + rect.left,
				y: window.pageYOffset + rect.top,
				width: rect.width,
				height: rect.height
			};
		}

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
			var centerx = pos.x + pos.width / 2;
			var centery = pos.y + pos.height / 2;

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
			var l = document.querySelectorAll("a[href]"), i, k = [], len = l.length;
			for (i = 0; i < len; i++) {
				k.push(inSelect(l[i]) && !isJSURL(l[i]));
			}
			linkCount = 0;
			for (i = 0; i < len; i++) {
				l[i].classList.toggle("linky-anchor-box", k[i]);
				linkCount += +k[i];
			}
		}
		
		function updateInfoBox() {
			ui.updateInfoBox(x, y, "selected " + linkCount + " link(s)");
		}

		function update(){
			updateSelectBox();
			delay(updateLinkList);
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
				if (!o.keyConfig.regular(e)) {
					return;
				}
				traceStart = true;
				
				on();
				// call it directly will cause firefox to stop srcolling. why?
				setTimeout(ui.on);
				
				x = ox = e.pageX;
				y = oy = e.pageY;
				
				update();
				
			} else if (e.type == "mousemove") {
				if (!traceStart) {
					return;
				}
				
				x = e.pageX;
				y = e.pageY;
				
				update();
				
			} else if (e.type == "mouseup" || e.type == "keydown") {
				if (
					!traceStart ||
					e.type == "keydown" && !o.keyConfig.copy(e) && !o.keyConfig.esc(e)
				) {
					return;
				}
				traceStart = false;
				
				off();
				ui.off();
				o.callback(e, takeLinks());	
			}
		}
		
		function on(){
			if (enable) {
				return;
			}
			window.addEventListener("mousemove", handler);
			window.addEventListener("mouseup", handler);
			window.addEventListener("keydown", handler);
			enable = true;
		}
		
		function off(){
			window.removeEventListener("mousemove", handler);
			window.removeEventListener("mouseup", handler);
			window.removeEventListener("keydown", handler);
			enable = false;
		}
		
		function track() {
			window.addEventListener("mousedown", handler);
			handler(o.initEvent);
		}
		
		return {
			on: on,
			off: off,
			track: track
		};
	}(o);
	
	tracker.track();
}

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
		if (e.code == "Escape") {
			return;
		} else if (e.code == "KeyC") {
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
		return e.code == "Escape";
	},
	copy: function(e) {
		return e.code == "KeyC";
	}
};

window.addEventListener("mousedown", function init(e){
	if (keyConfig.regular(e)) {
		window.removeEventListener("mousedown", init);
		createLinky({
			callback: handler,
			initEvent: e,
			keyConfig: keyConfig
		});
	}
});
