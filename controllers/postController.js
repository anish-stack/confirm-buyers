const PostBuyModal = require('../modals/PostBuyreq')
const CallBack = require('../modals/getCallBack')
const Registration = require("../modals/registrationModal");

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
        const { ProductAndService, Qunatity, SupplierPreference, MultipleStates } = req.body;

        // // Validate the required fields
        // if (!ProductAndService || !Qunatity || !SupplierPreference) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'ProductAndService, Qunatity, and SupplierPreference are required fields.',
        //     });
        // }

        // Create a new document using the PostBuy model
        const newPostRequirement = new PostBuyModal({
            ProductAndService,
            Qunatity,
            SupplierPreference,
            MultipleStates,
            user: userId, // Assuming you want to associate the post with the user
        });

        // Save the new document to the database
        const savedPostRequirement = await newPostRequirement.save();
        console.log("savedPostRequirement",savedPostRequirement);

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
        const { YourName, ConactNumber, YourProduct, YourSuitableTime, Email } = req.body;

        // Validate the required fields
        if (!YourName || !ConactNumber || !YourProduct || !YourSuitableTime || !Email) {
            return res.status(400).json({
                success: false,
                message: 'Fill in all required fields.',
            });
        }

        // Create a new document using the CallBack model
        const newCallBack = new CallBack({
            YourName,
            ConactNumber,
            YourProduct,
            YourSuitableTime,
            Email
        });

        // Save the new document to the database
        const savedCallback = await newCallBack.save();

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
exports.PostRequirementAll = async (req,res)=>{
    try {
        const AllPostRequirement = await PostBuyModal.find();

        res.status(200).json({
            success: true,
            message: "All PostRequirement retrieved successfully",
            AllPostRequirement,
        });
    } catch (error) {
        console.error("Error fetching All PostRequirement:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All PostRequirement",
            error: error.message,
        });
    }
}

exports.UserPostRequirementAll = async (req,res)=>{
    try {

        const userId = req.user.id

        if(!userId){
            res.status(401).json({
                success:false,
                message:"User not logged in"
            })
        }


        const AllPostRequirement = await PostBuyModal.find({user:userId});

        res.status(200).json({
            success: true,
            message: "All PostRequirement retrieved successfully",
            AllPostRequirement,
        });
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
exports.CallBackAll = async (req,res)=>{
    try {
        const AllCallBack = await CallBack.find();

        res.status(200).json({
            success: true,
            message: "All CallBack retrieved successfully",
            AllCallBack,
        });
    } catch (error) {
        console.error("Error fetching All CallBack:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching All CallBack",
            error: error.message,
        });
    }
}