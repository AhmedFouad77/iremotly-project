const CompModel = require('../models/company.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const JWT = require('jsonwebtoken');
const check = require('express-validator').check;
const validationResult = require('express-validator').validationResult;
const country = require("../models/country.model");
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
const companyCategory = require("../models/companyCategory.model");



// Display company profile
exports.getCompanyProfile = (req, res) => {
    const Countries = country.country_list;
    const cookiesToken = req.cookies.MYtoken;
    var decode = JWT.verify(cookiesToken, publicKey);
    var userId = decode.Id;
    CompModel.findOne({
            email: req.userData.email
        },
        (err, company) => {
            if (err) {
                res.redirect('/');
            } else {
                res.render("companysingle", {
                    title: company.Name,
                    user: company,
                    userId: userId

                });
            }
        })
}



//get Company Account Setting
exports.getCompanyAccountSetting = (req, res) => {
    const Countries = country.country_list;
    companyCategory.find({}, (err, result) => {
        if (err) {
            res.redirect('/');
        } else {
            //<%=dept.categoryTitle%>
            CompModel.findOne({
                email: req.userData.email
            }, (err, data) => {
                if (err) {
                    res.json(err);
                } else {
                    let dept = data.departement;
                    res.render("companysetting", {
                        user: data,
                        title: "Company Setting",
                        Countries: Countries,
                        categories: result
                    });

                }

            }).populate("departement", '-_id')

        }
    })
}

//get Company Account Setting
exports.getCompanydashboard = (req, res) => {
    CompModel.findOne({
        email: req.userData.email
    }, (err, data) => {
        if (err) {
            res.redirect('/');
        } else {
            res.render("dashboard-insightsCompany", {
                user: data,
                title: "Company Dashboard"
            });
        }
    })
}


// Update Company Account
exports.updateCompanyDatat = (req, res) => {
    //req.userData.email;
    // <%=dept.categoryTitle%>
    var cookies = req.cookies.MYtoken;
    var decode = JWT.verify(cookies, publicKey);
    var id = decode.Id;
    CompModel.findOneAndUpdate({
            _id: id
        }, //email:req.userData.email
        {
            $set: {
                Name: req.body.name,
                Description: req.body.Description,
                country: req.body.country,
                phone: req.body.phone,
                dateOfOrigin: req.body.dateOrigin,
                departement: req.body.departement,
                address: req.body.address,
                state: req.body.state,
                companySize: req.body.companySize
            }
        }, (err, result) => {
            if (err) {
                res.json(err);
            } else if (result) {
                res.redirect('/company/companySetting');
                // console.log()
            }
        })

}

//upload cover Photo
exports.uploadCoverPhoto = (req, res) => {

    if (req.files) {
        let uploadedFile = req.files.filew;
        CompModel.findOne({
            email: req.userData.email
        }, (err, company) => {
            if (err) {
                res.redirect('/company/companySetting');
            } else {
                let compId = company._id;

                if (uploadedFile.mimetype === "image/jpeg" ||
                    uploadedFile.mimetype === "image/png" ||
                    uploadedFile.mimetype === "image/jpg") {
                    let imgEx = company.coverPhoto.split('.')[1];
                    //let exist="public/assets/images/uploaded/"+compId+"_cover"+"."+imgEx;

                    try {
                        fs.unlinkSync("public/assets/images/uploaded/" + compId + "_cover" + "." + imgEx);
                    } catch (error) {
                        // console.log("No photo");
                    } finally {
                        CompModel.updateOne({
                            email: req.userData.email
                        }, {
                            $set: {
                                coverPhoto: uploadedFile.name
                            }
                        }, (err) => {

                            let fileExtension = uploadedFile.name.split('.')[1];


                            uploadedFile.mv("public/assets/images/uploaded/" + compId + "_cover" + "." + fileExtension, (err) => {
                                if (err) {
                                    res.json({
                                        Error: err
                                    });
                                } else {
                                    res.redirect('/company/companySetting');
                                }
                            })

                        })
                    }


                } else {
                    res.redirect('/company/companySetting');
                }
            }
        })
    } else {
        res.redirect('/company/companySetting');
    }

}

//upload Profile Photo
exports.uploadProfilePhoto = (req, res) => {

    if (req.files) {
        let uploadedFile = req.files.file;
        CompModel.findOne({
            email: req.userData.email
        }, (err, company) => {
            if (err) {
                res.redirect('/company/companySetting');
            } else {
                let compId = company._id;

                if (uploadedFile.mimetype === "image/jpeg" ||
                    uploadedFile.mimetype === "image/png" ||
                    uploadedFile.mimetype === "image/jpg") {
                    let imgEx = company.profilePhoto.split('.')[1];


                    try {
                        fs.unlinkSync("public/assets/images/uploaded/" + compId + "_profile" + "." + imgEx);
                    } catch (error) {
                        // console.log("No photo");
                    } finally {
                        CompModel.updateOne({
                            email: req.userData.email
                        }, {
                            $set: {
                                profilePhoto: uploadedFile.name
                            }
                        }, (err) => {

                            let fileExtension = uploadedFile.name.split('.')[1];


                            uploadedFile.mv("public/assets/images/uploaded/" + compId + "_profile" + "." + fileExtension, (err) => {
                                if (err) {
                                    res.json({
                                        Error: err
                                    });
                                } else {
                                    res.redirect('/company/companySetting');
                                }
                            })

                        })
                    }


                } else {
                    res.redirect('/company/companySetting');
                }
            }
        })
    } else {
        res.redirect('/company/companySetting');
    }

}




//  Delete Company
exports.delete_company = (req, res) => {
    // var Token = req.header('authorization');
    try {
        const cookies = req.cookies.MYtoken;
        const decode = JWT.verify(cookies,publicKey);
        var idCompany = decode.Id;
      CompModel.findByIdAndRemove(idCompany).then(
          result=>{
              if(!result){

              }else{
                  res.render('true',{title:'OK',p:'Your Acount Delted :) '})
              }
          }
      ).catch(e=>{})
            // CompModel.findOneAndRemove({
            //      _id:idCompany
            //     },
            //     (err) => {
            //         if (err) {
            //             // console.log(err)
            //             res.send("This User Not Found !!")
            //         } else {
            //             res.status(200).json({
            //                 success: true,
            //                 msg: "User Deleted Successfully :) .."
            //             })
            //         }
            //     }
            // )
        
    } catch (err) {
        res.status(200).json({
            success: true,
            'Error': err
        })
    }
};



//Change Password
exports.changePassword = (req, res) => {
    const userId = req.userData.Id
    const oldpassword = req.body.oldpassword
    const newPassword = req.body.newPass;
    const confirmPass = req.body.confirmPass;
    let fetchedUser;
    try{
        if(newPassword == confirmPass){
    CompModel.findById(userId).then(user => {
        fetchedUser = user
        if (!user) {
            return res.render('error',{title:'Sorry :(',p:'You Are Not A User :(('})
        }

        bcrypt.compare(oldpassword, fetchedUser.password).then(result => {
            if (!result) {
                return res.render('error',{title:'Sorry :(',p:'The Password Not Right :(('})
            }
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "change pass faild"
                    })
                }
                fetchedUser.password = hash
                fetchedUser.save().then(result => {

                    res.status(200).redirect("/company/companySetting")
                })
            })
        })
    })
}else{
    res.render('error',{title:'Sorry',p:'The Password And Confirm Password Not Equal :(('})
}
}catch(e){ res.render('error',{title:'Sorry',p:'There Are A Proplem PLZ Try Agin :(('})}
}

