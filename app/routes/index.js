const path = require("path");
var fs = require("fs");

module.exports = function (app, root) {
	app.get("/", (req, res) => {
		res.sendFile(path.join(root, "www/index.html"));
	});
	app.get("*", (req, res) => {
		const urlparts = req.url.split(".");
		if (fs.existsSync(path.join(root, req.url))) {
			res.setHeader("Content-Type", "text/" + urlparts[urlparts.length - 1]);
			res.sendFile(path.join(root, req.url));
		} else {
			res.send("501. access forbidden.");
		}
	});
};