const messagingService = require('../services/messaging.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const tool = require('../utils/tool');

const devicesChanges = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const device = {
    deviceId: req.body.deviceId,
    token: req.body.token,
  };
  await messagingService.devicesChanges(userId, device);
  successF('Devices updated', null, 200, res, next);
});

module.exports = {
  devicesChanges,
};