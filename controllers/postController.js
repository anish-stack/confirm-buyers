const PostBuyModal = require('../modals/PostBuyreq')
const CallBack = require('../modals/getCallBack')
const Registration = require("../modals/registrationModal");
const CompanyDetails = require("../modals/ComapnyDetails");
const ProductModel = require("../modals/ProductDetails")
const FetureProduct = require('../modals/FetureProduct')
const NodeCache = require('node-cache')
const cache = new NodeCache();

const BuyerFake = require("../modals/FakeBuyers");
const { handleCaching } = require('../utils/handleCaching');
const sendMail = require('../utils/SendMail');
const BuyerModal = require('../modals/BuyerModalCallback');
const SupplierModal = require('../modals/SupplierModalCallBack');
exports.PostRequirement = async (req, res) => {
    try {
        // Check if user information is attached to the request
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized');
        }

        // Assuming you have the user ID available in req.user
        const userId = req.user.id;

        // Check if the user is valid
        const checkUserisValidOrNot = await Registration.findById(userId);
        if (!checkUserisValidOrNot) {
            return res.status(401).json({
                success: false,
                message: 'User is not valid or not found.',
            });
        }

        // Use destructuring directly in the function parameters
        const { ProductName, Qunatity, Category, TypeOfPacking, Message } = req.body;
        // Create a new document using the PostBuy model
        const newPostRequirement = new PostBuyModal({
            ProductName, Qunatity, Category, TypeOfPacking, Message,
            user: userId, // Assuming you want to associate the post with the user
        });

        // Save the new document to the database
        const savedPostRequirement = await newPostRequirement.save();
        console.log("savedPostRequirement", savedPostRequirement);

        res.status(201).json({
            success: true,
            message: 'Requirement posted successfully',
            postRequirementDetails: savedPostRequirement,
        });
    } catch (error) {
        console.error('Error posting requirement:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting requirement',
            error: error.message,
        });
    }
};
exports.getACallBack = async (req, res) => {
    try {
        // console.log(req.body)
        const { YourName, Number, YourProduct, YourSuitableTime, Email } = req.body;

   
        // Create a new document using the CallBack model
        const newCallBack = new CallBack({
            YourName,
            Number,
            YourProduct,
            YourSuitableTime,
            Email
        });
// console.log(newCallBack)
        const options = {
            email: Email,
            subject:"Thanks For Filling Contact Form",
            message:`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission</title>
              <style>
                /* Inline CSS styles */
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .image-container {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .message {
                  text-align: center;
                }
                .message p {
                  margin-bottom: 10px;
                }
                .message ul {
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  text-align: left;
                }
                .message ul li {
                  font-size: 16px;
                  color: #333;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Filling the Contact Form</h1>
                </div>
                <div class="image-container">
                  <img src="https://i.ibb.co/Zh5DfPz/you-your-attention-sign-illustration-23-2150305772.jpg" alt="Image" style="max-width: 100%; height: auto;">
                </div>
                <div class="message">
                <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 20px;">Dear ${YourName},</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Thank you for reaching out to us. We appreciate your interest in our products.</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Here are the details you provided:</p>
                <ul style="list-style: none; padding: 0; margin: 0; text-align: left; margin-bottom: 15px;">
                    <li>Contact Number: ${Number}</li>
                    <li>Product: ${YourProduct}</li>
                    <li>Suitable Time: ${YourSuitableTime}</li>
                  </ul>
                  <p>We will get back to you as soon as possible.</p>
                  <p>Best regards,</p>
                  <p>DGMT .In PVT.LTD</p>
                </div>
              </div>
            </body>
            </html>
            `
        }
        // Save the new document to the database
         await sendMail(options)
        const savedCallback = await newCallBack.save();
        // Invalidate cache for 'allCallBack'
        cache.del('allCallBack');
        res.status(201).json({
            success: true,
            message: 'Contact in Your Suitable times',
            Callback: savedCallback,
        });
    } catch (error) {
        console.error('Error posting callback:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting callback',
            error: error.message,
        });
    }
};
exports.getASupplierCallBack = async (req, res) => {
    try {
        // console.log(req.body)
        const { YourName, Number, YourProduct, YourSuitableTime, Email } = req.body;

   
        // Create a new document using the CallBack model
        const newCallBack = new SupplierModal({
            YourName,
            Number,
            YourProduct,
            YourSuitableTime,
            Email
        });
// console.log(newCallBack)
        const options = {
            email: Email,
            subject:"Thanks supplier For Filling Contact Form",
            message:`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission</title>
              <style>
                /* Inline CSS styles */
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .image-container {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .message {
                  text-align: center;
                }
                .message p {
                  margin-bottom: 10px;
                }
                .message ul {
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  text-align: left;
                }
                .message ul li {
                  font-size: 16px;
                  color: #333;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank supplier💁‍♂️ for Filling the Contact Form</h1>
                </div>
                <div class="image-container">
                  <img src="https://i.ibb.co/LhwKCKG/11667278-20945983.jpg" alt="Image" style="max-width: 100%; height: auto;">
                </div>
                <div class="message">
                <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 20px;">Dear supplier ${YourName},</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Thank you for reaching out to us. We appreciate your interest in our products.</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Here are the details you provided:</p>
                <ul style="list-style: none; padding: 0; margin: 0; text-align: left; margin-bottom: 15px;">
                    <li>Contact Number: ${Number}</li>
                    <li>Product: ${YourProduct}</li>
                    <li>Suitable Time: ${YourSuitableTime}</li>
                  </ul>
                  <p>We will get back to you as soon as possible.</p>
                  <p>Best regards,</p>
                  <p>DGMT .In PVT.LTD</p>
                </div>
              </div>
            </body>
            </html>
            `
        }
        // Save the new document to the database
         await sendMail(options)
        const savedCallback = await newCallBack.save();
        // Invalidate cache for 'allCallBack'
        cache.del('allCallBack');
        res.status(201).json({
            success: true,
            message: 'Contact in Your Suitable times',
            Callback: savedCallback,
        });
    } catch (error) {
        console.error('Error posting callback:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting callback',
            error: error.message,
        });
    }
};

