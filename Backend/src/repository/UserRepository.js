const User = require('../domain/user');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async save(userInstance) {
    return await userInstance.save();
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findAllDoctors() {
    return await User.find({ role: 'Doctor' });
  }

  async countDocuments(query) {
    return await User.countDocuments(query);
  }

  async find(query, options = {}) {
    let q = User.find(query);
    if (options.sort) q = q.sort(options.sort);
    if (options.limit) q = q.limit(options.limit);
    if (options.select) q = q.select(options.select);
    if (options.populate) q = q.populate(options.populate);
    return await q;
  }
}

module.exports = new UserRepository();

