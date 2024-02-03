const MainCategory = require('../modals/CategoryModal')

exports.categoryController = async (req, res) => {
    try {
        const { text,Category, subCategory } = req.body;

        if (!Category || !subCategory) {
            return res.status(400).json({ success: false, msg: "Please provide both Category and Sub-Category" });
        }

        const categoryss = {
            Category,
            subCategory
        };
        const category = new MainCategory({
            text,
            Category,
            subCategory
        });
        console.log(JSON.stringify(categoryss))
        await category.save();

        res.status(201).json(
            {
                success: true,
                msg: "Category created successfully",
                category
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};


exports.getCategory = async (req, res) => {
    try {
        const Categoryes = await MainCategory.find()

        if (!Categoryes.length > 0) {
            return res.status(404).json({ success: false, msg: "No Category" })
        }
        res.status(200).json(
            {
                success: true,
                msg: "Retervied all",
                Categoryes
            });

    } catch (error) {
        console.log(error)
    }
}

// find single product 

exports.singleProduct = async(req,res) =>{
    try {
        let id= req.params.id;
        const checkId = await MainCategory.findById(id)
        if(!checkId){
            return res.status(404).json({success :false ,msg:"Invalid ID"})
        }
        // const Products = await MainCategory.find({'main_cat':id}).populate('sub_cat')
        
      
        res.status(200).json({
          success:true,
          msg:'Retrieved Single Product',
          checkId
      })  
    } catch (error) {
        console.log(error)
    }
}

//update a specific category by id
exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        if(!id){
            return res.status(400).json({success :false ,msg:"The field is empty"})
        }
        const { Category, subCategory } = req.body
        

        const checkChategory = await MainCategory.findById(id)

        if (!checkChategory) {
            return res.status(404).json({ success: false, msg: `${Category} Not Found` })
        }

        if(Category){
            checkChategory.Category = Category
        }

        if(subCategory){
            checkChategory.subCategory = subCategory
        }

        const updateCategory = await checkChategory.save();
        console.log(updateCategory)

        res.status(200).json({
            success : true,
            msg : 'Updated'
        })

    } catch (error) {
        console.log(error)
    }
}


//Delete a specific categoryBy Id

exports.deleteACatagory = async (req,res)=>{
    try {
        const id = req.params.id

        const found = await MainCategory.findById(id);
        
        if(!found){
            return res.status(404).json({success:false , msg:'No Such Category is there in the Database.'})
        }

         await found.deleteOne()
    
        res.status(200).json({
           success :true,  
           msg : "Deleted Successfully"
       });
    } catch (error) {
     console.log(error)   
    }
}

// Delete all category

exports.deleteAll = async (req,res)=>{
    try {
        // const id = req.params.id

        const found = await MainCategory.find();
        
        if(!found.length > 0){
            return res.status(404).json({success:false , msg:'No Such Category is there in the Database.'})
        }

        //  await found.deleteMany()

        await MainCategory.deleteMany({ _id: { $in: found.map(doc => doc._id) } });
    
        res.status(200).json({
           success :true,  
           msg : "Deleted Successfully"
       });
    } catch (error) {
     console.log(error)   
    }
}