exports.getABuyerCallBack = async (req, res) => {
    try {
        // console.log(req.body)
        const { YourName, Number, YourProduct, YourSuitableTime, Email } = req.body;

   
        // Create a new document using the CallBack model
        const newCallBack = new BuyerModal({
            YourName,
            Number,
            YourProduct,
            YourSuitableTime,
            Email
        });
// console.log(newCallBack)
        const options = {
            email: Email,
            subject:"Thanks Buyer For Filling Contact Form",
            message:`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission</title>
              <style>
                /* Inline CSS styles */
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .image-container {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .message {
                  text-align: center;
                }
                .message p {
                  margin-bottom: 10px;
                }
                .message ul {
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  text-align: left;
                }
                .message ul li {
                  font-size: 16px;
                  color: #333;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank Buyer for Filling the Contact Form</h1>
                </div>
                <div class="image-container">
                  <img src="https://i.ibb.co/2cLKFWq/12083598-Wavy-Bus-26-Single-03.jpg" alt="Image" style="max-width: 100%; height: auto;">
                </div>
                <div class="message">
                <p style="font-size: 18px; color: #333; font-weight: bold; margin-bottom: 20px;">Dear Buyer ${YourName},</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Thank you for reaching out to us. We appreciate your interest in our products.</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Here are the details you provided:</p>
                <ul style="list-style: none; padding: 0; margin: 0; text-align: left; margin-bottom: 15px;">
                    <li>Contact Number: ${Number}</li>
                    <li>Product: ${YourProduct}</li>
                    <li>Suitable Time: ${YourSuitableTime}</li>
                  </ul>
                  <p>We will get back to you as soon as possible.</p>
                  <p>Best regards,</p>
                  <p>DGMT .In PVT.LTD</p>
                </div>
              </div>
            </body>
            </html>
            `
        }
        // Save the new document to the database
         await sendMail(options)
        const savedCallback = await newCallBack.save();
        // Invalidate cache for 'allCallBack'
        cache.del('allCallBack');
        res.status(201).json({
            success: true,
            message: 'Contact in Your Suitable times',
            Callback: savedCallback,
        });
    } catch (error) {
        console.error('Error posting callback:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting callback',
            error: error.message,
        });
    }
};

