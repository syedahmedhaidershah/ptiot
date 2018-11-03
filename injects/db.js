const atob = require("atob");
const constructs = {
	casea: "c2Foczk5OTY%3D",
	caseb: "QWhtZWQxMjM0LiE%3D"
};

function hashRev(string) {
	return (atob(decodeURIComponent(string)));
}

module.exports = {
	name: "ams",
	local: "mongodb://" + hashRev(constructs.casea) + ":" + hashRev(constructs.caseb) + "@127.0.0.1/admin",
	url: "mongodb://sahs9996:Ahmed1234.!@ds151892.mlab.com:51892/pulsate"
};