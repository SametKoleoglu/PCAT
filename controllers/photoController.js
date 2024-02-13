const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  // const photos = await Photo.find({}).sort('-dateCreated');
  // res.render('index', {
  //   photos,
  //   page_name: 'index',
  // });

  const page = req.query.page || 1;                          //Başlangıç sayfamız veya ilk sayfamız.
  const photosPerPage = 3;                                   //Her sayfada bulunan fotoğraf sayısı

  const totalPhotos = await Photo.find().countDocuments();   //Toplam fotoğraf sayısı

  const photos = await Photo.find({})                        //Fotoğraflar alınıyor
    .sort('-dateCreated')                                    //Sıralanıyor
    .skip((page - 1) * photosPerPage)                        //kendinden öncekileri geçiyor ve Her sayfanın kendi fotoğrafları oluşuyor
    .limit(photosPerPage);                                   //Her sayfada olmasını istediğimi fotoğraf sayısını sınırlıyoruz.

  res.render('index', {
    photos,
    page_name: 'index',
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
    page_name: 'index',
  });
};

exports.createPhoto = async (req, res) => {
  // async - await yapısı kullanacğız.

  // await Photo.create(req.body); // body bilgisini Photo modeli sayesinde veritabanında dökümana dönüştürüyoruz.
  // res.redirect('/');

  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadedPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadedPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  let deletedImage = __dirname + '/../public' + photo.image;
  if (fs.existsSync(deletedImage)) {
    fs.unlinkSync(deletedImage);
  }
  await Photo.findByIdAndDelete(req.params.id);

  res.redirect('/');
};
