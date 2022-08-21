const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));
//app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});