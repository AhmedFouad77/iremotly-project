const jwt = require("jsonwebtoken");
const publicKey = 'This Is Any Secret Key To Encrypt Mu Data';
const userModel = require("../models/user.model");
const comapnyModel = require("../models/company.model");
const country = require("../models/country.model");
const Countries = country.country_list;
const userFeedbackModel = require("../models/feedbackUser.model");
const postModel = require('../models/post.Model');
const compCategories = require("../models/companyCategory.model");
const chat = require("../models/chat.model");



//get home page
exports.getHome = (req, res) => {

    //const cookiesToken=req.cookies.MYtoken;

    if (req.cookies.MYtoken) {

        const cookiesToken = req.cookies.MYtoken;

        var decode = jwt.verify(cookiesToken, publicKey);
        //req.userData={email:decode.user};
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, data) => {
            if (err) {
                res.render("index", {
                    title: "Home Page",
                    user: null
                });
            } else if (data) {
                res.render("index", {
                    title: "Home Page",
                    user: data
                });
            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("index", {
                            title: "Home Page",
                            user: null
                        });
                    } else if (comp) {
                        res.render("index", {
                            title: "Home Page",
                            user: comp
                        });
                    }
                })
            }
        })
    } else {
        let wrongPass = req.flash("InvalidPassword");
        let notfound = req.flash("EmailnotFound");
        res.render("index", {
            title: "Home Page",
            user: null,
            wrongPass: wrongPass,
            notfound: notfound
        });
    }

}

//get how it works page

exports.getHowitworks = (req, res) => {

    // if(req.cookies.MYtoken){

    //     const cookiesToken=req.cookies.MYtoken;
    //     var decode=jwt.verify(cookiesToken,publicKey);
    //     //req.userData={email:decode.user};
    //     const email=decode.user;
    //     var userId=decode.Id;
    //     userModel.findOne({email:email},(err,data)=>{
    //         if(err){
    //             res.render("howitworks",{
    //                     title:"How It Works"
    //                    });
    //         }else if(data){
    //             res.render("howitworks",{
    //                     title:"How It Works",
    //                     user:data,
    //                     userId:userId
    //                    });
    //         }else{
    //             comapnyModel.findOne({email:email},(err,comp)=>{
    //                 if(err){
    //                     res.render("howitworks",{
    //                             title:"How It Works"
    //                            });
    //                 }else if(comp){
    //                     res.render("howitworks",{
    //                             title:"How It Works",
    //                             user:comp,
    //                             userId:userId
    //                            });
    //                 }
    //             })
    //         }
    //     })


    //      }else{
    //         res.render("howitworks",{
    //                 title:"How It Works",
    //                 user:null
    //                });
    //      }  
    let user = req.UserRole;
    res.render("howitworks", {
        title: "How It Works",
        user: user,

    });
};

