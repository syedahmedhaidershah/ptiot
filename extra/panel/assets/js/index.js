var iot = {
	e: {
        arduinoname: null,
        "arduino-create-button": null,
        "arduino-copy-button" : null
	},
	g: {

	},
	f: {
		"arduino-create-form": null
	},
    v: {
        host : "http://192.168.1.103",
        port : 19988
	},
	x: {
		"arduino-create": null
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
                iot.e.arduinoname.value = j.message;
                if (j.error == false) {
                    $("#arduino-success").addClass("d-inline");
                    $("#arduino-success").removeClass("d-none");
                } else {
                    alert(j.message);
                }
            }
        }
		iot.e["arduino-create-button"].onclick = function(){
            var arduinoname = iot.e.arduinoname.value
            iot.x["arduino-create"].open("POST", iot.v.host + ":" + iot.v.port + "/generate", true);
            iot.x["arduino-create"].send();
        }
        iot.e["arduino-copy-button"].onclick = function () {
            if (iot.e.arduinoname.value == "") return false;
            iot.e.arduinoname.select();
            document.execCommand('copy');
            iot.removeAlerts();
            alert("Copied Arduino's identifier to clipboard.");
        }
	}
}

iot.init();