const Content = require('../modals/ContentModal')
const Testimonial = require('../modals/Testnomial')
const FAQ = require('../modals/faqModal')
const SellerFAQ = require('../modals/SellFaqModal')
const BuyerFaq = require('../modals/BuyerModalFaq')
const Countery = require("../modals/CounteryWeSupply")
const mainSlider = require('../modals/MainSliderModal');
const CompanySlider = require('../modals/ComapnySlider');
const SalesSlider = require('../modals/SalesSlides');
const leadsSchemas = require('../modals/leadsModal')
const PostBuySchema = require("../modals/PostBuyreq")
const FetureProduct = require('../modals/FetureProduct')
const NodeCache = require('node-cache')
const { handleCaching } = require('../utils/handleCaching')
const cache = new NodeCache();
exports.contentAdd = async (req, res) => {
    try {
        const { title, description, Secdescription, Thirddescription, list } = req.body;

        // Assuming you have updated your schema to include Secdescription and Thirddescription
        const newContent = new Content({
            title,
            description,
            Secdescription,
            Thirddescription,
            list,
        });

        // Save the new content to the database
        await newContent.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            message: 'Content added successfully',
            contentDetails: newContent,
        });
    } catch (error) {
        console.log('Error in content add', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }

}
exports.updateContent = async (req, res) => {
    try {
        const { contentId } = req.params; // Assuming you pass the contentId in the URL
        const { title, description, Secdescription, Thirddescription, list } = req.body;

        // Check if the content exists
        const existingContent = await Content.findById(contentId);
        if (!existingContent) {
            return res.status(404).json({
                success: false,
                message: 'Content not found',
            });
        }

        // Update the content fields
        existingContent.title = title;
        existingContent.description = description;
        existingContent.Secdescription = Secdescription;
        existingContent.Thirddescription = Thirddescription;
        existingContent.list = list;

        // Save the updated content to the database
        await existingContent.save();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'Content updated successfully',
            contentDetails: existingContent,
        });
    } catch (error) {
        console.log('Error in updating content', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.deleteContent = async (req, res) => {
    try {
        const { contentId } = req.params; // Assuming you pass the contentId in the URL

        // Check if the content exists
        const existingContent = await Content.findById(contentId);
        if (!existingContent) {
            return res.status(404).json({
                success: false,
                message: 'Content not found',
            });
        }

        // Remove the content from the database
        await existingContent.remove();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'Content deleted successfully',
        });
    } catch (error) {
        console.log('Error in deleting content', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.TestimonialAdd = async (req, res) => {
    try {
        const { review, reviewerName, reviewerWork } = req.body;

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized');
        }

        // Check if a testimonial already exists for the user
        const existingTestimonial = await Testimonial.findOne({ reviewerId: req.user.id });
        if (existingTestimonial) {
            return res.status(400).json({
                success: false,
                message: 'Testimonial already exists for this user',
            });
        }

        // Create a new testimonial
        const newTestimonial = new Testimonial({
            review,
            reviewerName,
            reviewerWork,
            reviewerId: req.user.id,
        });

        // Save the new testimonial to the database
        await newTestimonial.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            message: 'Testimonial added successfully',
            testimonialDetails: newTestimonial,
        });
    } catch (error) {
        console.log('Error in testimonial add', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.updateTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.params; // Assuming you pass the testimonialId in the URL
        const { review, reviewerName, reviewerWork } = req.body;

        // Check if the testimonial exists
        const existingTestimonial = await Testimonial.findById(testimonialId);
        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        // Update the testimonial fields
        existingTestimonial.review = review;
        existingTestimonial.reviewerName = reviewerName;
        existingTestimonial.reviewerWork = reviewerWork;

        // Save the updated testimonial to the database
        await existingTestimonial.save();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            testimonialDetails: existingTestimonial,
        });
    } catch (error) {
        console.log('Error in updating testimonial', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.deleteTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.params; // Assuming you pass the testimonialId in the URL

        // Check if the testimonial exists
        const existingTestimonial = await Testimonial.findById(testimonialId);
        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        // Remove the testimonial from the database
        await existingTestimonial.remove();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully',
        });
    } catch (error) {
        console.log('Error in deleting testimonial', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.Addfaq = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        // Check if the same question already exists
        const existingSameQuestion = await FAQ.findOne({ question });
        if (existingSameQuestion) {
            return res.status(400).json({
                success: false,
                message: 'FAQ with the same question already exists',
            });
        }

        // Create a new FAQ
        const newFAQ = new FAQ({
            question,
            answer,
            category,
        });

        // Save the new FAQ to the database
        await newFAQ.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            message: 'FAQ added successfully',
            faqDetails: newFAQ,
        });
    } catch (error) {
        console.log('Error in FAQ add', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.updateFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL
        const { question, answer, category } = req.body;

        // Check if the FAQ exists
        const existingFAQ = await FAQ.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Update the FAQ fields
        existingFAQ.question = question;
        existingFAQ.answer = answer;
        existingFAQ.category = category;

        // Save the updated FAQ to the database
        await existingFAQ.save();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            faqDetails: existingFAQ,
        });
    } catch (error) {
        console.log('Error in updating FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.deleteFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL

        // Check if the FAQ exists
        const existingFAQ = await FAQ.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Remove the FAQ from the database
        await existingFAQ.remove();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
        });
    } catch (error) {
        console.log('Error in deleting FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


exports.BuyAddfaq = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        // Check if the same question already exists
        const existingSameQuestion = await FAQ.findOne({ question });
        if (existingSameQuestion) {
            return res.status(400).json({
                success: false,
                message: 'FAQ with the same question already exists',
            });
        }

        // Create a new FAQ
        const newFAQ = new BuyerFaq({
            question,
            answer,
            category,
        });

        // Save the new FAQ to the database
        await newFAQ.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            message: 'FAQ added successfully',
            faqDetails: newFAQ,
        });
    } catch (error) {
        console.log('Error in FAQ add', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.BuyupdateFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL
        const { question, answer, category } = req.body;

        // Check if the FAQ exists
        const existingFAQ = await BuyerFaq.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Update the FAQ fields
        existingFAQ.question = question;
        existingFAQ.answer = answer;
        existingFAQ.category = category;

        // Save the updated FAQ to the database
        await existingFAQ.save();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            faqDetails: existingFAQ,
        });
    } catch (error) {
        console.log('Error in updating FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.BuydeleteFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL

        // Check if the FAQ exists
        const existingFAQ = await BuyerFaq.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Remove the FAQ from the database
        await existingFAQ.remove();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
        });
    } catch (error) {
        console.log('Error in deleting FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


exports.SellerAddfaq = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        // Check if the same question already exists
        const existingSameQuestion = await SellerFAQ.findOne({ question });
        if (existingSameQuestion) {
            return res.status(400).json({
                success: false,
                message: 'FAQ with the same question already exists',
            });
        }

        // Create a new FAQ
        const newFAQ = new FAQ({
            question,
            answer,
            category,
        });

        // Save the new FAQ to the database
        await newFAQ.save();

        // Send a success response back to the client
        res.status(201).json({
            success: true,
            message: 'FAQ added successfully',
            faqDetails: newFAQ,
        });
    } catch (error) {
        console.log('Error in FAQ add', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.SellerupdateFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL
        const { question, answer, category } = req.body;

        // Check if the FAQ exists
        const existingFAQ = await SellerFAQ.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Update the FAQ fields
        existingFAQ.question = question;
        existingFAQ.answer = answer;
        existingFAQ.category = category;

        // Save the updated FAQ to the database
        await existingFAQ.save();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            faqDetails: existingFAQ,
        });
    } catch (error) {
        console.log('Error in updating FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.SellerdeleteFAQ = async (req, res) => {
    try {
        const { faqId } = req.params; // Assuming you pass the faqId in the URL

        // Check if the FAQ exists
        const existingFAQ = await FSellerFAQAQ.findById(faqId);
        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found',
            });
        }

        // Remove the FAQ from the database
        await existingFAQ.remove();

        // Send a success response back to the client
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
        });
    } catch (error) {
        console.log('Error in deleting FAQ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// ======================================================================================================


exports.AddCountryWeSupplly = async (req, res) => {
    try {
        const { name, image } = req.body;

        // Check if name and image are provided
        if (!name || !image) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and image for the country.',
            });
        }

        // Create a new Countery document
        const newCountry = new Countery({
            name,
            image,
        });

        // Save the new country to the database
        const savedCountry = await newCountry.save();

        res.status(201).json({
            success: true,
            message: 'Country added successfully',
            countryDetails: savedCountry,
        });
    } catch (error) {
        console.log('Error in adding country', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.UpdateCountry = async (req, res) => {
    try {
        const { countryId } = req.params;
        const { name, image } = req.body;

        // Validate if countryId is a valid ObjectId
        if (!mongoose.isValidObjectId(countryId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid countryId',
            });
        }

        // Check if name and image are provided
        if (!name || !image) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and image for the country.',
            });
        }

        // Check if the country exists
        const existingCountry = await Countery.findById(countryId);
        if (!existingCountry) {
            return res.status(404).json({
                success: false,
                message: 'Country not found',
            });
        }

        // Update country details
        existingCountry.name = name;
        existingCountry.image = image;

        // Save the updated country to the database
        const updatedCountry = await existingCountry.save();

        res.status(200).json({
            success: true,
            message: 'Country updated successfully',
            countryDetails: updatedCountry,
        });
    } catch (error) {
        console.log('Error updating country', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

exports.DeleteCountry = async (req, res) => {
    try {
        const { countryId } = req.params;

        // Validate if countryId is a valid ObjectId
        if (!mongoose.isValidObjectId(countryId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid countryId',
            });
        }

        // Check if the country exists
        const existingCountry = await Countery.findById(countryId);
        if (!existingCountry) {
            return res.status(404).json({
                success: false,
                message: 'Country not found',
            });
        }

        // Remove the country from the database
        await existingCountry.remove();

        res.status(200).json({
            success: true,
            message: 'Country deleted successfully',
        });
    } catch (error) {
        console.log('Error deleting country', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// ==============================================================================================================

exports.addSlider = async (req, res) => {
    try {
        const { title, para, image } = req.body;


        // Create a new main slider item
        const newSlider = new mainSlider({
            title,
            para,
            image,
        });

        // Save the new slider item to the database
        const savedSlider = await newSlider.save();

        res.status(201).json({
            success: true,
            message: 'Slider item added successfully',
            sliderDetails: savedSlider,
        });
    } catch (error) {
        console.error('Error adding slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding slider item',
            error: error.message,
        });
    }
};

exports.updateSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL
        const { title, para, image } = req.body;

        // Check if the slider item exists
        const existingSlider = await mainSlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Update the slider item fields
        existingSlider.title = title;
        existingSlider.para = para;
        existingSlider.image = image;

        // Save the updated slider item to the database
        await existingSlider.save();

        res.status(200).json({
            success: true,
            message: 'Slider item updated successfully',
            sliderDetails: existingSlider,
        });
    } catch (error) {
        console.error('Error updating slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slider item',
            error: error.message,
        });
    }
};