//get Job Listing
exports.getJobListing = (req, res) => {

    // const Countries=country.country_list;
    // if(req.cookies.MYtoken){

    //     const cookiesToken=req.cookies.MYtoken;
    //     var decode=jwt.verify(cookiesToken,publicKey);
    //     const email=decode.user;
    //     var userId=decode.Id;
    //     userModel.findOne({email:email},(err,data)=>{
    //         if(err){
    //             res.render("joblisting",{
    //                     title:"Find Job"
    //                    });
    //         }else if(data){
    //             res.render("joblisting",{
    //                     title:"Find Job",
    //                     user:data,
    //                     userId:userId,
    //                     Countries:Countries
    //                    });
    //                    console.log(data);
    //         }else{
    //             comapnyModel.findOne({email:email},(err,comp)=>{
    //                 if(err){
    //                     res.render("joblisting",{
    //                             title:"Find Job"
    //                            });
    //                 }else if(comp){
    //                     res.render("joblisting",{
    //                             title:"Find Job",
    //                             user:comp,
    //                             userId:userId,
    //                             Countries:Countries
    //                            });
    //                            console.log(comp);
    //                 }
    //             })
    //         }
    //     })


    //      }else{
    //         res.render("joblisting",{
    //                 title:"Find Job",
    //                 user:null
    //                });
    //      }  
    let user = req.UserRole;
    res.render("joblisting", {
        title: "Find Job",
        user: user,
        Countries: Countries
    });
}
exports.jobSingle = (req, res) => {

    const cookiesToken = req.cookies.MYtoken;
    if (!cookiesToken) {
        // user is Annonomas
        var id = req.params.id;
        postModel.findOne({
            _id: id
        }).populate('creatorCompany').exec().then(
            (result) => {
                if (!result) {
                    res.send('Sorry ! THis Post Deleted')
                } else {
                    var post = result;
                    res.render("jobsingle", {
                        title: "Job Details",
                        user: null,
                        idPost: id,
                        post: post,
                    });
                }
            }
        ).catch(e => {
            res.send('Sorry ! THis Post unfound')
        });
    } else {
        //search in Company Model
        var decode = jwt.verify(cookiesToken, publicKey);
        //req.userData = { email: decode.user,Id:decode.Id };
        let userId = decode.Id;
        comapnyModel.findOne({
            _id: userId
        }, (err, data) => {
            if (err) {
                res.redirect("/companyPost/allDataPosts");
            } else if (!data) {
                //    search in users
                var decode = jwt.verify(cookiesToken, publicKey);
                let userId = decode.Id;
                userModel.findOne({
                    _id: userId
                }, (err, data) => {
                    if (err) {} else {
                        if (data) {
                            var id = req.params.id;
                            postModel.findOne({
                                _id: id
                            }).populate('creatorCompany').exec().then(
                                (result) => {
                                    if (!result) {
                                        res.send('Sorry ! THis Post Deleted')
                                    } else {
                                        var post = result;
                                        res.render("jobsingle", {
                                            title: "Job Details",
                                            user: data,
                                            idPost: id,
                                            post: post,
                                        });
                                    }
                                }
                            ).catch(e => {
                                res.send('Sorry ! THis Post unfound')
                            });
                        }
                    }
                })
                // end search in user
            } else {
                var id = req.params.id;
                postModel.findOne({
                    _id: id
                }).populate('creatorCompany').exec().then(
                    (result) => {
                        if (!result) {
                            res.send('Sorry ! THis Post Deleted')
                        } else {
                            var post = result;
                            res.render("jobsingle", {
                                title: "Job Details",
                                user: data,
                                idPost: id,
                                post: post,
                            });
                        }
                    }
                ).catch(e => {
                    res.send('Sorry ! THis Post unfound')
                });
            } //search in users Model
        })
    }
}

//Find Employee
exports.getuserlisting = (req, res) => {

    userModel.find({}, (err, data) => {

    })

    if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        var userId = decode.Id;
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, user) => {
            if (err) {
                res.render("userlisting", {
                    title: "Find Employee"
                });
            } else if (user) {
                let query = userModel.find(null);

                query.exec((err, data) => {

                    res.render("userlisting", {
                        title: "Find Employee",
                        user: user,
                        users: data,
                        // Countries:countryList,
                        // code:existCountryCode,
                        Countries: Countries,
                        userId: userId
                    });
                })


            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("userlisting", {
                            title: "Find Employee"
                        });
                    } else if (comp) {
                        let query = userModel.find(null);

                        query.exec((err, users) => {
                            res.render("userlisting", {
                                title: "Find Employee",
                                user: comp,
                                users: users,
                                Countries: Countries,
                                userId: userId
                            });
                        })
                    }
                })
            }

        })
    } else {
        let query = userModel.find(null);

        query.exec((err, users) => {
            let wrongPass = req.flash("InvalidPassword");
            let notfound = req.flash("EmailnotFound");
            res.render("userlisting", {
                title: "Find Employee",
                user: null,
                users: users,
                Countries: Countries,
                userId: userId,
                wrongPass: wrongPass,
                notfound: notfound
            });
        })
    }


}

