router.post(
    '/createAcount',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9\s-\s+\/\=!@#$%^&*]{8,16}$/).withMessage('password is invalid'),
       // body('accountType').isBoolean().withMessage('accountType is invalid'),
        body('userName').isAlpha().withMessage('please provide a valid user name'),
       // body('address').isLength({min: 4}).withMessage('please enter a valid address'),
       // body('phone').isMobilePhone().withMessage('please enter a valid phone')
    ],
authController.creatAcount)

exports.creatAcount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      errorMessage: errors.array()[0].msg
    })
  }
  const accountType = req.body.accountType;
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  try {

    let token;
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        const error = new Error('Something Worng Happen we are sorry please try agian later');
        error.statusCode = 500;
        throw error;
      }
      token = buffer.toString('hex');
    })

    const user = await WalletUser.findOne({
      email: email
    })

    if (user) {
      const error = new Error('A user with this email is already exist');
      error.statusCode = 401;
      throw error;
    }

    const hash = await bcrypt.hash(password, 12)

    const walletUser = new WalletUser({
      email: email,
      userName: userName,
      accountType: accountType,
      password: hash,
      verifcationToken: token,
      verificationExpirationData: Date.now() + 3600000,
      status: 1
    })

    const createdUser = await walletUser.save()

    mailService.sendVerificationEmail(email, token, createdUser.userName)

    res.status(201).json({
      message: "acount created Succefully we send you an email verification please check your inbox"
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err);
  }
}
