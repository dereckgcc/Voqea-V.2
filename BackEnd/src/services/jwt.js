'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        job: user.job,
        area: user.area,
        company: user.company,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}