const UserModel = require('../models/user.model');
const CompModel = require('../models/company.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const JWT = require('jsonwebtoken');
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
const {
    body
} = require('express-validator/check');
const {
    validationResult
} = require('express-validator');
const fs = require("fs");
const country = require("../models/country.model");
const userFeedbackModel = require("../models/feedbackUser.model");
const flash = require("connect-flash");

//  Sign Up  company
exports.getSignUp = (req, res) => {
    const Countries = country.country_list;
    const cookiesToken = req.cookies.MYtoken;
    var User;
    // var errors=req.flash("emailError");
    if (!cookiesToken) {
        User = null;
        let err = req.flash("emailError");
        let validationError = req.flash("CountryError");
        res.render("register", {
            title: "Register",
            user: User,
            msg: " ",
            Countries: Countries,
            err: err,
            validationError: validationError
        });
    } else {
        return res.render('error', {
            title: 'Sorry  !!',
            p: ' You Already Login , PLZ Loguot And Try Agin '
        })
    }
}

// exports.validate = (method) => {
//     switch (method) {
//       case 'signUp': {
//        return [ 
//           body('firstName', 'firstName does not exists').exists(),
//           body('lastName', 'lastName does not exists').exists(),
//           body('country', 'country does not exists').exists(),
//           body('email', 'Invalid email').exists().isEmail(),
//           body('password')

//              .exists()
//             .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')

//             .isLength({ min: 8 })
//             .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
//             .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
//             .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')

//         ]   
//       }

//     }
//   }


exports.signUp = (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('error', {
            title: 'Sorry ',
            p: errors.array()[0].msg
        })
    } else {
        const Countries = country.country_list;
        let type = req.body.type;
        try {
            // const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

            // if (!errors.isEmpty()) {
            //     console.log(req.flash("emailError"));
            //   res.status(422).json({ errors: errors.array() });
            //   req.flash("CountryError",errors);
            //    res.redirect('/user/signUp');

            //   return;
            // }

            //sign up as User
            if (type === "employee") {
                let email = req.body.email;
                UserModel.findOne({
                    email: email
                }, (err, result) => {
                    if (err) {
                        // req.flash("AuthError",err);
                        return res.json({
                            Error: err,
                            msg: " "
                        });
                    }
                    if (result !== null) {
                        //res.json({Error:"Email.is found",msg:" "});
                        // req.flash("emailError","this email is already registered you can login instead");
                        res.render('error', {
                            title: 'Sorry !',
                            p: 'This Email Is Used'
                        })
                        //res.redirect('/user/signUp');

                    } else {
                        CompModel.findOne({
                            email: email
                        }, (err, data) => {
                            if (err) {
                                res.json(err);
                            } else if (data) {
                                res.render('error', {
                                    title: 'Sorry !',
                                    p: 'This Email Is Used'
                                })
                                // res.render('register', {
                                //     msg: " ",
                                //     title: "Register",
                                //     user: null,
                                //     Countries:Countries
                                // });
                            } else {
                                let pass = req.body.password;
                                let confirmPassword = req.body.confirmPassword;
                                if (confirmPassword !== req.body.password) {
                                    return req.flash("emailError", "this email is already registered you can login instead");
                                }
                                if (pass === confirmPassword) {
                                    let hashPassword = bcrypt.hashSync(pass, 10);
                                    let user = new UserModel({
                                        email: req.body.email,
                                        password: hashPassword,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        country: req.body.country,
                                        title: req.body.title
                                    })
                                    user.save((err, result) => {
                                        if (err) {
                                            return res.json({
                                                /*Error:err,*/
                                                msg: err
                                            });
                                        }
                                        //start
                                        UserModel.findOne({
                                            email: req.body.email
                                        }, (err, data) => {
                                            if (!data) {} else {

                                                var payload = {
                                                    user: email,
                                                    Id: data._id
                                                };
                                                var Token = JWT.sign(payload, publicKey);


                                                // Save Token In Data Base

                                                res.cookie("MYtoken", Token, {
                                                    maxAge: 60 * 60 * 60 * 100
                                                }).redirect("/user/profileSetting");
                                            }
                                        })
                                        //end


                                    })
                                } else {
                                    //password not match
                                    res.render("register", {
                                        title: "register",
                                        msg: " ",
                                        user: null,
                                        Countries: Countries
                                    });
                                }


                            }
                        })


                    }
                })

            }
            //signUp as company
            else if (type === "company") {
                let email = req.body.email;
                CompModel.findOne({
                    email: email
                }, (err, result) => {
                    if (err)
                        return res.json({
                            msg: err
                        });

                    if (result !== null) {
                        res.render('error', {
                            title: 'Sorry !',
                            p: 'This Email Is Used'
                        })
                        //res.json({msg:"Email is found"});
                        //   req.flash("emailError","this email is already registered you can login instead");
                        //   res.render('register',
                        //   {
                        //      msg:" ",
                        //      title:"Register",
                        //      user:null,
                        //      Countries:Countries
                        //   });

                    } else {
                        UserModel.findOne({
                            email: email
                        }, (err, data) => {
                            if (err) {
                                res.json({
                                    msg: err
                                });
                            } else if (data) {
                                // res.render('register',
                                // {
                                //    msg:" ",
                                //    title:"Register",
                                //    user:null,
                                //    Countries:Countries
                                // });
                                res.render('error', {
                                    title: 'Sorry !',
                                    p: 'This Email Is Used'
                                })
                            } else {

                                let pass = req.body.password;
                                let confirmPassword = req.body.confirmPassword;
                                if (pass === confirmPassword) {
                                    let hashPassword = bcrypt.hashSync(pass, 10);
                                    let company = new CompModel({

                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        email: req.body.email,
                                        password: hashPassword,
                                        country: req.body.country,
                                        title: req.body.title,
                                    })

                                    company.save((err, result) => {
                                        if (err) {}
                                        // console.log(result);
                                        var payload = {
                                            user: email,
                                            Id: result._id
                                        };
                                        var Token = JWT.sign(payload, publicKey);

                                        // Save Token In Data Base
                                        res.cookie("MYtoken", Token, {
                                            maxAge: 60 * 60 * 60 * 100
                                        }).redirect("/company/companySetting");
                                    })
                                } else {
                                    //password not match
                                    res.render('error', {
                                        title: 'Sorry !',
                                        p: 'This Password Not Match'
                                    })
                                    // res.render('register', {
                                    //     title: "Register",
                                    //     msg: " ",
                                    //     user: null,
                                    //     Countries:Countries
                                    // });
                                }
                            }
                        })


                    }
                })

            }
        } catch (err) {
            return next(err);
        }
    }


}


