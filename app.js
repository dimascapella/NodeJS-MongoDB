const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')
const app = express()
const port = 3000;

require('./utils/db')
const Contact = require('./models/contact')

app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    })
)
app.use(flash())

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'As',
            email: 'AS@Gmail.com'
        },
        {
            nama: 'Bs',
            email: 'BS@Gmail.com'
        },
        {
            nama: 'Cs',
            email: 'CS@Gmail.com'
        },
    ]
    res.render('index',{
        nama: 'DCapella',
        title: 'Halaman Index',
        mahasiswa,
        layout: 'layouts/main-layout'
    })
})

//about
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'Halaman About'
    })
})

//contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contacts,
        msg: req.flash('msg')
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-data', {
        layout: 'layouts/main-layout',
        title: 'Halaman Tambah Data',
    })
})

app.post('/contact', [
    body('nama').custom( async (value) => {
        const duplicate = await Contact.findOne({nama: value});
        if(duplicate){
            throw new Error('Nama Contact Sudah Ada')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No HP Tidak Valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('add-data', {
            title: 'Form Tambah Data',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
    }else{
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Data Contact Berhasil Ditambahkan')
            res.redirect('/contact')
        })
    }
})

// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({nama: req.params.nama});
//     if(!contact){
//         res.status(404)
//         res.send('<h1>404</h1>')
//     }else{
//         Contact.deleteOne({_id : contact._id}).then((result) => {
//             req.flash('msg', 'Data Contact Berhasil Dihapus')
//             res.redirect('/contact')
//         })
//     }
// })

app.delete('/contact', (req, res) => {
    Contact.deleteOne({nama : req.body.nama}).then((result) => {
        req.flash('msg', 'Data Contact Berhasil Dihapus')
        res.redirect('/contact')
    })
})

app.get('/contact/edit/:nama', async(req, res) => {
    const contact = await Contact.findOne({nama : req.params.nama});
    res.render('edit-data', {
        layout: 'layouts/main-layout',
        title: 'Halaman Ubah Data',
        contact
    })
})

app.put('/contact', [
    body('nama').custom( async(value, {req}) => {
        const duplicate = await Contact.findOne({nama: value});
        if(value !== req.body.oldNama && duplicate){
            throw new Error('Nama Contact Sudah Ada')
        }
        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No HP Tidak Valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('edit-data', {
            title: 'Form Ubah Data',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        })
    }else{
        Contact.updateOne({_id : req.body._id}, {
            $set: {
                nama: req.body.nama,
                email: req.body.email,
                nohp: req.body.nohp
            }
        }).then((result) => {
            req.flash('msg', 'Data Contact Berhasil Diubah')
            res.redirect('/contact')
        })
    }
})

app.get('/contact/:nama', async(req, res) => {
    const contact = await Contact.findOne({nama: req.params.nama});
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contact
    })
})
