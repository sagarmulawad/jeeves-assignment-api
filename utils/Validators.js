var validator = require('mongoose-validator');
module.exports.email = function(email){
    var re = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    return re.test(email);
}