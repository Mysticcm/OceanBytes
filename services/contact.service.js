const Contact = require('../models/Contact');

async function contactUs (info) {
    await Contact.create({...info});
}

module.exports = {
    contactUs
}