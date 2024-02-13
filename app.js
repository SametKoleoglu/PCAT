const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require('ejs')

const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');


const app = express();

//connect db
mongoose.connect('');
console.log('Db connection successfully !');

//Template Engine
app.set('view engine', 'ejs');

//Middle Wares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);


// CONTROLLER
app.get('/', photoController.getAllPhotos);

app.get('/photos/:id', photoController.getPhoto);

app.post('/photos', photoController.createPhoto);

app.put('/photos/:id', photoController.updatePhoto);

app.delete('/photos/:id', photoController.deletePhoto);


app.get('/about', pageController.getAboutPage);

app.get('/add', pageController.getAddPage);

app.get('/photos/edit/:id', pageController.getEditPage);


//sunucuyu ayağa kaldırıyoruz !
const port = 3000;

try {
  app.listen(port, () => {
    console.log(`Sunucu ${port} üzerinden Koşuyor !!!`);
  });
} catch {
  (error) => {
    console.log(error.message);
  };
}
