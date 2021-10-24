var email = require("../node_modules/emailjs/email");
var server = email.server.connect({
    user: "your email id",
    password: "your email id password",
    host: "smtp.gmail.com",
    tls: { ciphers: "SSLv3" }
});
module.exports.sendMail = function (message) {
    return server.send(message, function (err, message) {

        if (err) {
            console.log('error while sending mail', err.toString())
        } else {
            console.log('mail sent successfully.')

        }
    });
};