exports.login = (req, res) => {
    var EMAIL = req.body.email;
    var PASSWORD = req.body.password;

    UserModel.findOne({
            email: EMAIL
        },
        (err, data) => {
            if (data && data.email == EMAIL) {
                // console.log(err);
                var ID = data._id;
                let role = data.role;
                bcrypt.compare(PASSWORD, data.password, (err, same) => {
                    if (same) {
                        // Create Token
                        var payload = {
                            user: EMAIL,
                            Id: ID,
                            Role: role
                        };
                        var Token = JWT.sign(payload, publicKey);

                        if (Token) {
                            // Save Token In Data Base
                            if (data.address && data.jopTitle && data.Description && data.phone) {
                                res.cookie("MYtoken", Token, {
                                    maxAge: 60 * 60 * 60 * 100
                                }).redirect("/companyPost/allDataPosts", );
                            } else {
                                res.cookie("MYtoken", Token, {
                                    maxAge: 60 * 60 * 60 * 100
                                }).redirect("/user/profileSetting", );
                            }

                        } else {
                            res.status(200).json({
                                success: false,
                                'msg': 'Your Token Expired You Must  Login Again :('
                            });
                        }



                    } else {
                        //req.flash("InvalidPassword",'The Password Not Right ')
                        //res.status(200).redirect('/');
                        res.render('error', {
                            title: 'Sorry',
                            p: 'The Pasword Not Right :((!'
                        })
                    }
                })
            } else {
                CompModel.findOne({
                        email: EMAIL
                    },
                    (err, data) => {

                        if (data && data.email == EMAIL) {
                            var ID = data._id;
                            // console.log(err);
                            bcrypt.compare(PASSWORD, data.password, (err, same) => {
                                if (same) {
                                    // Create Token
                                    var payload = {
                                        user: EMAIL,
                                        Id: ID
                                    };


                                    var Token = JWT.sign(payload, publicKey);
                                    if (Token) {
                                        // Save Token In Data Base
                                        if (data.departement && data.phone && data.state) {
                                            res.cookie("MYtoken", Token, {
                                                maxAge: 60 * 60 * 60 * 100
                                            }).redirect("/userlisting");
                                        } else {
                                            res.cookie("MYtoken", Token, {
                                                maxAge: 60 * 60 * 60 * 100
                                            }).redirect("/company/companySetting");
                                        }
                                    }
                                } else {
                                    req.flash("InvalidPassword", 'The Password Not Right ')
                                    res.status(200).redirect('/');
                                }
                            })
                        } else if (err) {
                            res.status(404).json(err);
                        } else {
                            req.flash("EmailnotFound", "Email not found signuP Instead")
                            res.status(400).redirect("/");
                        }
                    });
            }
        });
};