//=============================================================================================================================
exports.PostRequirementAll = async (req, res) => {
    await handleCaching('allPostRequirement', PostBuyModal, 'All PostRequirement retrieved successfully', 'Error fetching All PostRequirement', req, res);
};


exports.UserPostRequirementAll = async (req, res) => {
    try {

        const userId = req.user.id

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not logged in"
            })
        }

        await handleCaching(`userPostRequirement_${userId}`, PostBuyModal, 'All PostRequirement retrieved successfully', 'Error fetching All PostRequirement', req, res);
    } catch (error) {
        console.error("Error fetching All PostRequirement:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All PostRequirement",
            error: error.message,
        });
    }
}
exports.UserPostRequirementDelete = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            });
        }

        const postId = req.params.postId; // Assuming the parameter name is "postId"

        const userPostRequirement = await PostBuyModal.findOne({ _id: postId, user: userId });

        if (!userPostRequirement) {
            return res.status(404).json({
                success: false,
                message: "Post Requirement not found for the user"
            });
        }
        // Perform the delete operation
        await PostBuyModal.deleteOne({ _id: postId, user: userId });
        cache.del(`userPostRequirement_${userId}`);

        return res.status(200).json({
            success: true,
            message: "User's Post Requirement deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting User's Post Requirement:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting User's Post Requirement",
            error: error.message,
        });
    }
};
exports.userPostRequirementsUpdate = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            });
        }

        const postId = req.params.postId; // Assuming the parameter name is "postId"

        const userPostRequirement = await PostBuyModal.findOne({ _id: postId, user: userId });

        if (!userPostRequirement) {
            return res.status(404).json({
                success: false,
                message: "Post Requirement not found for the user"
            });
        }

        // Extract fields to be updated from the request body
        const { ProductAndService, Quantity, SupplierPreference, MultipleStates } = req.body;

        // Update the fields in the user's post requirement
        if (ProductAndService) {
            userPostRequirement.ProductAndService = ProductAndService;
        }

        if (Quantity) {
            userPostRequirement.Quantity = Quantity;
        }

        if (SupplierPreference) {
            userPostRequirement.SupplierPreference = SupplierPreference;
        }

        if (MultipleStates) {
            userPostRequirement.MultipleStates = MultipleStates;
        }

        // Save the updated post requirement
        await userPostRequirement.save();
        cache.del(`userPostRequirement_${userId}`);
        return res.status(200).json({
            success: true,
            message: "User's Post Requirement updated successfully",
            userPostRequirement,
        });
    } catch (error) {
        console.error("Error updating User's Post Requirement:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating User's Post Requirement",
            error: error.message,
        });
    }
};
exports.CallBackAll = async (req, res) => {
    try {
        // Check if data is in cache
        const cachedData = cache.get('allCallBack');
        if (cachedData) {
            console.log('All CallBack data served from cache');
            return res.status(200).json({
                success: true,
                message: "All CallBack retrieved successfully",
                AllCallBack: cachedData,
            });
        }

        // Data not in cache, fetch from the database
        const allCallBack = await CallBack.find();

        // Store data in cache with a time-to-live (TTL) of 1 hour (in seconds)
        cache.set('allCallBack', allCallBack, 3600);

        console.log('All CallBack data fetched from the database');
        res.status(200).json({
            success: true,
            message: "All CallBack retrieved successfully",
            AllCallBack: allCallBack,
        });
    } catch (error) {
        console.error("Error fetching All CallBack:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All CallBack",
            error: error.message,
        });
    }
};

