const OtpModal = require("../modals/OtpModal");
const Registration = require("../modals/registrationModal");
const sendToken = require("../utils/SendToken");
const sendEmail = require("../utils/SendMail");
const generateOTP = require("../utils/genrateOtp");
const bcrypt = require('bcrypt')
const CompanyDetails = require("../modals/ComapnyDetails");
const ProductModel = require("../modals/ProductDetails")
const Statutory = require("../modals/StautaryModels")
//create a company registration

exports.RegisterCompany = async (req, res) => {
  try {
    const { YourName, CompanyName, Mobilenumber, Email,Password, CompanyCity } = req.body;

    const missingFields = [];

    // Check each field and add to missingFields if empty
    if (!YourName) missingFields.push('YourName');
    if (!CompanyName) missingFields.push('CompanyName');
    if (!Mobilenumber) missingFields.push('Mobilenumber');
    if (!Email) missingFields.push('Email');
    if (!CompanyCity) missingFields.push('CompanyCity');
    if (!Password) missingFields.push('Password');

    if (missingFields.length > 0) {
      return res.status(401).json({
        success: false,
        error: 'Please fill the following fields: ' + missingFields.join(', '),
      });
    }
    //hasPassword
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(Password, saltRounds);

    // Generate OTP
    const generatedOTP = generateOTP();
    console.log("Generated OTP:", generatedOTP);

    // Create a new registration entry
    const newRegistration = new Registration({
      YourName,
      CompanyName,
      Mobilenumber,
      Email,
      CompanyCity,
      Password: hashPassword
    });

    // Save registration entry to the database
    const savedRegistration = await newRegistration.save();

    // Create a new OTP entry
    const newOtp = new OtpModal({
      Otp: generatedOTP,
    });

    // Save OTP entry to the database
    const savedOtp = await newOtp.save();

    // Attach the OTP to the registration entry
    savedRegistration.otp = savedOtp._id;
    await savedRegistration.save();

    // Send OTP to the user
    const emailOptions = {
      email: Email,
      subject: "OTP for Registration",
      message: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Company Registration Successful</title>
          </head>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h2 style="color: #333;">Dear ${YourName},</h2>
              <p>Congratulations! Your company, ${CompanyName}, has been successfully registered on DevAnish website.</p>
              <h3>About ${YourName}:</h3>
              <p>[Add a brief description about yourself, your skills, and experience as a developer.]</p>
              <h3>About DevAnish Website:</h3>
              <p>[Provide detailed information about DevAnish website, its features, and how it benefits users. You can include links to relevant pages.]</p>
              <h3>OTP for Verification:</h3>
              <p>Your OTP for verification is: ${generatedOTP}</p>
              <p>Please use this OTP to complete the registration process.</p>
              <p>Thank you for choosing DevAnish! If you have any questions or need assistance, feel free to reach out to us.</p>
              <p>Best regards,<br>${YourName}<br>DevAnish Team</p>
            </div>
          </body>
          </html>`,
    };

    await sendEmail(emailOptions);

    // Only send the token, remove the res.status(200).json()
    
    // return res.status(200).json({
    //   success: true,
   
    //   message: Register Success Verify Otp${generatedOTP}
    // });
    sendToken(savedRegistration, 200, res,generatedOTP);
  } catch (error) {
    if (error.code === 11000) {
      // Extract duplicate key information from the error
      const duplicateKeyInfo = Object.keys(error.keyValue)[0];
    

      return res.status(400).json({
        success: false,
        error: "Error",
      });
    }


    console.error("Error registering company:", error);
    res.status(500).json({
      success: false,
      message: "Error registering company",
      error: error.message,
    });
  }
};


exports.Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Check if any field is empty
    if (!Email || !Password) {
      return res.status(401).json({
        success: false,
        error: 'Please provide all fields',
      });
    }

    // Find the user by email
    const user = await Registration.findOne({ Email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password',
      });
    }

    // If the email and password are correct, send a token
    sendToken(user, 200, res);

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and otp",
      });
    }

    // Check if the provided OTP is valid
    const otpEntry = await OtpModal.findOne({ Otp: otp });

    if (!otpEntry) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if the OTP is associated with the provided email
    const registrationEntry = await Registration.findOne({ Email: email, otp: otpEntry._id });

    if (!registrationEntry) {
      return res.status(401).json({
        success: false,
        message: "Email and OTP do not match",
      });
    }

    // Mark the email as verified
    registrationEntry.isEmailVerifed = true;
    registrationEntry.otp = undefined
    await registrationEntry.save();

    // Delete the used OTP entry
    await OtpModal.findByIdAndDelete(otpEntry._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: registrationEntry
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};
exports.resendOtp = async (req, res) => {
  try {
    // Extract email from the request body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    // Check if the email is associated with a registration entry
    const registrationEntry = await Registration.findOne({ Email: email });

    if (!registrationEntry) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Check if the email is already verified
    if (registrationEntry.isEmailVerifed) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate a new OTP
    const generatedOTP = generateOTP();
    console.log("Generated OTP:", generatedOTP);

    // Update the existing OTP entry
    const existingOtpEntry = await OtpModal.findById(registrationEntry.otp);
    existingOtpEntry.Otp = generatedOTP;
    await existingOtpEntry.save();

    // Send the new OTP to the user
    const emailOptions = {
      email: email,
      subject: "New OTP for Registration",
      message: Your new OTP for registration is: ${generatedOTP},
    };

    await sendEmail(emailOptions);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error resending OTP",
      error: error.message,
    });
  }
};


exports.addCompanyDetails = async (req, res) => {
  try {
    // Extract company details from the request body
    const {
      companyName,
      companyAddress,
      companyWebsite,
      companyState,
      companyCity,
      companyPincode,
      primaryBusiness,
      products,
      Gst,
    } = req.body;

    // Check if user information is attached to the request
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    // Assuming you have the user ID available in req.user
    const userId = req.user.id;

    // Check if the user already has company details
    const existingCompanyDetails = await CompanyDetails.findOne({ user: userId });

    if (existingCompanyDetails) {
      // User already has company details, handle accordingly
      return res.status(400).json({
        success: false,
        message: "Company details already exist for this user",
        existingCompanyDetails,
      });
    }

    // Create a new CompanyDetails document
    const newCompanyDetails = new CompanyDetails({
      companyName,
      companyAddress,
      companyWebsite,
      companyState,
      companyCity,
      companyPincode,
      primaryBusiness,
      products,
      Gst,
      user: userId,
    });

    // Save the new CompanyDetails document to the database
    const savedCompanyDetails = await newCompanyDetails.save();

    res.status(201).json({
      success: true,
      message: "Company details added successfully",
      companyDetails: savedCompanyDetails,
    });
  } catch (error) {
    console.error("Error adding company details:", error);
    res.status(500).json({
      success: false,
      message: "Error adding company details",
      error: error.message,
    });
  }
};

exports.updateCompanyDetails = async (req, res) => {
  try {
    // Extract updated company details from the request body
    const updatedCompanyDetails = req.body;
    console.log(req.body)
    // Check if user information is attached to the request
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    // Find and update the company details associated with the user ID
    const updatedCompanyDetail = await CompanyDetails.findOneAndUpdate({ user: req.user.id }, updatedCompanyDetails, { new: true });

    res.status(200).json({
      success: true,
      message: 'Company details updated successfully',
      companyDetails: updatedCompanyDetail,
    });
  } catch (error) {
    console.error('Error updating company details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company details',
      error: error.message,
    });
  }
};



exports.BranchDetails = async (req, res) => {
  try {
    const { Division, Contactperson, Country, city, Address, pincode, contactno, companyState } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    // Find the company details associated with the user ID
    const companyDetails = await CompanyDetails.findOne({ user: req.user.id });

    if (!companyDetails) {
      return res.status(404).json({
        success: false,
        message: 'Company details not found for the user.',
      });
    }

    // Check if BranchDetails field exists, if not, create it
    if (!companyDetails.BranchDetails) {
      companyDetails.BranchDetails = [];
    }

    // Add the new branch details
    companyDetails.BranchDetails.push({
      Division,
      Contactperson,
      Country,
      companyState,
      city,
      Address,
      pincode,
      contactno,
    });

    // Save the updated company details
    const savedCompanyDetails = await companyDetails.save();

    res.status(201).json({
      success: true,
      message: 'Branch details added successfully',
      companyDetails: savedCompanyDetails,
    });
  } catch (error) {
    console.error('Error adding Branch details:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding Branch details',
      error: error.message,
    });
  }
};
exports.updateBranchDetails = async (req, res) => {
  try {
    // Extract additional branch details from the request body
    const { Division, Contactperson, Country, city, Address, pincode, contactno, companyState, ...updatedBranchDetails } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    // Find the company details associated with the user ID
    const companyDetails = await CompanyDetails.findOne({ user: req.user.id });

    if (!companyDetails) {
      return res.status(404).json({
        success: false,
        message: 'Company details not found for the user.',
      });
    }

    // Check if BranchDetails field exists, if not, create it
    if (!companyDetails.BranchDetails) {
      companyDetails.BranchDetails = [];
    }

    // Update the branch details
    companyDetails.BranchDetails = [{ Division, Contactperson, Country, city, Address, pincode, contactno, companyState, ...updatedBranchDetails }];

    // Save the updated company details
    const savedCompanyDetails = await companyDetails.save();

    res.status(200).json({
      success: true,
      message: 'Branch details updated successfully',
      companyDetails: savedCompanyDetails,
    });
  } catch (error) {
    console.error('Error updating branch details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating branch details',
      error: error.message,
    });
  }
};

exports.BussinessProducts = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized');
    }

    const { ProductName, ProductCategory, ProductImage, ProductPrice, BusinessType, ProductStatus, Description } = req.body;
    console.log(req.body)
    // Validate required fields


    // Create a new product
    const newProduct = new ProductModel({
      ProductName,
      ProductCategory,
      ProductImage,
      ProductPrice,
      BusinessType,
      ProductStatus: ProductStatus || false, // Default to false if not provided
      Description,
      user: req.user.id
    });

    console.log("newProduct", newProduct)

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    // Return the newly created product in the response
    console.log(savedProduct)

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      // productDetails: savedProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message,
    });
  }
};

exports.updateBusinessProducts = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { ProductName, ProductCategory, ProductImage, ProductPrice, BusinessType, ProductStatus, Description } = req.body;

    // Find the product by ID
    const existingProduct = await ProductModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the authenticated user owns the product
    if (existingProduct.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    // Update the product properties conditionally
    if (ProductName) existingProduct.ProductName = ProductName;
    if (ProductCategory) existingProduct.ProductCategory = ProductCategory;
    if (ProductImage) existingProduct.ProductImage = ProductImage;
    if (ProductPrice) existingProduct.ProductPrice = ProductPrice;
    if (BusinessType) existingProduct.BusinessType = BusinessType;
    if (ProductStatus !== undefined) existingProduct.ProductStatus = ProductStatus;
    if (Description) existingProduct.Description = Description;

    // Save the updated product to the database
    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      productDetails: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};


exports.deleteBussinessProducts = async (req, res) => {
  try {
    // Extract the product ID from the request parameters
    const productId = req.params.productId;

    // Check if the product exists
    const existingProduct = await ProductModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the authenticated user owns the product
    if (!existingProduct.user || existingProduct.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    // Delete the product
    await existingProduct.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

exports.addStatutory = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      PanNo,
      TanNo,
      CinNo,
      BankName,
      BranchName,
      AccountNumber,
      BankIfsc,
    } = req.body;

    // Assuming you have the user ID available in req.user
    const userId = req.user.id;
    console.log(userId)

    if(!userId){
      res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    // Create a new Statutory document
    const newStatutory = new Statutory ({
      PanNo,
      TanNo,
      CinNo,
      BankName,
      BranchName,
      AccountNumber,
      BankIfsc,
      user:userId
    });

    // Save the new Statutory document to the database
    const savedStatutory = await newStatutory.save();
    console.log(savedStatutory)
    // Respond with the saved Statutory details
    res.status(201).json(savedStatutory);
  } catch (error) {
    console.error("Error adding statutory details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get Function for all Funtcion ==============================================================================================================
exports.getStatutory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(403).json({
        message: "Unauthenticated User!"
      });
    }
    // Find the statutory information for the authenticated user
    const userStatutory = await Statutory.findOne({ user: userId });

    if (!userStatutory) {
      // If user statutory information is not found, send 404 Not Found response
      res.status(404).json({
        message: "Statutory information not found for the user",
      });
    } else {
      // If user statutory information is found, send it in the response
      res.status(200).json({
        message: "Statutory information retrieved successfully",
        statutoryInfo: userStatutory,
      });
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error in getStatutory:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



exports.getMyCompanyDetails = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    // Find the registration details associated with the user ID
    const registrationDetails = await Registration.findOne({ _id: userId });

    // Find the company details associated with the user ID
    const companyDetails = await CompanyDetails.findOne({ user: userId });

    if (!companyDetails) {
      return res.status(404).json({
        success: false,
        message: "Company details not found for the user.",
      });
    }

    // Find the business products associated with the user ID
    const businessProducts = await ProductModel.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      registrationDetails,
      companyDetails,
      businessProducts,
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user details",
      error: error.message,
    });
  }
};


exports.getAllCompanyDetails = async (req, res) => {
  try {
    // Get all companies from the database
    const companies = await CompanyDetails.find();

    // Check if there are any companies
    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: 'No companies found' });
    }

    // Return the list of companies
    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.singleCompanyDetails = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Check if the company with the given ID exists
    const company = await CompanyDetails.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // If the company is found, send its details in the response
    res.status(200).json({ company });
  } catch (error) {
    console.error('Error fetching single company details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getComapnyDetailsWithProductNameAndCompanyName = async (req, res) => {
  try {
    const input = req.params.input.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Assuming you have a CompanyDetails model with the necessary fields and relationships
    const companyDetails = await CompanyDetails.findOne({
      $or: [
        { companyName: { $regex: input, $options: 'i' } }, // Case-insensitive regex match for companyName
        { products: { $in: [input] } }, // Check if input is in the products array
      ],
    }).exec();

    if (!companyDetails) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Return the details of the matching company
    res.json({ companyDetails });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getBussinessProduct = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send("You are not authorized");
    }

    // Retrieve user ID from the authenticated user
    const userId = req.user.id;

    // Find products associated with the user
    const userProducts = await ProductModel.find({ user: userId });

    if (!userProducts || userProducts.length === 0) {
      // If no products are found for the user, you might want to handle this case
      return res.status(404).json({ message: 'No products found for the user' });
    }

    // Return the user's products in the response
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products: userProducts,
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message,
    });
  }
};