exports.deleteSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL

        // Check if the slider item exists
        const existingSlider = await mainSlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Remove the slider item from the database
        await existingSlider.remove();

        res.status(200).json({
            success: true,
            message: 'Slider item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting slider item',
            error: error.message,
        });
    }
};

// =======================================================================================================================

exports.CompanyaddSlider = async (req, res) => {
    try {
        const { title, para, image } = req.body;

        // Validate required fields
        if (!title || !para || !image) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        // Create a new main slider item
        const newSlider = new CompanySlider({
            title,
            para,
            image,
        });

        // Save the new slider item to the database
        const savedSlider = await newSlider.save();

        res.status(201).json({
            success: true,
            message: 'Slider item added successfully',
            sliderDetails: savedSlider,
        });
    } catch (error) {
        console.error('Error adding slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding slider item',
            error: error.message,
        });
    }
};

exports.CompanyupdateSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL
        const { title, para, image } = req.body;

        // Check if the slider item exists
        const existingSlider = await CompanySlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Update the slider item fields
        existingSlider.title = title;
        existingSlider.para = para;
        existingSlider.image = image;

        // Save the updated slider item to the database
        await existingSlider.save();

        res.status(200).json({
            success: true,
            message: 'Slider item updated successfully',
            sliderDetails: existingSlider,
        });
    } catch (error) {
        console.error('Error updating slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slider item',
            error: error.message,
        });
    }
};