//Upload Profile photo 
exports.uploadProfilePhoto = (req, res) => {

    if (req.files) {
        let uploadedFile = req.files.file;
        UserModel.findOne({
            email: req.userData.email
        }, (err, user) => {
            if (err) {
                res.redirect('/user/userSingle');
            } else {
                let userId = user._id;

                if (uploadedFile.mimetype === "image/jpeg" ||
                    uploadedFile.mimetype === "image/png" ||
                    uploadedFile.mimetype === "image/jpg") {
                    let imgEx = user.profilePhoto.split('.')[1];
                    try {
                        fs.unlinkSync("public/assets/images/uploaded/" + userId + "_profile" + "." + imgEx);
                    } catch (error) {
                        console.log("No Photo");
                    } finally {
                        UserModel.updateOne({
                            email: req.userData.email
                        }, {
                            $set: {
                                profilePhoto: uploadedFile.name
                            }
                        }, (err) => {

                            let fileExtension = uploadedFile.name.split('.')[1];


                            uploadedFile.mv("public/assets/images/uploaded/" + userId + "_profile" + "." + fileExtension, (err) => {
                                if (err) {
                                    res.json({
                                        Error: err
                                    });
                                } else {
                                    res.redirect('/user/profileSetting');
                                }
                            })

                        })
                    }
                } else {
                    res.redirect('/user/profileSetting');
                }
            }
        })
    } else {
        res.redirect('/user/profileSetting');
    }

}

//Get All Users



//Upload Cover photo 
exports.uploadCoverPhoto = (req, res) => {

    if (req.files) {
        let uploadedFile = req.files.filew;
        UserModel.findOne({
            email: req.userData.email
        }, (err, user) => {
            if (err) {
                res.redirect('/user/userSingle');
            } else {
                let userId = user._id;

                if (uploadedFile.mimetype === "image/jpeg" ||
                    uploadedFile.mimetype === "image/png" ||
                    uploadedFile.mimetype === "image/jpg") {
                    let imgEx = user.coverPhoto.split('.')[1];
                    let exist = "public/assets/images/uploaded/" + userId + "_cover" + "." + imgEx;

                    try {
                        fs.unlinkSync("public/assets/images/uploaded/" + userId + "_cover" + "." + imgEx);
                    } catch (error) {
                        console.log("No photo");
                    } finally {
                        UserModel.updateOne({
                            email: req.userData.email
                        }, {
                            $set: {
                                coverPhoto: uploadedFile.name
                            }
                        }, (err) => {

                            let fileExtension = uploadedFile.name.split('.')[1];


                            uploadedFile.mv("public/assets/images/uploaded/" + userId + "_cover" + "." + fileExtension, (err) => {
                                if (err) {
                                    res.json({
                                        Error: err
                                    });
                                } else {
                                    res.redirect('/user/profileSetting');
                                }
                            })

                        })
                    }


                } else {
                    res.redirect('/user/profileSetting');
                }
            }
        })
    } else {
        res.redirect('/user/profileSetting');
    }

}



//Add Skills To User 
exports.addSkills = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $push: {
            skills: {
                skillName: req.body.skill,
                progress: req.body.rate
            }
        }
    }, (err, data) => {
        if (err) {
            res.redirect("/user/profileSetting");
        } else {
            res.redirect("/user/profileSetting")
        }
    })
}

//edit Skills 
exports.editSkills = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email,
        "skills._id": req.body.Id
    }, {
        $set: {
            "skills.$.progress": req.body.skillProgress

        }
    }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }
    })
}

//Delete Skills
exports.deleteSkills = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $pull: {
            skills: {
                _id: req.body.skillId
            }
        }
    }, {
        multi: false
    }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }

    })
}


//Add Experiences
exports.addExperience = (req, res) => {
    let sDate = req.body.startDate;
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $push: {
            experience: {
                companyTitle: req.body.companyTitle,
                startDate: sDate,
                endDate: req.body.endDate,
                jobtitle: req.body.jobtitle,
                jopDesription: req.body.jopDesription
            }
        }
    }, (err, data) => {
        if (err) {
            res.redirect('/user/profileSetting');
        } else {
            res.redirect('/user/profileSetting');
        }
    })
}

