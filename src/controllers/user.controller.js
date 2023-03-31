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
  const toStore = {
    _id: user._id,
    email: user.email,
    forname: user.forname,
    lastname: user.lastname,
    currentOrganisation: user.currentOrganisation._id,
  };
  const accessToken = generateAccessToken({ user: toStore });
  const refreshToken = await generateRefreshToken({ user: toStore });
  const toReturn = {
    auth: {
      refreshToken,
      accessToken
    },
    organisation: user.currentOrganisation,
  };
  successF('Current organisation changed', toReturn, 200, res, next);
});

module.exports = {
  changeCurrentOrganisation,
};