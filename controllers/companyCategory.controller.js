const companyCategory=require("../models/companyCategory.model");
let userModel=require("../models/user.model");
const compSubCategory=require("../models/compSubCategories.model");

exports.getAddPage=(req,res)=>{
    let userId=req.userData.Id;
    userModel.findById(userId,(err,user)=>{
        if(err){
            res.json({error:err})
        }else{
            companyCategory.find({},(err,categories)=>{
                if(err){
                     res.json(err);
                }else{
                   //console.log(categories[0].subCategories)
                        res.render("compCategory",{
                            title :"Add Category",
                            user:user,
                            categories:categories,

                        });
                         
                        
                    }
            })
            
           
        }
    })
    
}


//Add New Category
exports.addCategory=(req,res)=>{
    let Category=new companyCategory({
        categoryTitle:req.body.categoryTitle,
      
    })
    Category.save((err,result)=>{
        if(err){
             res.json(err);
        }else{
             res.redirect('/category/addPage');
        }
    })
}


//Add New Sub Category
// exports.addSubCategory=(req,res)=>{
   
//     let parentCategory=req.body.parentCategory;
//     let catTitle=req.body.catTitle;
//     companyCategory.updateOne({_id:parentCategory},{$push:
//         {subCategories:{
//             subCatTitle:catTitle
//     }}},(err,data)=>{
//         if(err){
//              res.json(err);
//         }
//          res.redirect('/category/addPage');
//     })


// }