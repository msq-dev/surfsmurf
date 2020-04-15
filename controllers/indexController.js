const Spot = require('../models/spot');

exports.index = (req, res, next) => {
  Spot.find()
  .populate('spot')
  .sort([['spot_name', 'ascending']])
  .exec(function(err, list_spots) {
    if (err) { return next(err); }
    res.render('index', { spots_list: list_spots, user_name: req.user.user_name })
  })
};

exports.delete_spot = (req, res, next) => {
  Spot.findByIdAndDelete(req.body.spotid, function deleteSpot(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}
