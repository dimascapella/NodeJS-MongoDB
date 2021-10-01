const mongoose = require('mongoose')

const contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    email:{
        type: String
    }
})

module.exports = contact