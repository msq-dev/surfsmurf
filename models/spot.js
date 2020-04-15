const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpotSchema = new Schema(
  {
    spot_name: {type: String, required: true},
    spot_longitude: {type: String, required: true},
    spot_latitude: {type: String, required: true}
  }
);

module.exports = mongoose.model('Spot', SpotSchema);
