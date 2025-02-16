
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    offense: { type: String, required: true },
    price: { type: Number, required: true },
    officerId: { type: String, required: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);
