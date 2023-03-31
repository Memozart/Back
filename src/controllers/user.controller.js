const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../middlewares/user.middleware');
const tool = require('../utils/tool');


const changeCurrentOrganisation = catchAsync(async (req, res, next) => {
  const { organisationId } = req.body;
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const user = await userService.changeCurrentOrganisation(userId, organisationId);
  const accessToken = generateAccessToken({ user });
  const refreshToken = await generateRefreshToken({ user });
  // add accessToken and refresh token to it
  const toReturn = {
    auth: {
      refreshToken,
      accessToken
    },
    organisationId: user.currentOrganisation
  };
  successF('Current organisation changed', toReturn, 200, res, next);
});

module.exports = {
  changeCurrentOrganisation,
};