exports.CompanydeleteSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL

        // Check if the slider item exists
        const existingSlider = await CompanySlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Remove the slider item from the database
        await existingSlider.remove();

        res.status(200).json({
            success: true,
            message: 'Slider item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting slider item',
            error: error.message,
        });
    }
};

//=========================================================================================================================
exports.SalesaddSlider = async (req, res) => {
    try {
        const { title, para, image,DealMoney } = req.body;

        // Validate required fields
        if (!title || !para || !image) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        // Create a new main slider item
        const newSlider = new SalesSlider({
            title,
            para,
            image,
        });

        // Save the new slider item to the database
        const savedSlider = await newSlider.save();

        res.status(201).json({
            success: true,
            message: 'Slider item added successfully',
            sliderDetails: savedSlider,
        });
    } catch (error) {
        console.error('Error adding slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding slider item',
            error: error.message,
        });
    }
};

exports.SalesupdateSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL
        const { title, para, DealMoney,image } = req.body;

        // Check if the slider item exists
        const existingSlider = await SalesSlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Update the slider item fields
        existingSlider.title = title;
        existingSlider.para = para;
        existingSlider.image = image;

        // Save the updated slider item to the database
        await existingSlider.save();

        res.status(200).json({
            success: true,
            message: 'Slider item updated successfully',
            sliderDetails: existingSlider,
        });
    } catch (error) {
        console.error('Error updating slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slider item',
            error: error.message,
        });
    }
};

