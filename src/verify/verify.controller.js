const verifyService = require('./verify.service');
const userService = require('../user/user.service');
const generate = require('../utils/generateToken');
const mail = require('../utils/sendVerificationMail');
// send mail
module.exports.sendVerificationMail = async(email) => {
  console.log('sending verification mail..');
  try {
    const generatedToken = await generate.gereratedToken(email, 5);
    console.log('generated', generatedToken);
    const verify = await verifyService.createVerifyToken({ email, generatedToken });
    if (verify) {
      const res = await mail.sendVerification(email, verify.generatedToken);
      if(res) return {error: false, message: 'Verification mail send'};
    }
  } catch (error) {
    console.log(error);
  }
};

// verify user
module.exports.verifyUser = async(req, res) => {
  console.log('verifying user');
  try {
    const token = req.params.token;
    const existingToken = await verifyService.findByToken(token);
    if(existingToken){
      if(existingToken.isVerified){
        return res.status(201).json({message: 'Email already verified'});
      }
      const verifyUser = await userService.verifyUserEmail(existingToken.email);
      if(verifyUser) await verifyService.verifyUser(existingToken._id);
      return res.status(201).json({error: false, message: 'Email verified'});    
    }
    return res.status(404).json({ error: true, message: 'Invalid token' });    
  } catch (error) {
    console.log(error);
    return res.status(404).json({error: true, message: 'Something went wrong'});
  }
};