exports.getuserlistingSkill = (req, res) => {
    if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        var userId = decode.Id;
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, data) => {
            if (err) {
                res.render("userlisting", {
                    title: "Find Employee"
                });
            } else if (data) {
                let query = userModel.find({
                    "skills.skillName": req.params.skill
                });

                query.exec((err, users) => {
                    res.render("userlisting", {
                        title: "Find Employee",
                        user: data,
                        users: users,
                        Countries: Countries,
                        userId: userId
                    });
                })


            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("userlisting", {
                            title: "Find Employee"
                        });
                    } else if (comp) {
                        let query = userModel.find({
                            "skills.skillName": req.params.skill
                        });

                        query.exec((err, users) => {
                            res.render("userlisting", {
                                title: "Find Employee",
                                user: comp,
                                users: users,
                                Countries: Countries,
                                userId: userId
                            });
                        })
                    }
                })
            }

        })
    } else {

        let query = userModel.find({
            "skills.skillName": req.params.skill
        });

        query.exec((err, users) => {
            res.render("userlisting", {
                title: "Find Employee",
                user: null,
                users: users,
                Countries: Countries,
                userId: userId
            });
        })
    }

}


//Show Employee Page
exports.userPage = async (req, res) => {

    let signedChat;
    let guestChat;


    if (!req.cookies.MYtoken) {


        await userModel.findOne({
            _id: req.params.id
        }, (err, data) => {
            if (err) {
                res.redirect('/userlisting');
            } else if (data) {
                let Id = data._id;
                let query = userFeedbackModel.find({
                    feededUser: req.params.id
                });
                query.exec((err, feedBacks) => {
                    //console.log(feedBacks);
                    if (err) {
                        res.json(err);
                    } else {

                        res.render("showProfilePage", {
                            title: "User Page",
                            result: data,
                            skills: data.skills,
                            experience: data.experience,
                            education: data.education,
                            Countries: Countries,
                            user: null,
                            feedBacks: feedBacks,

                        });
                    }
                })

            }
        })
    } else if (req.cookies.MYtoken) {

        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);

        let userId = decode.Id;

        await userModel.findOne({
            _id: userId
        }, (err, data) => {
            if (err) {
                res.redirect('/userlisting');
            } else if (data) {
                signedChat = data.contact;
                // console.log("signedChat : "+signedChat);
                userModel.findOne({
                    _id: req.params.id
                }, (err, result) => {
                    if (err) {
                        res.redirect('/userlisting');
                    } else if (result) {

                        var hasChat = false;
                        let chatId;
                        guestChat = result.contact;

                        for (var i = 0; i < signedChat.length; i++) {

                            for (var x = 0; x < guestChat.length; x++) {

                                if (String(signedChat[i].chatId) == String(guestChat[x].chatId)) {
                                    hasChat = true;
                                    chatId = signedChat[i].chatId;
                                    break;
                                }
                            }

                        }
                        // console.log("guestChat : "+guestChat)
                        let query = userFeedbackModel.find({
                            feededUser: result._id
                        })
                        query.exec((err, feedBacks) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.render("showProfilePage", {
                                    title: "User Page",
                                    user: data,
                                    result: result,
                                    skills: result.skills,
                                    experience: result.experience,
                                    education: result.education,
                                    Countries: Countries,
                                    feedBacks: feedBacks,
                                    hasChat: hasChat,
                                    chatId: chatId
                                });
                            }
                        })
                    }
                })
            } else {
                comapnyModel.findOne({
                    _id: userId
                }, (err, data) => {
                    if (err) {
                        res.redirect('/userlisting');
                    } else {
                        signedChat = data.contact;
                        // console.log("signedChat : "+signedChat);
                        userModel.findOne({
                            _id: req.params.id
                        }, (err, result) => {
                            if (err) {
                                res.redirect('/userlisting');
                            } else if (result) {
                                var hasChat = false;
                                let chatId;
                                guestChat = result.contact;

                                for (var i = 0; i < signedChat.length; i++) {

                                    for (var x = 0; x < guestChat.length; x++) {

                                        if (String(signedChat[i].chatId) == String(guestChat[x].chatId)) {
                                            hasChat = true;
                                            chatId = signedChat[i].chatId;
                                            break;
                                        }
                                    }

                                }
                                // console.log(hasChat);
                                let query = userFeedbackModel.find({
                                    feededUser: result._id
                                })
                                query.exec((err, feedBacks) => {
                                    if (err) {
                                        res.json(err);
                                    } else {

                                        userFeedbackModel.findOne({
                                            feededUser: result._id,
                                            feddedCompany: userId
                                        }, (err, existFeedBack) => {
                                            if (err) {
                                                res.json(err);
                                            } else if (existFeedBack) {
                                                res.render("showProfilePage", {
                                                    title: "User Page",
                                                    user: data,
                                                    result: result,
                                                    skills: result.skills,
                                                    experience: result.experience,
                                                    education: result.education,
                                                    Countries: Countries,
                                                    feedBacks: feedBacks,
                                                    existFeedBack: existFeedBack,
                                                    hasChat: hasChat,
                                                    chatId: chatId
                                                });
                                            } else {
                                                res.render("showProfilePage", {
                                                    title: "User Page",
                                                    user: data,
                                                    result: result,
                                                    skills: result.skills,
                                                    experience: result.experience,
                                                    education: result.education,
                                                    Countries: Countries,
                                                    feedBacks: feedBacks,
                                                    existFeedBack: null,
                                                    hasChat: hasChat,
                                                    chatId: chatId
                                                });
                                            }
                                        })

                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

}
//show company profile
exports.companyProfile = (req, res) => {
    let signedChat;
    let guestChat;

    if (!req.cookies.MYtoken) {

        comapnyModel.findOne({
            _id: req.params.id
        }, (err, data) => {
            if (err) {
                res.redirect('/companyGrid');
            } else if (data) {
                res.render("showCompanyPage", {
                    title: "User Page",
                    result: data,
                    skills: data.skills,
                    experience: data.experience,
                    education: data.education,
                    Countries: Countries,
                    user: null
                });
            }
        })
    } else if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);

        let userId = decode.Id;

        userModel.findOne({
            _id: userId
        }, (err, data) => {
            if (err) {
                res.redirect('/companyGrid');
            } else if (data) {
                signedChat = data.contact;
                comapnyModel.findOne({
                    _id: req.params.id
                }, (err, result) => {
                    if (err) {
                        res.redirect('/companyGrid');
                    } else if (result) {
                        var hasChat = false;
                        let chatId;
                        guestChat = result.contact;

                        for (var i = 0; i < signedChat.length; i++) {

                            for (var x = 0; x < guestChat.length; x++) {

                                if (String(signedChat[i].chatId) == String(guestChat[x].chatId)) {
                                    hasChat = true;
                                    chatId = signedChat[i].chatId;
                                    break;
                                }
                            }

                        }
                        res.render("showCompanyPage", {
                            title: "User Page",
                            user: data,
                            result: result,
                            skills: result.skills,
                            experience: result.experience,
                            education: result.education,
                            Countries: Countries,
                            hasChat: hasChat,
                            chatId: chatId
                        });
                    }
                })
            } else {
                comapnyModel.findOne({
                    _id: userId
                }, (err, data) => {
                    if (err) {
                        res.redirect('/companyGrid');
                    } else {
                        signedChat = data.contact;
                        comapnyModel.findOne({
                            _id: req.params.id
                        }, (err, result) => {
                            if (err) {
                                res.redirect('/companyGrid');
                            } else if (result) {
                                var hasChat = false;
                                let chatId;
                                guestChat = result.contact;

                                for (var i = 0; i < signedChat.length; i++) {

                                    for (var x = 0; x < guestChat.length; x++) {

                                        if (String(signedChat[i].chatId) == String(guestChat[x].chatId)) {
                                            hasChat = true;
                                            chatId = signedChat[i].chatId;
                                            break;
                                        }
                                    }

                                }
                                res.render("showCompanyPage", {
                                    title: "User Page",
                                    user: data,
                                    result: result,
                                    skills: result.skills,
                                    experience: result.experience,
                                    education: result.education,
                                    Countries: Countries,
                                    hasChat: hasChat,
                                    chatId: chatId
                                });
                            }
                        })
                    }
                })
            }
        })
    }
}
/////////////
// exports.postPage=(req,res)=>{
//     res.render("postPage",{
//         title:"Post Page",
//         user:null
//     });
// }

//Apply Job
// exports.applyJob = (req, res) => {
//     const cookiesToken = req.cookies.MYtoken;
//     if (!cookiesToken) {
//         // user is Annonomas
//         var id = req.params.id;
//         postModel.findOne({
//             _id: id
//         }).populate('creatorCompany').then(
//             (post) => {
//                 if (!post) {

//                 } else {
//                     res.render("applyJob", {
//                         title: "Apply Job",
//                         user: null,
//                         post: post
//                     });
//                 }
//             }
//         ).catch((e) => {
//             res.send('Sorry There are A proplem : ' + e)
//         })
//     } else {
//         //search in Company Model
//         var decode = jwt.verify(cookiesToken, publicKey);
//         //req.userData = { email: decode.user,Id:decode.Id };
//         let userId = decode.Id;
//         comapnyModel.findOne({
//             _id: userId
//         }, (err, data) => {
//             if (err) {
//                 res.redirect("/companyPost/allDataPosts");
//             } else if (!data) {
//                 //    search in users
//                 var decode = jwt.verify(cookiesToken, publicKey);
//                 let userId = decode.Id;
//                 userModel.findOne({
//                     _id: userId
//                 }, (err, data) => {
//                     if (err) {} else {
//                         if (data) {
//                             var id = req.params.id;
//                             postModel.findOne({
//                                 _id: id
//                             }).then(
//                                 (post) => {
//                                     if (!post) {

//                                     } else {
//                                         res.render("applyJob", {
//                                             title: "Apply Job",
//                                             user: data,
//                                             post: post
//                                         });
//                                     }
//                                 }
//                             ).catch((e) => {
//                                 res.send('Sorry There are A proplem : ' + e)
//                             })
//                         }
//                     }
//                 })
//                 // end search in user
//             } else {
//                 var id = req.params.id;
//                 postModel.findOne({
//                     _id: id
//                 }).then(
//                     (post) => {
//                         if (!post) {

//                         } else {
//                             res.render("applyJob", {
//                                 title: "Apply Job",
//                                 user: data,
//                                 post: post
//                             });
//                         }
//                     }
//                 ).catch((e) => {
//                     res.send('Sorry There are A proplem : ' + e)
//                 })
//             } //search in users Model
//         })
//     }
//     // Start The Api
//     // postModel.findOne({_id:req.params.id}).then(
//     //     (post)=>{
//     //         if(!post){

//     //         }else{
//     //             res.render("applyJob",{
//     //                 title:"Apply Job",
//     //                 user:null,
//     //                 post:post
//     //             });
//     //         }
//     //     }
//     // ).catch((e)=>{res.send('Sorry There are A proplem : '+e)})
//     // End The Api
// }


exports.applyJob = (req, res) => {
    try {
        const cookiesToken = req.cookies.MYtoken;
        if (!cookiesToken) {
            res.render('error', {
                title: 'Sorry',
                p: 'You Are Not A User PLZ Go To Login And Apply Agin :)'
            })
        } else {
            var decode = jwt.verify(cookiesToken, publicKey);
            let userId = decode.Id;
            var id = req.params.id;
            userModel.findOne({
                _id: userId
            }).then(
                user => {
                    console.log('user =  ' + user);
                    if (!user) {
                        res.render('error', {
                            title: 'Sorry',
                            p: 'You Are Not A User :(('
                        })
                    } else {
                        postModel.findOne({
                            _id: id
                        }).then(
                            post => {
                                console.log('post =  ' + post);
                                if (!post) {
                                    res.render('error', {
                                        title: 'Sorry',
                                        p: 'This Post Not Found :('
                                    })
                                } else {
                                    res.render("applyJob", {
                                        title: "Apply Job",
                                        user: user,
                                        post: post
                                    });
                                }
                            }
                        )

                    }
                }
            ).catch(e => {
                console.log(e)
            })
        }
    } catch (e) {
        console.log(e)
    }
}

//Find Company
exports.getCompanyList = (req, res) => {
    const Countries = country.country_list;
    if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        var userId = decode.Id;
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, data) => {
            if (err) {
                // res.render("companylisting",{
                //         title:"Find Employee"
                //        });
                res.json(err);
            } else if (data) {
                let query = comapnyModel.find(null);

                query.exec((err, companies) => {
                    compCategories.find({}, (err, categories) => {
                        res.render("companylisting", {
                            title: "Find Employee",
                            user: data,
                            users: companies,
                            Countries: Countries,
                            userId: userId,
                            categories: categories
                        });
                    })

                })


            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("companylisting", {
                            title: "Find Employee"
                        });
                    } else if (comp) {
                        let query = comapnyModel.find(null);

                        query.exec((err, companies) => {

                            compCategories.find({}, (err, categories) => {
                                const x = categories;
                                res.render("companylisting", {
                                    title: "Find Employee",
                                    user: comp,
                                    users: companies,
                                    Countries: Countries,
                                    userId: userId,
                                    categories: categories
                                });
                            })

                        })
                    }
                })
            }

        })
    } else {
        let query = comapnyModel.find(null);
        compCategories.find({}, (err, categories) => {
            if (!categories) {
                return res.render('error', {
                    title: 'kjsv',
                    p: 'jsdng'
                })
            } else {
                query.exec((err, companies) => {
                    res.render("companylisting", {
                        title: "Find Employee",
                        user: null,
                        users: companies,
                        Countries: Countries,
                        userId: userId,
                        categories: categories,
                    });
                })

            }

        })
        // query.exec((err, companies) => {
        //     res.render("companylisting", {
        //         title: "Find Employee",
        //         user: null,
        //         users: companies,
        //         Countries: Countries,
        //         userId: userId,
        //         categories: '',
        //     });
        // })
    }
}



//get About Page
exports.getAboutPage = (req, res) => {

    if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        var userId = decode.Id;
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, data) => {
            if (err) {
                res.render("about", {
                    title: "About"
                });
            } else if (data) {
                res.render("about", {
                    title: "About",
                    user: data,
                    userId: userId
                });
            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("about", {
                            title: "About"
                        });
                    } else if (comp) {
                        res.render("about", {
                            title: "About",
                            user: comp,
                            userId: userId
                        });
                    }
                })
            }
        })
    } else {
        res.render("about", {
            title: "About",
            user: null
        });
    }

}

//get privacy Policy

exports.getprivacyPolicy = (req, res) => {
    if (req.cookies.MYtoken) {
        const cookiesToken = req.cookies.MYtoken;
        var decode = jwt.verify(cookiesToken, publicKey);
        var userId = decode.Id;
        const email = decode.user;
        userModel.findOne({
            email: email
        }, (err, data) => {
            if (err) {
                res.render("privacyPolicy", {
                    title: "Privacy Policy"
                });
            } else if (data) {
                res.render("privacyPolicy", {
                    title: "Privacy Policy",
                    user: data,
                    userId: userId
                });
            } else {
                comapnyModel.findOne({
                    email: email
                }, (err, comp) => {
                    if (err) {
                        res.render("privacyPolicy", {
                            title: "Privacy Policy"
                        });
                    } else if (comp) {
                        res.render("privacyPolicy", {
                            title: "Privacy Policy",
                            user: comp,
                            userId: userId
                        });
                    }
                })
            }
        })
    } else {
        res.render("privacyPolicy", {
            title: "Privacy Policy",
            user: null
        });
    }
}