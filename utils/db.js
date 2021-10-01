const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/contactApps',)


// const contact1 = new contact({
//     nama: 'Adi',
//     nohp: '081656111148',
//     email: 'Adi@gmail.com'
// })

// contact1.save().then((contact) => console.log(contact))