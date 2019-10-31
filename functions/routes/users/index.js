const {
  admin,
  db
} = require('../../utils/admin');

const config = require('../../utils/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLocationData,
  validateLoginData,
  reduceUserDetails,
  validateMobileData,
  validateOTPData
} = require('./validators');

// Sign users up
exports.signup = (req, res) => {
  const newUser = {
    uid: req.body.uid,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  const {
    valid,
    errors
  } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }
  
  let userId = newUser.uid;
  let usersRef = db.collection('users');
  let query = usersRef.where('email', '==', newUser.email)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return res.status(400).json({
          message: 'Email is already registered with our website'
        });
      } else {
        db.doc(`/users/${userId}`)
          .get()
          .then((doc) => {
            if (doc.exists) {
              return res.status(400).json({
                handle: 'this DOC is already taken'
              });
            } else {
              const userCredentials = {
                createdAt: new Date().toISOString(),
                uid: newUser.uid,
                email: newUser.email,
                emailVerified: false,
                password: newUser.password,
                phoneNumber: '',
                phoneVerified: false,
                displayName: '',
                photoURL: ''
              };
              return db.doc(`/users/${userId}`).set(userCredentials);
            }
          })
          .then(() => {
            return res.status(201).json({
              status: "done",
              message: "New user created."
            });
          })
          .catch((err) => {
            if (err.code === 'auth/email-already-in-use') {
              return res.status(400).json({
                email: 'Email is already is use'
              });
            } else {
              return res
                .status(500)
                .json({
                  general: err.message
                });
            }
          });
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
      return res.status(400).json(err)
    })
};

exports.getLocation = (req, res) => {
  let uid = req.body.uid;
  let userRef = db.collection('users').doc(uid);
  let getDoc = userRef.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({
          message: "No such document.!"
        })
      } else {
        let data = doc.data();
        return res.status(200).json(data);
      }
    })
    .catch(error => {
      res.status(400).json({
        message: error
      })
    })
}

exports.updateLocation = (req, res) => {
  let token = req.body.token;
  const validationData = {
    token: req.body.token,
    address: req.body.address,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  }
  const {
    valid,
    errors
  } = validateLocationData(validationData);

  if (!valid) return res.status(400).json(errors);

  const data = {
    uid: req.body.token,
    address: req.body.address,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  }

  db.collection('users').doc(token).update(data)
    .then(function () {
      return res.json({
        status: 'done',
        message: "Location update in user document"
      });
    })
    .catch(function (error) {
      return res.status(400).json(error)
    });
}

// Update Mobile
exports.updatePhone = (req, res) => {
  const validationData = {
    token: req.body.token,
    country_code: req.body.country_code,
    phoneNumber: req.body.phoneNumber
  }
  const {
    valid,
    errors
  } = validateMobileData(validationData);
  if (!valid) return res.status(400).json(errors);

  let token = req.body.token;
  const data = {
    country_code: req.body.country_code,
    phoneNumber: req.body.phoneNumber
  }

  db.collection('users').doc(token).update(data)
    .then(() => {
      return res.json({
        status: 'done',
        messsage: "Phone update in user document"
      });
    })
    .catch(function (error) {
      return res.status(400).json(error)
    });
}
exports.verifyPhone = (req, res) => {
  const validationData = {
    token: req.body.token,
    phoneVerified: req.body.phoneVerified
  }
  const {
    valid,
    errors
  } = validateOTPData(validationData);
  if (!valid) return res.status(400).json(errors);

  let token = req.body.token;
  const data = {
    phoneVerified: req.body.phoneVerified
  }

  db.collection('users').doc(token).update(data)
    .then(() => {
      return res.json({
        status: 'done',
        messsage: "Phone verified in user document"
      });
    })
    .catch(function (error) {
      return res.status(400).json(error)
    });
}

// Log user in
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const {
    valid,
    errors
  } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.uid;
    })
    .then((token) => {
      return res.json({
        token
      });
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({
          status: "done",
          message: 'Wrong credentials, please try again'
        });
    });
};

exports.logout = (req, res) => {
  firebase.auth().signOut().then(function () {
    res.json({
      status: 'done',
      message: "Log user out."
    });
  }).catch(function (error) {
    res.status(400).json(error)
  });
}

// Send Email Verification
exports.sendEmailVerification = (req, res) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (!user.emailVerified) {
        user.sendEmailVerification()
          .then(function () {
            return res.json({
              status: 'done',
              message: "Verification email sent.",
            });
          }).catch(function (error) {
            return res.status(400).json(error)
          });
      }
    } else {
      return res.status(400).json({
        error: "Not Logged In"
      })
    }
  });
}

// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({
        message: 'Details added successfully'
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {
    uid: req.body.uid
  }

  admin.auth().createCustomToken(userData.uid)
    .then(function (customToken) {
      firebase.auth().signInWithCustomToken(customToken)
        .then(function (result) {
          return res.status(201).json(result);
        })
        .catch(function (error) {
          return res.status(400).json(error)
        });
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error
      });
    });




  // db.doc(`/users/${req.params.handle}`)
  //   .get()
  //   .then((doc) => {
  //     if (doc.exists) {
  //       userData.user = doc.data();
  //       return db
  //         .collection('screams')
  //         .where('userHandle', '==', req.params.handle)
  //         .orderBy('createdAt', 'desc')
  //         .get();
  //     } else {
  //       return res.status(404).json({
  //         errror: 'User not found'
  //       });
  //     }
  //   })
  //   .then((data) => {
  //     userData.screams = [];
  //     data.forEach((doc) => {
  //       userData.screams.push({
  //         body: doc.data().body,
  //         createdAt: doc.data().createdAt,
  //         userHandle: doc.data().userHandle,
  //         userImage: doc.data().userImage,
  //         likeCount: doc.data().likeCount,
  //         commentCount: doc.data().commentCount,
  //         screamId: doc.id
  //       });
  //     });
  //     return res.json(userData);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return res.status(500).json({
  //       error: err.code
  //     });
  //   });
};
// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection('likes')
          .where('userHandle', '==', req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection('notifications')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
// Upload a profile image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({
    headers: req.headers
  });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({
        error: 'Wrong file type submitted'
      });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          config.storageBucket
        }/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({
          imageUrl
        });
      })
      .then(() => {
        return res.json({
          message: 'image uploaded successfully'
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          error: 'something went wrong'
        });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, {
      read: true
    });
  });
  batch
    .commit()
    .then(() => {
      return res.json({
        message: 'Notifications marked read'
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};