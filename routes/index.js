const { unlinkSync } = require('fs');
const router = require('express').Router();
const { upload, uploadToCloudinary } = require('../controllers/upload');
const db = require('../models');

// Uses middleware to process the file upload
router.post('/api/upload', upload, async (req, res) => {
  const { file } = req;
  // Captures the file data from the upload process and sends it to Cloudinary
  const result = await uploadToCloudinary(file.path, { folder: 'foo' });
  // When the upload is complete, delete it from the /tmp directory
  if (file) unlinkSync(file.path);
  // Create object using data from the file and result object from Cloudinary
  const data = {
    name: file.originalname,
    description: '',
    url: result.secure_url
  };
  // Create the Gallery item
  const item = await db.Gallery.create(data);
  // Ensure it exists before return the result otherise send a 404
  if (item) return res.json(item);
  return res.statusCode(404);
});

router.get('/', async (req, res) => {
  const galleryData = await db.Gallery.findAll({});
  const photos = galleryData.map(item => item.get({ plain: true }));
  res.render('home', { photos });
});

module.exports = router;