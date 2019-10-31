const functions = require('firebase-functions');
const app = require('express')();
const main = require('express')();
const cors = require('cors');

const FBAuth = require('./utils/fbAuth');
const {
    db
} = require('./utils/admin');
const {
    signup,
    getLocation,
    updateLocation,
    login,
    sendEmailVerification,
    getUserDetails,
    updatePhone,
    verifyPhone
} = require('./routes/users');

main.use(cors());
main.use('/v1', app)
exports.api = functions.https.onRequest(main);

// User routes
app.post('/signup', signup);
app.post('/location', updateLocation);
app.post('/getLocation', getLocation);
app.post('/login', login);
app.post('/user', getUserDetails);
app.post('/email', sendEmailVerification);
app.post('/phone', updatePhone);
app.post('/verifyPhone', verifyPhone);