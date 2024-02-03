const express = require('express');
const { protect } = require('../middlewares/auth');
const {categoryController,getCategory,updateCategory,deleteACatagory,deleteAll,singleProduct} = require('../controllers/categoryController')
const {
    RegisterCompany,
    verifyOtp,
    addCompanyDetails,
    BranchDetails,
    BussinessProducts,
    updateCompanyDetails,
    updateBranchDetails,
    updateBusinessProducts,
    resendOtp,
    Login,
    addStatutory,
    getBussinessProduct,
    deleteBussinessProducts
} = require('../controllers/RegisterComapnyFree');

const { PostRequirement, getACallBack, anySearch, getCompanyDetailsById, createFakeBuyers, getFakeBuyers, deleteFakeBuyers, anyFeatureProducts } = require('../controllers/postController');



const router = express.Router();

// Route to handle registration logic
router.post('/Register', RegisterCompany);
router.post('/Login', Login);
router.post('/verify', verifyOtp);
router.post('/resend-otp', resendOtp); // Add route for resending OTP
router.post('/add-companydetails', protect, addCompanyDetails);
router.post('/make-a-post',protect,PostRequirement);

router.post('/callback',getACallBack);

router.post('/add-BranchDetails', protect, BranchDetails);
router.post('/add-Product', protect, BussinessProducts);
router.get("/getBussinessProduct",protect,getBussinessProduct)
router.post('/add-addStatutory', protect, addStatutory);
router.delete("/deleteBussinessProducts/:productId",protect,deleteBussinessProducts)
// Add routes for updating entities
router.put('/update-companydetails', protect, updateCompanyDetails);
router.put('/update-branchdetails', protect, updateBranchDetails);
router.put('/update-businessproducts/:productId', protect, updateBusinessProducts);


router.get("/anySearch/:anyInput",anySearch)
router.get("/companydetails/:companyId",getCompanyDetailsById)

router.get("/buyers/:anyinput",anyFeatureProducts)

router.post('/create-buyers',createFakeBuyers)
router.get('/get-buyers',getFakeBuyers)
router.delete('/delete-buyers/:buyerId',deleteFakeBuyers)


router.post('/createcategory',categoryController)
router.post('/updateCategory/:id',updateCategory)
router.get('/getCategory',getCategory)
router.get('/singleProduct/:id',singleProduct)
router.delete('/deleteACatagory/:id',deleteACatagory)
router.delete('/deleteAll',deleteAll)


module.exports = router;
