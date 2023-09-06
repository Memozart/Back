const config = require('../config');
const userModel = require('../models/user.model');
const Review = require('../models/review.model');
const { CONFIG_SEQUENCE_DEMO } = require('../utils/constants');

const getAllUsersWichHaveDevices = async () => {
  const users = await userModel.find().select(['devices', '_id', 'currentOrganisation']);
  const usersWithDevices = users.filter(user => user.devices.length > 0);
  return usersWithDevices;
};

const getAllReviewForUsersHaveDevices = async () => {
  const usersWithDevices = await getAllUsersWichHaveDevices();
  const usersWithCards = [];
  for (const user of usersWithDevices) {
    const pageSize = 1;
    const dateMaxReview = CONFIG_SEQUENCE_DEMO.getMaxDateReview();
    const query = {
      user: user._id,
      organisation: user.currentOrganisation,
      nextPresentation: { [`${CONFIG_SEQUENCE_DEMO.criteriaSearchDate}`]: dateMaxReview }
    };
    const page = 1;
    const reviews = await Review.find(query)
      .sort({ nextPresentation: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(['-nextPresentation', '-user'])
      .populate({
        path: 'theme',
        select: '-_id',
      })
      .populate({
        path: 'step',
        select: '-_id', // exclut le champs 'réponse'
      })
      .populate({
        path: 'card',
        select: '-answer -theme -_id', // exclut le champs 'réponse'
      })
      .populate({
        path: 'organisation',
        select: 'name -_id', // inclus uniquement le champs 'name'
      })
      .lean();
    if(reviews.length > 0){
      usersWithCards.push(user);
    }
  }
  return usersWithCards;
};

const sendNotification = async (devices, title, message) => {
  const fetches = [];
  for (const device of devices) {
    const sendData = {
      to: device.token,
      notification: {
        title: title,
        body: message,
      },
    };
    fetches.push(fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + config.messagingKey,
      },
      body: JSON.stringify(sendData),
    }));
  }
  await Promise.all(fetches);
};

const devicesChanges = async (userId, deviceDatas) => {
  const user = await userModel.findById(userId);
  const devices = user.devices;
  const deviceToUpdate = devices.find(device => device.deviceId === deviceDatas.deviceId);

  if (deviceToUpdate) {
    if (deviceToUpdate.token !== deviceDatas.token) {
      deviceToUpdate.token = deviceDatas.token;
      await user.save();
    }
  } else {
    devices.push(deviceDatas);
    await user.save();
  }
};

module.exports = {
  sendNotification,
  devicesChanges,
  getAllUsersWichHaveDevices,
  getAllReviewForUsersHaveDevices
};
