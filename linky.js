/* eslint no-script-url: 0 */
if (!window.linky) {
	window.linky = function(){
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
				.linky .cover {\
					display: block;\
				}\
				.linky-select .select-box {\
					display: block;\
				}\
			";
			document.head.appendChild(style);

			var selectBox = document.createElement("div");
			selectBox.className = "select-box";

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
			
			return {
				on: on,
				off: off,
				focusArea: focusArea,
				updateArea: updateArea,
				updateSelectBox: updateSelectBox
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
				enable = false, traceStart = false;

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

				for (i = 0; i < l.length; i++) {
					l[i].classList.toggle("anchor-box", inSelect(l[i]) && !isJSURL(l[i]));
				}
			}

			function update(){
				updateSelectBox();
				updateLinkList();
			}

			function takeLinks(){
				var l = document.querySelectorAll("a[href]"), i, links = "";

				for (i = 0; i < l.length; i++) {
					if (!inSelect(l[i]) || isJSURL(l[i])) {
						continue;
					}
					links += l[i].href + "\n";
				}
				return links;
			}

			function handler(e){
				if (e.type == "mousedown") {
					if (traceStart) {
						return;
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
					ui.updateArea(takeLinks());
					traceStart = false;
					document.body.classList.remove("linky-select");
				}
			}

			function on(){
				if (enable) {
					return;
				}
				window.addEventListener("mousedown", handler);
				window.addEventListener("mousemove", handler);
				window.addEventListener("mouseup", handler);
				enable = true;
			}
			
			function off(){
				window.removeEventListener("mousedown", handler);
				window.removeEventListener("mousemove", handler);
				window.removeEventListener("mouseup", handler);
				enable = false;
			}

			return {
				on: on,
				off: off
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

		function toggle(){
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

		return {
			toggle: toggle
		};
	}();
}

window.linky.toggle();
