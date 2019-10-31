import React, { Component } from "react";
import Router from 'next/router';
import Link from 'next/link';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import userAction from './actions'
import homeActions from '../../pages/index/action'

import authSession from '../utils/authSession'
import authentication from "../utils/authentication"

import Nav from "../Nav"
import './style.scss';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      uid: "",
      name: "",
      eVerified: "",
      email: "",
      mobile: "",
      photo: ""
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    const auth = new authSession;
    let _ = this;
    const { userAction } = this.props;

    // signInWithRedirect
    // signInWithPopup
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async function (result) {

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(user);
          return;
        }
      })

      _.setState({
        name: result.user.displayName,
        eVerified: result.user.emailVerified,
        email: result.user.email,
        mobile: result.user.phoneNumber,
        photo: result.user.photoURL,
        uid: result.user.uid
      });
      await userAction.updateUser(_.state);
      await _.props.authAction.authenticate({ email_id: result.user.email, token: result.credential.accessToken },
        'login');

      await auth.login(result.user.email, result.credential.accessToken);
      await auth.setProfile(_.state);
    }).catch(function (error) {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Google credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get sign-in methods for this email.
        auth.fetchSignInMethodsForEmail(email).then(function (methods) {
          // Step 3.
          // If the user has several sign-in methods,
          // the first method in the list will be the "recommended" method to use.
          if (methods[0] === 'password') {
            // Asks the user their password.
            // In real scenario, you should handle this asynchronously.
            var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
            auth.signInWithEmailAndPassword(email, password).then(function (user) {
              // Step 4a.
              return user.linkWithCredential(pendingCred);
            }).then(function () {
              // Google account successfully linked to the existing Firebase user.
              goToApp();
            });
            return;
          }
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          var provider = getProviderForProviderId(methods[0]);
          // At this point, you should let the user know that he already has an account
          // but with a different provider, and let him validate the fact he wants to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          auth.signInWithPopup(provider).then(function (result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Google credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function (usercred) {
              // Google account successfully linked to the existing Firebase user.
              goToApp();
            });
          });
        });
      }
    });
  }

  handleLogout(e) {
    e.preventDefault();
    const { userAction, homeAction } = this.props;
    const session = new authSession()
    const auth = new authentication()

    this.setState({
      user: "",
      name: "",
      eVerified: "",
      email: "",
      mobile: "",
      photo: "",
      uid: "",
      token: ""
    }, () => userAction.updateUser(this.state));

    homeAction.get_registration();
    session.logout();
    auth.signOut();
    Router.push('/');
  }

  componentDidMount() {
    let session = new authSession();
    let token = session.getToken();
    if (!token) {
      return
    }
    else {
      let data = {
        uid: token
      }
      this.setState({
        token: token
      });
      // service.post('/user', data).then((res) => {
      //   let token = res.data.customToken;
      // }).catch(async (error) => {
      //   console.log(error);
      //   let data = error.response.data;
      //   let msg = data[Object.keys(data)[0]]
      //   let obj = { message: msg }
      //   notification.showNotification(obj)
      // });
    }
  }

  render() {
    const { token, name, photo } = this.state;
    const { user } = this.props;

    return (
      <div className="auth">
        {user.token || token ? (
          <Nav name={name} photo={photo} action={this.handleLogout} />
        ) : (
            <Link href="/login">
              <a>Login</a>
            </Link>
          )
        }
      </div>
    );
  }

}
const mapDispatchToProps = dispatch => ({
  userAction: bindActionCreators(userAction, dispatch),
  homeAction: bindActionCreators(homeActions, dispatch)
})

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(User);