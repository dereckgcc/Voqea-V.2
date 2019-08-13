'use strict'

const mongoose = require('mongoose');
const app = require('./app')

var User = require('./src/models/user'); 
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VOQEA', { useNewUrlParser: true }).then(()=>{
    console.log('CONNECTED TO DATABASE');

    app.set('port', process.env.PORT || 3000 );
    app.listen(app.get('port'), ()=>{
        console.log(`RUNNING ON PORT: '${app.get('port')}'`);
        Admin();
    });
}).catch(err => console.log(err));

function Admin(){
    var user = new User();
    user.name = 'admin';
    user.lastname = 'admin';
    user.email = 'admin';
    user.password = 'admin';
    user.rol = 'admin';
    user.image = '';
    user.job = 'Technical';
    user.number = 0;
    user.company = 'Voqea';
    user.area = 'Development';

    User.find({ $or:[
        {email: user.email.toLowerCase()},
        {password: user.password.toUpperCase()}
    ]}).exec((err, rols) =>{
        if(rols && rols.length >= 1){           
        }else{
            bcrypt.hash(user.password, null, null, (err, hash)=>{
            user.password = hash;
            user.save((err, usuarioGuardado)=>{  
                });
            });
        }
    });
}