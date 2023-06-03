const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const user = require('./routes/user');


const app = express();
app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(user);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});