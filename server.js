require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');
app.use(express.static('public'));  //we are telling the express to get the static files which are going to be fetched in our ejs from public folder

const connectDB = require('./config/db');
connectDB();

//cors for cors block isse 
const corsOptions = {
    origin:['http://localhost:3000','http://localhost:5500','http://localhost:3300']
}
app.use(cors(corsOptions));
app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

//Routes
app.use('/api/files',require('./router/files'));
app.use('/files', require('./router/show'));
app.use('/files/download',require('./router/download'));

app.listen(PORT,()=>{
    console.log(`listening on the port ${PORT}`);
})