const express = require('express');

const { protect } = require('../middlewares/auth');
const { contentAdd, TestimonialAdd, Addfaq, BuyupdateFAQ, addSlider, updateSlider, deleteSlider, BuydeleteFAQ, SellerAddfaq, SellerupdateFAQ, DeleteCountry, SellerdeleteFAQ, UpdateCountry, AddCountryWeSupplly, CompanyaddSlider, CompanyupdateSlider, CompanydeleteSlider, SalesupdateSlider, SalesdeleteSlider, addLeads, updateleads, deleteLeads, addFetureProduct, updateFetureProduct, deleteFetureProduct } = require('../controllers/Content');
const { updateContent, deleteContent } = require('../controllers/Content');
const { updateTestimonial, deleteTestimonial } = require('../controllers/Content');
const { updateFAQ, deleteFAQ } = require('../controllers/Content');
const BuyerFAQ = require('../modals/BuyerModalFaq');
const SalesSlider = require('../modals/SalesSlides');

const router = express.Router();

// Add routes for creating entities
router.post('/add-content', contentAdd);
router.post('/add-testimonial', protect, TestimonialAdd);
router.post('/add-faq', protect, Addfaq);

// Add routes for updating and deleting entities
router.put('/update-content/:contentId', updateContent);
router.delete('/delete-content/:contentId', deleteContent);

router.put('/update-testimonial/:testimonialId', protect, updateTestimonial);
router.delete('/delete-testimonial/:testimonialId', protect, deleteTestimonial);

router.put('/update-faq/:faqId', protect, updateFAQ);
router.delete('/delete-faq/:faqId', protect, deleteFAQ);

router.post('/buyer/add-faq', BuyerFAQ);
router.put('/buyer/update-faq/:faqId', BuyupdateFAQ);
router.delete('/buyer/delete-faq/:faqId', BuydeleteFAQ);

router.post('/seller/add-faq', SellerAddfaq);
router.put('/seller/update-faq/:faqId', SellerupdateFAQ);
router.delete('/seller/delete-faq/:faqId', SellerdeleteFAQ);

// Route to update add delete a country
router.post('/add-countery/NameAndFlag', AddCountryWeSupplly);
router.put('/update-country/:countryId', UpdateCountry);
router.delete('/delete-country/:countryId', DeleteCountry);


// Route to add a new slider item
router.post('/add-slider', addSlider);
router.put('/update-slider/:sliderId', updateSlider);
router.delete('/delete-slider/:sliderId', deleteSlider);

// Route to add a new Feture Product item
router.post('/add-Product', addFetureProduct);
router.put('/update-Product/:fetureId', updateFetureProduct);
router.delete('/deleteFetureProduct/:fetureId', deleteFetureProduct);

// Route to add a new slider item
router.post('/comapny/add-slider', CompanyaddSlider);
router.put('/comapny/update-slider/:sliderId', CompanyupdateSlider);
router.delete('/comapny/delete-slider/:sliderId', CompanydeleteSlider);

// Route to add a new sales slider item
router.post('/sales-slider', SalesSlider);
router.put('/sales-update-slider/:sliderId', SalesupdateSlider);
router.delete('/sales-delete-slider/:sliderId', SalesdeleteSlider);

// Route to add a new leads slider item

router.post('/add-leads', addLeads);
router.put('/leadsUpdate/:leadsId', updateleads);
router.delete('/leads-delet/:leadsId', deleteLeads);


module.exports = router;
