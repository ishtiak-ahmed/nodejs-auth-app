module.exports.verifyRefreshToken = async (req, res) => {
  try {
    const refresh = req.headers.refreshToken;
    // verify refresh token
    // if valid generate new refresh and access token
    // update refresh token
    // send new tokens to user
    res.status(201).json({access: refresh, refresh});
  } catch (error) {
    console.log(error);
    // new throw Error(error);
    res.status(500).json('Error in login');
  }
};