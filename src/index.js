const express = require("express");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { format } = require("timeago.js");
require("./database");
//Inicializations
const app = express();

//settings
const port = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extend: false }));

//le decimos a multer como queremos guardar la imagen y donde lo queremos
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb, filename) => {
    //con el extname extraemos la extencion de la imagen original
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

//multer ejecuta la funcion storage
app.use(multer({ storage: storage }).single("image"));

//global variables
//le damos un formato a la hora para que sea mas legible de leer
app.use((req, res, next) => {
   app.locals.format = format;
   next();
})
//static files
//configuramos para que la imagen pueda ser accedida desde el navegador
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(require("./routes/index"));

//server listening
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
