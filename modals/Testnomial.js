const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
    },
    reviewerName: {
        type: String,
        required: true,
    },
    reviewerId: {
        type: mongoose.Types.ObjectId, 
        required: true,
    },
    reviewerWork: {
        type: String,
        required: true,
    },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