//Edit Experience
exports.editExperience = (req, res) => {

    UserModel.updateOne({
        email: req.userData.email,
        "experience._id": req.body.Id
    }, {
        $set: {
            "experience.$.companyTitle": req.body.companyTitle,
            "experience.$.startDate": req.body.startDate,
            "experience.$.endDate": req.body.endDate,
            "experience.$.jobtitle": req.body.jobtitle,
            "experience.$.jopDesription": req.body.jopDesription
        }
    }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }
    })
}

//Delete Experience
exports.deleteExperience = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $pull: {
            experience: {
                _id: req.body.Id
            }
        }
    }, {
        multi: false
    }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }

    })
}


//add Education 
exports.addEducation = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $push: {
            education: {
                certificateTitle: req.body.certificateTitle,
                certStartDate: req.body.certStartDate,
                certEndDate: req.body.certEndDate,
                certificateDesription: req.body.certificateDesription
            }
        }
    }, (err, data) => {
        if (err) {
            //  res.redirect('/user/profileSetting');
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }
    })
}

//Edit Education 
exports.editEducation = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email,
        "education._id": req.body.Id
    }, {
        $set: {
            "education.$.certificateTitle": req.body.certificateTitle,
            "education.$.certStartDate": req.body.certStartDate,
            "education.$.certEndDate": req.body.certEndDate,
            "education.$.certificateDesription": req.body.certificateDesription
        }
    }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }
    })
}

//update User Personal Data
exports.updatePersonalData = (req, res) => {

    UserModel.updateOne({
        email: req.userData.email
    }, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            //email: req.body.email,
            country: req.body.country,
            jopTitle: req.body.jopTitle,
            Description: req.body.Description,
            gender: req.body.gender,
            address: req.body.address,
            birthDate: req.body.birthDate,
            phone: req.body.phone,
            country: req.body.country

        }
    }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }


    })
}


//delete Education 
exports.deleteEducation = (req, res) => {
    UserModel.updateOne({
        email: req.userData.email
    }, {
        $pull: {
            education: {
                _id: req.body.Id
            }
        }
    }, {
        multi: false
    }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.redirect('/user/profileSetting');
        }

    })
}

//  Delete User
exports.delete_user = (req, res) => {
    try {
        UserModel.findOneAndRemove({
                email: req.params.email
            },
            (err) => {
                if (err) {
                    console.log(err)
                    res.send("This User Not Found !!")
                } else {
                    res.status(200).json({
                        success: true,
                        msg: "User Deleted Successfully :) .."
                    })
                }
            }
        )
    } catch (err) {
        res.status(200).json({
            success: true,
            'ERROR': err
        })
    }
};


//logout
exports.logout = (req, res) => {
    res.clearCookie('MYtoken');
    res.redirect('/');

}

//Change Password
exports.changePassword = (req, res) => {
    const userId = req.userData.Id
    const oldpassword = req.body.oldpassword
    const newPassword = req.body.newPass;
    let fetchedUser;


    UserModel.findById(userId).then(user => {
        fetchedUser = user
        if (!user) {
            return res.status(404).json({
                message: " user not found"
            })
        }

        bcrypt.compare(oldpassword, fetchedUser.password).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "invalida creditals"
                })
            }
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "change pass faild"
                    })
                }
                fetchedUser.password = hash
                fetchedUser.save().then(result => {
                    res.status(200).redirect("/user/profileSetting")
                })
            })
        })
    })


}

