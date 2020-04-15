const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    user_password: { type: String, required: true }
  }
);

UserSchema.methods.validPassword = async function(password) {
  if (await bcrypt.compare(password, this.user_password)) {
    return true;
  } else {
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);
