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
  const user = await userService.changeCurrentOrganisation(
    userId,
    organisationId
  );
  delete user.password;
  const accessToken = generateAccessToken({ user });
  const refreshToken = await generateRefreshToken({ user });
  const toReturn = {
    refreshToken,
    accessToken,
    user
  };
  successF('Current organisation changed', toReturn, 200, res, next);
});

const deleteUser = catchAsync(async (req, res, next) =>{
  const { userId  } = tool.getUserIdAndOrganisationId(req);
  await userService.deleteUser(userId);
  await successF('Current user was deleted', true, 200, res, next);
});

module.exports = {
  changeCurrentOrganisation,
  deleteUser
};