exports.SalesdeleteSlider = async (req, res) => {
    try {
        const { sliderId } = req.params; // Assuming you pass the sliderId in the URL

        // Check if the slider item exists
        const existingSlider = await SalesSlider.findById(sliderId);
        if (!existingSlider) {
            return res.status(404).json({
                success: false,
                message: 'Slider item not found',
            });
        }

        // Remove the slider item from the database
        await existingSlider.remove();

        res.status(200).json({
            success: true,
            message: 'Slider item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting slider item',
            error: error.message,
        });
    }
};

//=========================================================================================================================
exports.addLeads = async (req, res) => {
    try {
        const { productName, Date, DealMoney, CountryImageimage } = req.body;

        // Validate required fields
        if (!productName || !Date || !CountryImageimage) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the required fields',
            });
        }

        // Create a new leads item
        const newLeads = new leadsSchemas({
            productName,
            Date,
            DealMoney,
            CountryImageimage,
        });

        // Save the new leads item to the database
        const newLeadsAdd = await newLeads.save();

        res.status(201).json({
            success: true,
            message: 'New leads item added successfully',
            newLeadsAdd,
        });
    } catch (error) {
        console.error('Error adding new leads item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding new leads item',
            error: error.message,
        });
    }
};

exports.updateleads = async (req, res) => {
    try {
        const { leadsId } = req.params; // Assuming you pass the sliderId in the URL
        const { productName, Date,DealMoney,CountryImageimage } = req.body;

        // Check if the slider item exists
        const existingLeads = await leadsSchemas.findById(leadsId);
        if (!existingLeads) {
            return res.status(404).json({
                success: false,
                message: 'Leads item not found',
            });
        }

        // Update the Leads item fields
        existingLeads.productName = productName;
        existingLeads.Date = Date;
        existingLeads.DealMoney = DealMoney;
        existingLeads.CountryImageimage = CountryImageimage;


        // Save the updated Leads item to the database
        await existingLeads.save();

        res.status(200).json({
            success: true,
            message: 'Leads item updated successfully',
            LeadsDetails: existingLeads,
        });
    } catch (error) {
        console.error('Error updating slider item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slider item',
            error: error.message,
        });
    }
};