//Resetr password
exports.resetPassword = (req, res) => {
    const transporter = nodemailer.createTransport(
        sendgridTransport({
            auth: {
                api_key: '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' //IRemotly
            }
        })
    );
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            //   console.log(err)
            return res.status(500).json({
                err: err
            })
        }
        const token = buffer.toString('hex');
        CompModel.findOne({
            email: req.body.email
        }).then(
            comp => {
                if (!comp) {
                    res.status(404).json({
                        message: 'No account with This email !!'
                    })
                }
                this.name = comp.userName
                comp.resetToken = token;
                comp.resetTokenExpiration = Date.now() + 3600000
                return comp.save();
            }
        ).then(result => {
            if (result) {
                res.status(200).json({
                    message: "You Will Receive Email With Your Reset Password link in A minute Please Check Your Inbox :)"
                })
                transporter.sendMail({
                    to: req.body.email,
                    from: 'IRemotely.com', //var
                    subject: 'Password reset',
                })
            }
        })
    })
};
// Get New Password
exports.getNewPassword = (req, res) => {
    const token = req.body.token;
    const newPassword = req.body.password;
    CompModel.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    }).then(
        comp => {
            if (!comp) {
                res.status(401).json({
                    success: false,
                    msg: 'you are not authorize to take that action'
                })
            }
            let resetComp = comp;
            bcrypt.hash(newPassword, 12).then(
                hashedPassword => {
                    resetComp.password = hashedPassword;
                    resetComp.resetToken = undefined;
                    resetComp.resetTokenExpiration = undefined;
                    return resetComp.save();
                }
            ).then(result => {
                if (result) {
                    res.status(200).json({
                        success: true,
                        msg: 'Your Password reset Successfully :)'
                    })
                }
            })
        })
};

//Delete Account 
exports.deleteAccount = (req, res) => {
    // let password = req.body.password;
    // let confirmPassword = req.body.confirmpassword;
    // if (password == confirmPassword) {
    //     CompModel.findOne({
    //         _id: req.userData.Id
    //     }, (err, user) => {
    //         bcrypt.compare(password, user.password, (err, same) => {
    //             console.log(same);
    //             if (same) {
    //                 CompModel.deleteOne({
    //                     _id: req.userData.Id
    //                 }, (err) => {
    //                     if (err) {
    //                         res.json(err);
    //                     }
    //                     res.clearCookie('MYtoken').redirect("/");

    //                 })
    //             }
    //         })
    //     })
    // }
}