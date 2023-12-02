const express = require('express');
const { protect } = require('../middlewares/auth');
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
    addStatutory
} = require('../controllers/RegisterComapnyFree');
const { PostRequirement, getACallBack } = require('../controllers/postController');

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
router.post('/add-addStatutory', protect, addStatutory);

// Add routes for updating entities
router.put('/update-companydetails', protect, updateCompanyDetails);
router.put('/update-branchdetails', protect, updateBranchDetails);
router.put('/update-businessproducts', protect, updateBusinessProducts);

module.exports = router;
