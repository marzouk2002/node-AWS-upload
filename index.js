const express = require('express')
const multer = require('multer')
const path = require('path')
const AWS = require('aws-sdk');
const app = express()

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize : 100000000
    },
    fileFilter: (req, file, cd) => {
        checkFileType(file, cd)
    }
}).single('myImg')

//check file type
function checkFileType(file, cb) {
    
    // Allowed ext
    const filetypes= /jpeg|jpg|png|gif/
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    // Check mime
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: images only')
    }
}

// AWS
const BUCKET_NAME = 'marzouk-test';
const IAM_USER_KEY = 'AKIAQQU4RPWAWRVPC64E';
const IAM_USER_SECRET = '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';

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.createBucket(function () {
      var params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file.data
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        }
        console.log('success');
        console.log(data);
      });
  });
}

// EJS
app.set('view engine', 'ejs')

// public folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', (req, res)=>{
    upload(req, res, err =>{
        if(err)  {
            res.render('index', {
                msg: err
            })
        }else{
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected'
                })
            } else {
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const PORT = 4000

app.listen(PORT, ()=>{
    console.log(`Server started on port: ${PORT}`)
})