const express = require('express')
const multer = require('multer')
const path = require('path')

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