exports.deleteLeads = async (req, res) => {
    try {
        const { leadsId } = req.params; // Assuming you pass the sliderId in the URL

        // Check if the slider item exists
        const existingLeads = await leadsSchemas.findById(leadsId);
        if (!existingLeads) {
            return res.status(404).json({
                success: false,
                message: 'Leads item not found',
            });
        }

        // Remove the slider item from the database
        await existingLeads.remove();

        res.status(200).json({
            success: true,
            message: 'leads item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting leads item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting leads item',
            error: error.message,
        });
    }
};



//=============================================================================================================================


//=========================================================================================================================
exports.addFetureProduct = async (req, res) => {
    try {
        const {
            title,
            image,
            MinimumQuantity,
            Portofdispatch,
            Type,
            ProcessingTime,
            EstimatePricing,
            Packaging,
            PRODUCTS_DESCRIPTION,
            PRODUCTS_SPECIFICATION,
           userName,
           userMember,
           userPlace,
           keyword
        } = req.body;

        console.log('Request Body:', req.body); // Log the request body for debugging

        // Create a new FetureProduct instance
        const newFeture = new FetureProduct({
            title,
            image,
            MinimumQuantity,
            Portofdispatch,
            Type,
            ProcessingTime,
            EstimatePricing,
            Packaging,
            PRODUCTS_DESCRIPTION,
            PRODUCTS_SPECIFICATION,
            userName,
           userMember,
           userPlace,
           keyword
        });

        const newFetureAdd = await newFeture.save();

        res.status(201).json({
            success: true,
            message: 'New Feture product item added successfully',
            newFetureAdd,
        });
    } catch (error) {
        console.error('Error adding New Feture product item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding New Feture product item',
            error: error.message,
        });
    }
};

exports.getSingleProducts = async (req, res) => {
    try {
        const { productid } = req.params;
        const cacheKey = `singleProduct:${productid}`;

        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Single-Product-Details data served from cache');
            return res.status(200).json({
                success: true,
                message: 'Single-Product-Details retrieved successfully',
                product: JSON.parse(getSingleProducts),
            });
        }

        const product = await FetureProduct.findById(productid);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update cache with the retrieved product
        cache.set(cacheKey, product, 7200);

        res.status(200).json({
            success: true,
            message: 'Single-Product-Details retrieved successfully',
            product,
        });
    } catch (error) {
        console.error('Error in getSingleProduct:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.updateFetureProduct = async (req, res) => {
    try {
        const { fetureId } = req.params;
        const {
            title,
            image,
            MinimumQuantity,
            Portofdispatch,
            Type,
            ProcessingTime,
            EstimatePricing,
            Packaging,
            PRODUCTS_DESCRIPTION,
            PRODUCTS_SPECIFICATION,
            userName,
           userMember,
           userPlace
        } = req.body;

        const existingFeture = await FetureProduct.findById(fetureId);
        if (!existingFeture) {
            return res.status(404).json({
                success: false,
                message: 'Feture item not found',
            });
        }

        existingFeture.title = title;
        existingFeture.image = image;
        existingFeture.MinimumQuantity = MinimumQuantity;
        existingFeture.Portofdispatch = Portofdispatch;
        existingFeture.Type = Type;
        existingFeture.ProcessingTime = ProcessingTime;
        existingFeture.EstimatePricing = EstimatePricing;
        existingFeture.Packaging = Packaging;
        existingFeture.PRODUCTS_DESCRIPTION = PRODUCTS_DESCRIPTION;
        existingFeture.PRODUCTS_SPECIFICATION = PRODUCTS_SPECIFICATION;
        existingFeture.userName = userName;
        existingFeture.userPlace = userPlace;
        existingFeture.userMember = userMember;

        await existingFeture.save();
        cache.del('feuture-product');
        res.status(200).json({
            success: true,
            message: 'Feture product item updated successfully',
            existingFeture,
        });
    } catch (error) {
        console.error('Error updating Feture Product item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating Feture Product item',
            error: error.message,
        });
    }
};