//Reset Password
exports.resetPassword = (req, res) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                err: err
            })
        }
        const token = buffer.toString('hex');
        UserModel.findOne({
            email: req.body.email
        }).then(
            user => {
                if (!user) {

                    CompModel.findOne({
                        email: req.body.email
                    }).then(
                        comp => {
                            if (!comp) {
                                res.status(404).json({
                                    message: 'No account with that email found'
                                })
                            } else {
                                this.name = comp.userName
                                comp.resetToken = token;
                                comp.resetTokenExpiration = Date.now() + 3600000
                                comp.save();
                                res.render("msg");
                            }
                        }
                    )
                } else {
                    this.name = user.userName
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600000
                    user.save();
                    res.render("msg");
                }
            }).catch(() => {});

        var client = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: 'AhmedFouad77',
                pass: '123456@Aa'
            }
        });

        var email = {
            from: 'I-Remotly@bar.com',
            to: req.body.email,
            subject: 'Reseti your password',
            text: 'Hello world',
            html: `<h1>
            Hi :) ! to reset your password
              <a href="http://192.168.1.137:8080/user/getnewPassword/${token}">please click here :)!</a>
              </h1>`
        };

        client.sendMail(email, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    })
};
// Get New Password
exports.getNewPassword = (req, res) => {
    const token = req.params.token;
    const pass = req.body.pass;
    const passCon = req.body.passCon;
    if (passCon !== pass) {
        return res.status(401).json({
            message: "password and confirm password dosen't match"
        })
    } else {

        UserModel.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        }).then(
            user => {
                if (!user) {
                    CompModel.findOne({
                            resetToken: token,
                            resetTokenExpiration: {
                                $gt: Date.now()
                            }
                        },
                        (err, data) => {
                            if (data) {
                                let resetUser = data;
                                bcrypt.hash(pass, 12).then(
                                    hashedPassword => {
                                        resetUser.password = hashedPassword;
                                        resetUser.resetToken = undefined;
                                        resetUser.resetTokenExpiration = undefined;
                                        return resetUser.save();
                                    }
                                ).then(result => {
                                    if (result) {
                                        return res.status(200).json({
                                            success: true,
                                            msg: 'Your Password reset Successfuly'
                                        })
                                    }
                                })
                            } else if (err) {
                                res.status(404).redirect("/");
                            }
                        });
                }
                let resetUser = user;
                bcrypt.hash(pass, 12).then(
                    hashedPassword => {
                        resetUser.password = hashedPassword;
                        resetUser.resetToken = undefined;
                        resetUser.resetTokenExpiration = undefined;
                        return resetUser.save();
                    }
                ).then(result => {
                    if (result) {
                        return res.status(200).json({
                            success: true,
                            msg: 'Your Password reset Successfuly'
                        })
                    }
                })
            }).catch(err => {
            res.status(500).json({
                msg: "some wrong hapend please try agian"
            })
        })
    }
};
// get New Password Page
exports.getNewPasswordPage = (req, res) => {
    res.render("resetPassword");
}


//Get User  profile
exports.getUserProfile = (req, res) => {
    const Countries = country.country_list;
    const cookiesToken = req.cookies.MYtoken;
    var decode = JWT.verify(cookiesToken, publicKey);

    var userId = decode.Id;
    UserModel.findOne({
            email: req.userData.email
        },
        (err, result) => {
            if (err) {
                res.redirect('/');
            } else {
                let query = userFeedbackModel.find({
                    feededUser: req.userData.Id
                });
                query.exec((err, feeds) => {
                    if (err) {
                        res.redirect('/');
                    }
                    res.render("usersingle", {
                        title: "User Page",
                        user: result,
                        skills: result.skills,
                        experience: result.experience,
                        education: result.education,
                        Countries: Countries,
                        userId: userId,
                        feedBacks: feeds
                    });
                })


            }
        })


}


//get profile according to loginb token 
exports.getProfile = (req, res) => {
    let email = req.userData.email;
    UserModel.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            res.redirect('/');
        } else if (user) {
            res.redirect('/user/usersingle');
        } else if (!user) {
            CompModel.findOne({
                email: email
            }, (err, company) => {
                if (err) {
                    res.redirect('/');
                } else if (company) {
                    res.redirect('/company/companyProfile');
                } else {
                    res.redirect('/');
                }
            })
        }
    })
}


//get User Profile Setting
exports.getProfileSetting = (req, res) => {
    const Countries = country.country_list;
    //console.log({Datat:data,gmail:data.user});
    UserModel.findOne({
        email: req.userData.email
    }, (err, User) => {
        if (err)
            res.redirect("/");
        else if (User) {
            //res.json({type:"User",data:user});
            res.render("profileSetting", {
                title: User.firstName,
                user: User,
                skills: User.skills,
                experience: User.experience,
                education: User.education,
                Countries: Countries

            });
        }
    });
}

//get User Profile Setting
exports.getUserdashboard = (req, res) => {

    //console.log({Datat:data,gmail:data.user});
    UserModel.findOne({
        email: req.userData.email
    }, (err, User) => {
        if (err)
            res.redirect("/");
        else if (User) {
            //res.json({type:"User",data:user});
            res.render("dashboard-insightsUser", {
                title: "User.firstName",
                user: User,
                skills: User.skills,
                experience: User.experience,
                education: User.education

            });
        }
    });
}

//Delete Account 
exports.deleteAccount = (req, res) => {

    let password = req.body.password;
    let confirmPassword = req.body.confirmpassword;
    if (password == confirmPassword) {
        UserModel.findOne({
            _id: req.userData.Id
        }, (err, user) => {
            bcrypt.compare(password, user.password, (err, same) => {
                //console.log(same);
                if (same) {
                    UserModel.deleteOne({
                        _id: req.userData.Id
                    }, (err) => {
                        if (err) {
                            res.json(err);
                        }
                        res.clearCookie('MYtoken').redirect('/');

                    })
                }
            })
        })
    }
}