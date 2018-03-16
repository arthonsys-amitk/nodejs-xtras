var auth      = require('./auth'),
    user      = require('./user'),
    purchase   = require('./purchase'),
    product = require('./product'),
	contact = require('./contact'),
    mail      = require('./mail.js');


module.exports = {
  auth      : auth,
  user      : user,
  product   : product,
  purchase  : purchase,
  contact  : contact,
  mail      : mail,
};