exports.deleteFetureProduct = async (req, res) => {
    try {
        const { fetureId } = req.params;

        const existingFetureProduct = await FetureProduct.findById(fetureId);
        if (!existingFetureProduct) {
            return res.status(404).json({
                success: false,
                message: 'Feture Product item not found',
            });
        }

        await existingFetureProduct.deleteOne(); // Use deleteOne instead of remove
        cache.del('feture-product');
        res.status(200).json({
            success: true,
            message: 'Feture Product item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting Feture item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting Feture item',
            error: error.message,
        });
    }
};


//=============================================================================================================
exports.getAllBuyFaq = async (req, res) => {
    try {
        await handleCaching('All-Buyer-Faqs', BuyerFaq, 'All Buyer FAQs retrieved successfully', 'Error fetching Buyer FAQs', req, res);
    } catch (error) {
        console.error("Error handling caching for Buyer FAQs:", error);
        return res.status(500).json({
            success: false,
            message: "Error handling caching for Buyer FAQs",
            error: error.message,
        });
    }

    // The data is already retrieved and cached, so no need to query the database again.
    // If you reach this point, the cached data has already been sent in the response.

    // If you still want to query the database and send the result, you can remove the code above.
    // const allBuyFaq = await BuyerFaq.find();
    // res.status(200).json({
    //     success: true,
    //     message: "All buyer FAQs retrieved successfully",
    //     data: allBuyFaq,
    // });
};

exports.getAllSellerFaq = async (req, res) => {
    await handleCaching('All-Seller-Faqs', SellerFAQ, 'All Seller FAQs retrieved successfully', 'Error fetching Seller FAQs', req, res);
};

exports.getAllMainSlider = async (req, res) => {
    await handleCaching('All-Main-Slider', mainSlider, 'All Main Slider retrieved successfully', 'Error fetching Main Slider', req, res);
};

exports.getAllCompanySlider = async (req, res) => {
    await handleCaching('All-Company-Slider', CompanySlider, 'All Company Slider retrieved successfully', 'Error fetching Company Slider', req, res);
};

exports.getAllCounteryWeWillDeal = async (req, res) => {
    await handleCaching('All-Countery', Countery, 'All Company we Supply retrieved successfully', 'Error fetching Company', req, res);
};

exports.getAllContent = async (req, res) => {
    await handleCaching('All-Content', Content, 'All Content retrieved successfully', 'Error fetching Content', req, res);
};

exports.getTestinomial = async (req, res) => {
    await handleCaching('All-Testimonials', Testimonial, 'All Testimonials retrieved successfully', 'Error fetching Testimonials', req, res);
};

exports.getAllSalesSlider = async (req, res) => {
    await handleCaching('All-Sales-Slider', SalesSlider, 'All Sales Slider retrieved successfully', 'Error fetching Sales Slider', req, res);
};

exports.getAllLeads = async (req, res) => {
    try {
        const cachedData = cache.get('All-Leads');
        if (cachedData) {
            console.log('All-Leads data served from cache');
            return res.status(200).json({
                success: true,
                message: "All-Leads retrieved successfully",
                AllLeads: cachedData,
            });
        }
        const allLeads = await leadsSchemas.find();
        cache.set('All-Leads', JSON.stringify(allLeads), 3600);

        console.log('All Leads data fetched from the database');
        res.status(200).json({
            success: true,
            message: "All Leads retrieved successfully",
            allLeads,
        });
    } catch (error) {
        console.error("Error fetching All Leads:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All Leads",
            error: error.message,
        });
    }
};


exports.getAllFetureProducts = async(req,res)=>{
    try {


        const cachedData = cache.get('feuture-product');
        if (cachedData) {
            console.log('feuture-product data served from cache');
            return res.status(200).json({
                success: true,
                message: "feuture-product retrieved successfully",
                feutureProduct: JSON.parse(cachedData),
            });
        }
        const allFetureProduct = await FetureProduct.find();

        // Store data in cache with a time-to-live (TTL) of 1 hour (in seconds)
        cache.set('feuture-product', JSON.stringify(allFetureProduct), 3600);

        console.log('feuture-product data fetched from the database');
        res.status(200).json({
            success: true,
            message: "All FetureProduct retrieved successfully",
            allFetureProduct,
        });
    } catch (error) {
        console.error("Error fetching All FetureProduct:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All FetureProduct",
            error: error.message,
        });
    }
}
