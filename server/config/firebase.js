const admin = require('firebase-admin');
const serviceAccount = require('./magicmaze-firebase-adminsdk-494zo-8dead3d022.json');

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://magicmaze.firebaseio.com',
});

module.exports = {
  firebaseApp,
};
