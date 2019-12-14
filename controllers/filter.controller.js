const companyModel=require("../models/company.model");
const userModel=require("../models/user.model");
const jobModel=require("../models/post.Model");
const url=require("url");
const country =require("../models/country.model");
const Countries=country.country_list;
const jwt=require("jsonwebtoken");
const companyCategories=require("../models/companyCategory.model");
const publicKey          = 'This Is Any Secret Key To Encrypt Mu Data';


//Search from Header
exports.headerFilter=(req,res)=>{
let searchtype= req.query.searchtype;

let user=req.UserRole;
let categories=req.categories;
if(searchtype=="Employiees"){
            const filter=req.query.jobTitle|| '';
        
            const filterQuery={
                jopTitle:new RegExp(filter,'i')
            }
        
            userModel.find(filterQuery,(err,data)=>{
                if(err){
                     res.redirect('/');
                }else{
                    res.render("userlisting",{
                        user:user,
                        title:"Employee Page",
                        Countries:Countries,
                        users:data
                    });
                }
            })
             
        
         }else if(searchtype=="Jobs"){
            const filter=req.query.jobTitle|| '';
        
            const filterQuery={
                title:new RegExp(filter,'i')
            }
           
               jobModel.find(filterQuery,(err,data)=>{
                   if(err){
                        res.redirect('/');
                   }else{
                       res.render("joblisting",{
                           user:user,
                           title:"Employee Page",
                           Countries:Countries,
                           users:data
                       });
                   }
               })
               
         }else if(searchtype=="Companies"){
        
            const filter=req.query.jobTitle|| '';
        
         const filterQuery={
            Name:new RegExp(filter,'i')
         }
        
            companyModel.find(filterQuery,(err,data)=>{
                if(err){
                     res.redirect('/');
                }else{
                    companyCategories.find({},(err,categories)=>{
                        res.render("companylisting",{
                            user:user,
                            title:"Employee Page",
                            Countries:Countries,
                            users:data,
                            categories:categories
                        });
                    })
                    
                }
            })
        }
         
}



// Filter User
exports.filterUser=(req,res)=>{

  let country=req.query.selectedcountry;
  let f=country.split(',');
  f.pop();
  let user=req.UserRole;
    const filter={country:f}
   let query=userModel.find(filter);
   query.exec((err,result)=>{
       if(err){
            res.json(err);
       }
        
        else{
            res.render("userlisting",{
                user:user,
                title:"Employee Page",
                Countries:Countries,
                users:result
            });
        }
   })
}


//Filter Company 
exports.filterCompany=(req,res)=>{

    let country=req.query.selectedcountry;
    let category=req.query.category;
    let user=req.UserRole;
    console.log(category);
    let f=country.split(',');
    f.pop();
    var filter;
    if(country){
         filter={country:f};
    }else if(category){
         filter={departement:category};
    }else if(category&&country)
    {
         filter={departement:category,country:f};
    }else{
        filter={};
    }
     
     let query=companyModel.find(filter);
     query.exec((err,result)=>{
         if(err){
              res.json(err);
         }
          
          else{
              companyCategories.find({},(err,category)=>{
                res.render("companylisting",{
                    user:user,
                    title:"Employee Page",
                    Countries:Countries,
                    users:result,
                    categories :category
                });
              })
             
          }
     })
  }

//Search User By Name
exports.filterUserName=(req,res)=>{
    let userName=req.query.UserName;
    let names=userName.split(" ");
    let firstName;
    let lastName;
    let filter;
    let user=req.UserRole;
    //console.log(UserS.length+" : "+UserS[0].firstName);

    if(names.length>=2){
    firstName=names[0];
    lastName=names[1];
    filter={
        firstName:new RegExp(firstName,'i'),
        lastName:new RegExp(lastName,'i')
    }
    }else if(names.length==1){
        firstName=names[0];
        filter={
            firstName:new RegExp(firstName,'i')
        }
    }else{
        filter={};
    }
    
    userModel.find(filter,(err,data)=>{
    if(err){
         res.json(err);
    }else{
        res.render("userlisting",{
            user:user,
            title:"Employee Page",
            Countries:Countries,
            users:data
        });
    }
})


}

exports.searchCompanyName=(req,res)=>{
   
    let companyName=req.query.companyName;
  let filter={
        Name:new RegExp(companyName,'i')
    }
    let user=req.UserRole;
    companyModel.find(filter,(err,companies)=>{
      
        if(err){
            res.json(err);
        }else{
            companyCategories.find({},(err,categories)=>{
                res.render("companylisting",{
                    user:user,
                    title:"Find Company",
                    users:companies,
                    companies:companies,
                    categories :categories ,
                    Countries:Countries
                })
            })
          
        }
    })

}
 
