const axios = require('axios')
const FormData = require('form-data')

function imageUser(req, res, next) {
    // console.log(req.files,'req imagekit<<<<<<<<<<<<<<<<<<<<<')
    // let pictures = []

    if (req.files.length < 1) {
        next()
    }
    else if (req.files.length === 1) {
        req.files.forEach((element) => {
         
            const form = new FormData()
            form.append('file', element.buffer.toString('base64'))
            form.append('fileName', element.originalname)
          
            const privKey = process.env.PRIVATE_KEY_IMAGEKIT
            const encodeKey = Buffer.from(privKey).toString('base64')

                axios({
                    url: process.env.URL_IMAGEKIT,
                    method: 'post',
                    headers: {
                        ...form.getHeaders(),
                    Authorization: `Basic ${encodeKey}`
                    },
                    data: form
                })
                    .then((result) => {
                        // pictures.push(result.data.url)
                        req.imgUrl = result.data[0]
                        next()
                        // if (req.image.length === 1) {
                        //     next()
                        // }
                    })
                    .catch((err) => {
                        console.log(err, `AAAAAAAAAAAAAAAAAAAAAAAA IMAGE 2`)
                        // next({ code: 500, message: err.message })
                    })
            
        })
    }
    else if (req.files.length === 2) {
        req.files.forEach((element) => {
        //     if (element.mimetype !== 'image/jpeg' && element.mimetype !== 'image/png') {
        //         next({ code: 400, message: 'You can only upload png or jpg' })
        //     }
        //     else {
                const form = new FormData()
                form.append('file', element.buffer.toString('base64'))
                form.append('fileName', element.originalname)
              
                const privKey = process.env.PRIVATE_KEY_IMAGEKIT
                const encodeKey = Buffer.from(privKey).toString('base64')
    
                    axios({
                        url: process.env.URL_IMAGEKIT,
                        method: 'post',
                        headers: {
                            ...form.getHeaders(),
                        Authorization: `Basic ${encodeKey}`
                        },
                        data: form
                    })
                    .then((result) => {
                        // pictures.push(result.data.url)
                        // req.image = pictures
                        req.body.imgUrl = result.data[0]
                        req.body.header = result.data[1]
                        next()
                        // if (req.image.length === 2) {
                        //     next()
                        // }
                    })
                    .catch((err) => {
                        console.log(err, `AAAAAAAAAAAAAAAAAAAAAAAA IMAGE 2`)
                        // next({ code: 500, message: err.message })
                    })
          
                })
    }
   

}

module.exports = imageUser