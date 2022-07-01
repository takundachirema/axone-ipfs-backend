// Bring in the express package
import express from 'express';
import bodyParser from 'body-parser';
import {setEnvironment} from './config/env';
import {registerRoutes} from './routes.js';
import {setSession} from './middleware/auth';

const cors = require('cors');
const app = express() // instantiate a new express app
const port = process.env.PORT || 3000

app.use(cors());

setEnvironment(app);
registerRoutes(app);
setSession(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// creating a route
app.get('/', (req, res) => {
  if (process.env.NODE_ENV !== 'production'){
      return res.send("Running server in dev mode")
  } else {
      return res.sendFile("index.html", {root: __dirname + '/../dist/'});
  }
})

// use sudo npm install nodemon -g 
// package to get hot reloads for express servers
// and can now run: nodemon dev-server/index.js to serve the web server
var server = app.listen(port, () => {
  console.log('App listening on port '+port)
})

module.exports = server