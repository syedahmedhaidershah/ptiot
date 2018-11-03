var p = {
	e: {
		"loader-container": null,
		"manage-security": null,
		"manage-doors": null,
		"light-1": null,
		"light-2": null,
		"light-3": null,
		"fan-1": null,
		"fan-thread-outer": null,
		"fan-state-button": null,
		"fan-range": null,
		"video": null,
		"video-container": null
	},
	f: {},
	g: {
		"remove-active-times": null
	},
	i: {},
	v: {
		"user":{
			"username": "acab29",
			"password": "172967"
		},
		"rooms": {}
	},
	x: {
		"lighttoggle": null,
		"fantoggle": null,
		"getdata": null,
		"dimfan": null,
		"loadData": null
	},
	socket: null,
	init: function () {
		document.addEventListener("DOMContentLoaded", p.proceed, false);
	},
	proceed: function () {
		// p.createSocket();
		p.setElements();
		p.killForms();
		p.addListeners();
		p.setIntervals();
		p.loadData();
		p.e["video"].play();
	},
	loadData: function(){
		let thisxhr = p.x["loadData"];
		thisxhr.open("POST","http://192.168.1.102:9999/devices/get/byuser", true);
		thisxhr.setRequestHeader('Content-type', 'application/json');
		thisxhr.onreadystatechange = function(){
			if(thisxhr.readyState == 4 && thisxhr.status == 200){
				let res = JSON.parse(thisxhr.responseText);
				if(!res.error){
					p.v.rooms = res.message.slice(0)[0];
				} else {
					console.log("error");
				}
			}
		}
		thisxhr.send(JSON.stringify(p.v.user));
	},
	setIntervals: function(){
		p.i.getdatainterval = setInterval(function(){
			p.getData();
		},1000);
	},
	getData: function(){
		p.x["getdata"].open("POST", "http://192.168.1.102:9999/devices/get/byparent", true);
		p.x["getdata"].setRequestHeader('Content-type', 'application/json');
		p.x["getdata"].send(JSON.stringify({ _id: "5bda2b44ab63863cac368b41" }));
	},
	setCookie: function (cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},
	getCookie: function (cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	toggleLight: function (id) {
		p.x["lighttoggle"].open("POST", "http://192.168.1.102:9999/devices/toggle", true);
		p.x["lighttoggle"].setRequestHeader('Content-type', 'application/json');
		let switcher = parseInt(id.split("-")[1]);
		let room = null;
		Object.keys(p.v.rooms).forEach(function(i){room = i});
		let device = null; 
		Object.keys(p.v.rooms[room]).forEach(function(r){
			if(r.name == "Device ".concat(switcher)){
				console.log(r);
			}
		});
		p.x["lighttoggle"].send(JSON.stringify({ _id: device }))
	},
	toggleDimmable: function () {
		$(".thread-outer").removeClass("active");
		$(p.e["fan-thread-outer"]).addClass("active");
	},
	toggleFan: function() {
		p.x["fantoggle"].open("POST", "http://192.168.1.102:9999/devices/toggle", true);
		p.x["fantoggle"].setRequestHeader('Content-type', 'application/json');
		p.x["fantoggle"].onreadystatechange = function(){
			if(p.x["fantoggle"].readyState == 4 && p.x["fantoggle"].status == 200){
				thiselem = $(p.e["fan-state-button"]);
				if(thiselem.hasClass("active")){
					thiselem.removeClass("active");
				} else {
					thiselem.addClass("active");
				}
			}
		}
		p.x["fantoggle"].send(JSON.stringify({ _id: "5bda2b44ab63863cac368b47" }));
	},
	addListeners: function () {
		p.e["light-1"].onclick = function () {
			p.toggleLight(this.id);
		}
		p.e["light-2"].onclick = function () {
			p.toggleLight(this.id);
		}
		p.e["light-3"].onclick = function () {
			p.toggleLight(this.id);
		}
		p.e["fan-1"].onclick = function () {
			p.toggleDimmable();
		}
		p.g["remove-active-times"].forEach(function(t){
			t.onclick = function(){
				$(this.parentElement.parentElement).removeClass("active");
			}
		});
		p.e["fan-state-button"].onclick = function(){
			p.toggleFan();
		}
		p.x["getdata"].onreadystatechange = function(){
			if (p.x["getdata"].readyState == 4 && p.x["getdata"].status == 200){
				let data = JSON.parse(p.x["getdata"].response).message;
				let thiselem, state;
				data.forEach(function(o){
					switch (o.name.split(" ")[1]){
						case "0":
							thiselem = $(p.e["light-1"].parentElement);
							state = o.state;
							if(state){
								thiselem.addClass("active");	
							} else {
								thiselem.removeClass("active");
							}
							break;
						case "1":
							thiselem = $(p.e["light-2"].parentElement);
							state = o.state;
							if(state){
								thiselem.addClass("active");	
							} else {
								thiselem.removeClass("active");
							}
							break;
						case "2":
							thiselem = $(p.e["light-3"].parentElement);
							state = o.state;
							if(state){
								thiselem.addClass("active");	
							} else {
								thiselem.removeClass("active");
							}
							break;
						case "4":
						thiselem = $(p.e["fan-1"].parentElement);
						state = o.state;
						p.e["fan-range"].value = o.attr.current;
						if(state){
								thiselem.addClass("active");
								$(p.e["fan-state-button"]).addClass("active");	
							} else {
								thiselem.removeClass("active");
								$(p.e["fan-state-button"]).removeClass("active");
							}
							break;
						default:
							break;
					}
				})
			}
		}
		p.e["fan-range"].oninput = function(){
			let value = this.value;
			p.x["dimfan"].open("POST", "http://192.168.1.102:9999/devices/dim", true);
			p.x["dimfan"].setRequestHeader('Content-type', 'application/json');
			p.x["dimfan"].onreadystatechange = function () {
				if (p.x["dimfan"].readyState == 4 && p.x["dimfan"].status == 200) {
					let current = JSON.parse(p.x["dimfan"].responseText).message;
					console.log(current);
					if(current == 0 || current == "0"){
						$(p.e["fan-state-button"]).removeClass("active");
					} else {
						$(p.e["fan-state-button"]).addClass("active");
					}
				}
			}
			p.x["dimfan"].send(JSON.stringify({ _id: "5bda2b44ab63863cac368b47", "current": parseInt(value)}));
		}
		p.e["manage-security"].onclick = p.toggleSecurity;
	},
	toggleSecurity: function(){
		$(".thread-outer").removeClass("active");
		$(p.e["video-container"]).addClass("active");
	},
	killForms: function () {
		Object.keys(p.f).forEach(function (k) {
			if (p.f[k]) {
				p.f[k].onsubmit = function (e) {
					try {
						e.preventDefault(); return false;
					} catch (err) {
						window.event.preventDefault(); return false;
					}
				}
			}
		});
	},
	gebi: function (id) {
		return document.getElementById(id);
	},
	geci: function (classname) {
		return Array.from(document.getElementsByClassName(classname));
	},
	setElements: function () {
		Object.keys(p.e).forEach(function (k) {
			p.e[k] = p.gebi(k);
		});
		Object.keys(p.f).forEach(function (k) {
			p.f[k] = p.gebi(k);
		});
		Object.keys(p.g).forEach(function (k) {
			p.g[k] = p.geci(k);
		});
		Object.keys(p.x).forEach(function (k) {
			p.x[k] = new XMLHttpRequest();
		});
	},
	getParam: function (string, param) {
		let url = new URL(string);
		let c = url.searchParp.get(param);
		if (c != undefined && c != null && c != "") {
			return c;
		} else {
			return null;
		}
	},
	clear: function (interval) {
		window.clearInterval(interval);
	},
	loadScreen: function () {
		let then = new Date().getTime();
		let setOpacity = 1;
		p.e['loader-container'].style.opacity = setOpacity;
		p.i.loadInterval = window.setInterval(function () {
			let now = new Date().getTime();
			if (now - then > 1000) {
				setOpacity -= 0.01;
				p.e['loader-container'].style.opacity = setOpacity;
			}
			if (now - then > 1500) {
				p.e['loader-container'].remove();
				p.clear(p.i.loadInterval);
			}
		});
	}
};

p.init();
window.onload = p.loadScreen;