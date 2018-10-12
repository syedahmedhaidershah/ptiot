var iot = {
	e: {
        arduinoname: null,
        "arduino-create-button": null,
        "arduino-copy-button" : null,
        dooruinoname : null,
        "dooruino-copy-button" : null,
        wifissid : null,
        wifipassword : null,
        "wifi-create-button": null,
        "wifi-copy-ssid-button" : null,
        "wifi-copy-password-button" : null
	},
	g: {

	},
	f: {
		"arduino-create-form": null,
		"wifi-create-form": null
	},
    v: {
        host : "http://192.168.1.102",
        port : 19988
	},
	x: {
		"arduino-create": null,
		"wifi-create": null
	},
	init: function(){
		document.addEventListener('DOMContentLoaded', iot.proceed, false);
	},
	proceed: function(){
		iot.setElements();
		iot.setHandlers();
	},
	setElements: function(){
		Object.keys(iot.e).forEach(function(k){
			iot.e[k] = document.getElementById(k);
		});
		Object.keys(iot.f).forEach(function(k){
			iot.f[k] = document.getElementById(k);
		})
		Object.keys(iot.g).forEach(function(k){
			iot.g[k] = document.getElementsByClassName(k);	
		})
		Object.keys(iot.x).forEach(function(k){
			iot.x[k] = new XMLHttpRequest();	
		})
    },
    removeAlerts: function () {
        $(".alert").addClass("d-none");
        $(".alert").removeClass("d-inline");
    },
	setHandlers: function(){
		Object.keys(iot.f).forEach(function(k){
			iot.f[k].onsubmit = function(e){
				e.preventDefault();
				return false;
			}
        });
        iot.x["arduino-create"].onreadystatechange = function () {
            if (iot.x["arduino-create"].readyState == 4 && iot.x["arduino-create"].status == 200) {
                var j = JSON.parse(iot.x["arduino-create"].responseText);
                iot.e.arduinoname.value = j.message.arduino;
                iot.e.dooruinoname.value = j.message.dooruino;
                if (j.error == false) {
                    $("#arduino-success").addClass("d-inline");
                    $("#arduino-success").removeClass("d-none");
                } else {
                    alert(j.message);
                }
            }
        }
        iot.x["wifi-create"].onreadystatechange = function () {
            if (iot.x["wifi-create"].readyState == 4 && iot.x["wifi-create"].status == 200) {
                var j = JSON.parse(iot.x["wifi-create"].responseText);
                iot.e.wifissid.value = j.message.ssid;
                iot.e.wifipassword.value = j.message.password;
                if (j.error == false) {
                    $("#wifi-success").addClass("d-inline");
                    $("#wifi-success").removeClass("d-none");
                } else {
                    alert(j.message);
                }
            }
        }
		iot.e["arduino-create-button"].onclick = function(){
            iot.x["arduino-create"].open("POST", iot.v.host + ":" + iot.v.port + "/generate", true);
            iot.x["arduino-create"].send();
        }
        iot.e["wifi-create-button"].onclick = function(){
            iot.x["wifi-create"].open("POST", iot.v.host + ":" + iot.v.port + "/generatewifi", true);
            iot.x["wifi-create"].send();
        }
        iot.e["arduino-copy-button"].onclick = function () {
            if (iot.e.arduinoname.value == "") return false;
            iot.e.arduinoname.select();
            document.execCommand('copy');
            iot.removeAlerts();
            alert("Copied Arduino's identifier to clipboard.");
        }
        iot.e["dooruino-copy-button"].onclick = function () {
            if (iot.e.dooruinoname.value == "") return false;
            iot.e.dooruinoname.select();
            document.execCommand('copy');
            iot.removeAlerts();
            alert("Copied Dooruino's identifier to clipboard.");
        }
	}
}

iot.init();