const express = require('express');
const { protect } = require('../middlewares/auth');
const { getMyCompanyDetails,singleCompanyDetails,getComapnyDetailsWithProductNameAndCompanyName, getStatutory,getAllCompanyDetails } = require('../controllers/RegisterComapnyFree'); 
const { getAllBuyFaq, getAllSellerFaq, getAllMainSlider, getAllCompanySlider,getAllCounteryWeWillDeal,getAllContent,getTestinomial,getAllSalesSlider, getAllLeads, getAllFetureProducts, getSingleProducts } = require('../controllers/Content');
const { PostRequirementAll,CallBackAll, UserPostRequirementAll, userPostRequirementsUpdate, UserPostRequirementDelete } = require('../controllers/postController');

const router = express.Router();

// Route to handle registration logic
router.get("/getAllCompanyDetails",getAllCompanyDetails)
router.get("/singleCompanyDetails/:companyId",singleCompanyDetails)

router.post('/getMyCompanyDetails', protect, getMyCompanyDetails);
router.get('/getBuyerFaq', getAllBuyFaq);
router.get('/getSellerFaq', getAllSellerFaq);
router.get('/allMainSlider', getAllMainSlider);
router.get('/Company/getAllCompanySlider', getAllCompanySlider);
router.get('/Company/getAllCounteryWeWillDeal', getAllCounteryWeWillDeal);
router.get('/body/content', getAllContent);
router.get('/body/Testinomial', getTestinomial);
router.get('/PostRequirementAll', PostRequirementAll);
router.get('/userPostRequirementAll',protect, UserPostRequirementAll);
router.put('/userPostRequirementUpdate/:postId',protect, userPostRequirementsUpdate);
router.delete('/userPostRequirementDelete/:postId',protect, UserPostRequirementDelete);
router.get('/CallBackAll', CallBackAll);
router.get('/allsalesSlider', getAllSalesSlider);
router.get('/allLeads', getAllLeads);
router.get('/getAllFetureProducts', getAllFetureProducts);
router.get('/getAllFetureProducts/:productid', getSingleProducts);
router.get('/getStatutory',protect, getStatutory);

router.get('/company/:input',getComapnyDetailsWithProductNameAndCompanyName);


module.exports = router;
