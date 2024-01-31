const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, './public/tempfiles/');
        cb(null, './public/');
        // cb(null, './tempfiles');
        // cb(null, './tempfiles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;