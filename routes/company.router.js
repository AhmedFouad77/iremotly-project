const express = require('express');
const router = express.Router();
const compCont = require('../controllers/company.controller');
const verify = require("../controllers/validToken");

// company Routes


router.get('/companyProfile', verify.valid, compCont.getCompanyProfile);
// router.get('/companylisting',compCont.getcompanylisting);
router.get('/companySetting', verify.valid, compCont.getCompanyAccountSetting);
router.get('/dashboard', verify.valid, compCont.getCompanydashboard);
// Router.post('/signUp',compCont.signUp);
router.post('/companySetting/update', compCont.updateCompanyDatat);

router.post('/companySetting/uploadProfilePhoto', verify.valid, compCont.uploadProfilePhoto);
router.post('/companySetting/uploadCoverPhoto', verify.valid, compCont.uploadCoverPhoto);
// Router.post('/login' , compCont.login);
router.post('/deleteCompany', compCont.delete_company);
router.post('/changePassword', verify.valid, compCont.changePassword);
router.post('/deleteAccount', verify.valid, compCont.deleteAccount);


router.post('/reset', compCont.resetPassword);
router.post('/getnewPassword', compCont.getNewPassword);
// Router.post('/VerifaiToken' , compCont.VerifaiToken)



module.exports = router;