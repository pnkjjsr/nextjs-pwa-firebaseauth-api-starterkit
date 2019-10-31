import firebase from "firebase/app";
import 'firebase/auth'
import clientCredentials from "./client";
import { service } from "../../utils"

export default class Authentication {
    constructor(props) {
        this.signInWithEmail = this.signInWithEmail.bind(this);
    }

    initialize() {

        if (!firebase.apps.length) {
            firebase.initializeApp(clientCredentials);
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    console.log(user);
                } else {
                    console.log("Not Logged In");
                }
            })
        }

    }

    createUserWithEmailAndPassword(email, password) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.initialize();
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    resolve(result);
                }).catch(function (error) {
                    resolve(error);
                });
        });
    }

    signInWithEmail(email, password) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.initialize();
            firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
                resolve(result);
            }).catch(function (error) {
                resolve(error);
            });
        });

    }

    signOut() {
        this.initialize();
        firebase.auth().signOut().then(function (result) {
            console.log("Logout Successfully");
        }).catch(function (error) {
            console.log(error);
        })
    }

    recaptchaVerifier(e) {
        this.initialize()
        let recaptchaVerifier
        return recaptchaVerifier = new firebase.auth.RecaptchaVerifier(e, {
            'size': 'invisible',
            'callback': function (response) {
                onSignInSubmit();
            }
        });
    }

    async signInWithPhoneNumber(phoneNumber, appVerifier) {
        let confirm
        await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                confirm = confirmationResult;
            }).catch(function (error) {
                console.log(error);
            });
        return confirm;
    }

    signInWithCustomToken(token) {
        let user
        const data = {
            uid: token
        }
        service.post("/user", data)
            .then(result => {
                user = result;
            })
            .catch(error => {
                console.log(error);
            })
        return user
    }

    async linkWithPhoneNumber(phoneNumber, appVerifier) {
        let confirm
        await firebase.auth().currentUser.linkWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                confirm = confirmationResult
            }, function (error) {
                console.log(error);
            });
        return confirm
    }

    sendEmailVerification() {
        this.initialize();

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                user.sendEmailVerification()
                    .then(function () {
                        return console.log("Verification email sent.");
                    }).catch(function (error) {
                        return console.log(error);
                    });
            } else {
                console.log("Not Logged In");

            }
        });
    }
}