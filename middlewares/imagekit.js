const axios = require('axios');
var FormData = require('form-data');

const imagekit = async (req,res,next)=>{
    console.log(req.file.mimetype, `<<<ini file type`)
    try {
            const form = new FormData()
            form.append('file', req.file.buffer.toString('base64'))
            form.append('fileName', req.file.originalname)
            // console.log(form , `aaaaaaaaaaaaaaaaaaaa`)
        
            
            const privKey = process.env.PRIVATE_KEY_IMAGEKIT
            const encodeKey = Buffer.from(privKey).toString('base64')
    
           
            const {data} = await axios({
                method: 'POST',
                url: process.env.URL_IMAGEKIT,
                data: form,
                headers:{
                    ...form.getHeaders(),
                    Authorization: `Basic ${encodeKey}`
                }
            })
        
    
            req.body.imgUrl = data.url
            next()
            
        
        
    } catch (err) {
        console.log(err,`Jiodihafoihfoihofi`)
        next(err)
    }
}


module.exports = imagekit