const Notification = require('../domain/Notification');

class NotificationRepository {
  async create(notificationData) {
    return await Notification.create(notificationData);
  }

  async findByRecipientId(recipientId) {
    return await Notification.find({ recipientId }).sort({ createdAt: -1 });
  }

  async markAsRead(id) {
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }
}

module.exports = new NotificationRepository();
