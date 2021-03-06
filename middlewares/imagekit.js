const axios = require('axios');
var FormData = require('form-data');

const imagekit = async (req, res, next) => {
  try {
    if (req.file === undefined) {
      next();
    } else {
    
      const form = new FormData();
      form.append('file', req.file.buffer.toString('base64'));
      form.append('fileName', req.file.originalname);

      const privKey = process.env.PRIVATE_KEY_IMAGEKIT;
      const encodeKey = Buffer.from(privKey).toString('base64');

      
      
      const {data} = await axios.post(process.env.URL_IMAGEKIT, form, {    headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${encodeKey}`,
      }})

 
      req.body.imgUrl = data.url;
   
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = imagekit;
