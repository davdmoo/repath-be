const sizeValidation = async (req, res,next) =>{
    try {
        if (req.file === undefined) {
            next(); 
        }
        else{
            if (req.file.size > 300000){
                throw {name: "BigImage"}
            }
            else{
                next()
            }
        }

    } catch (err) {
        next(err);
    }
}

const typeValidation = async (req, res, next) =>{
   try {
    if (req.file === undefined) {
        next(); 
    }
    else{
        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') {
            next()
        } else {
            throw {name:"NotImage"} 
        }
    }

   } catch (err) {
       next(err)
   }
}

module.exports = {sizeValidation, typeValidation}