exports.anySearch = async (req, res) => {
    try {
        const anyInput = req.params.anyInput;

        // Create a case-insensitive regex with at least 3 letters
        const regex = new RegExp(`\\b${anyInput}\\w*\\b`, 'i');

        // Check this regex in the CompanyDetails model for companyName
        const companyResults = await CompanyDetails.find({ companyName: { $regex: regex } });

        if (companyResults.length > 0) {
            // If there are matches in CompanyDetails, send the response
            return res.json({ results: companyResults, model: 'CompanyDetails' });
        }

        // If no matches in CompanyDetails, check in ProductModel for ProductName
        const productResults = await CompanyDetails.find({ products: { $regex: regex } });

        if (productResults.length > 0) {
            // If there are matches in ProductModel, send the response
            return res.json({ results: productResults, model: 'CompanyDetails' });
        }

        // If no matches in both models, send a generic response
        return res.json({
            success: false,
            message: 'No results found'
        });

    } catch (error) {
        console.error(error);
        // Handle the error appropriately (send an error response, log, etc.)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCompanyDetailsById = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Check in the CompanyDetails model
        const existCompany = await CompanyDetails.findById(companyId);

        if (!existCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // If the company is found, send the details in the response
        return res.status(200).json({ company: existCompany });
    } catch (error) {
        console.error('Error getting company details by ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.createFakeBuyers = async (req, res) => {
    try {
        const {
            companyName,
            companyCity,
            Date,
            Product,
            contactNumber,
        } = req.body;

        const newBuyerFake = new BuyerFake({
            companyName,
            companyCity,
            Date,
            Product,
            contactNumber,
        });

        const savedBuyerFake = await newBuyerFake.save();

        res.status(201).json(savedBuyerFake);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteFakeBuyers = async (req, res) => {
    try {
        const { buyerId } = req.params;

        const deletedBuyerFake = await BuyerFake.findByIdAndDelete(buyerId);

        if (!deletedBuyerFake) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        res.status(200).json({
            sucess: true,
            deletedBuyerFake
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getFakeBuyers = async (req, res) => {
    try {

        await handleCaching('fakeBuyers', BuyerFake, 'BuyerFake retrieved successfully', 'Error fetching Fake Buyers', req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




// search product accrding tot any input in fetautreproduct
exports.anyFeatureProducts = async (req, res) => {
    try {
        const { anyinput } = req.params;

        // Split the input into individual words
        const inputWords = anyinput.split(/\s+/);

        // Create an array of regular expressions for each word
        const regexArray = inputWords.map(word => new RegExp(`\\b${word}\\w*\\b`, 'i'));

        // Use $in with $and to match all words
        const productsByKeyword = await FetureProduct.find({ $and: regexArray.map(regex => ({ keyword: { $in: [regex] } })) });

        // If matches found by keyword, try to match in title
        if (productsByKeyword.length > 0) {
            const productsByTitle = await FetureProduct.find({ title: { $in: inputWords.map(word => new RegExp(`\\b${word}\\w*\\b`, 'i')) } });

            // If matches found by title, merge the arrays and filter out duplicates
            if (productsByTitle.length > 0) {
                const allProducts = [...productsByKeyword, ...productsByTitle];
                const uniqueProducts = allProducts.filter(
                    (product, index, self) => index === self.findIndex((p) => p.title === product.title)
                );

                return res.json(uniqueProducts);
            }

            return res.json(productsByKeyword);
        }

        // If no matches in keywords, try to match in title
        const productsByTitle = await FetureProduct.find({ title: { $in: inputWords.map(word => new RegExp(`\\b${word}\\w*\\b`, 'i')) } });

        // If no matches in title, return success: false and message
        if (productsByTitle.length === 0) {
            return res.json({ success: false, message: `No product found with Keyword ${anyinput}` });
        }

        return res.json(productsByTitle);
    } catch (error) {
        console.error('Error fetching feature products:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

