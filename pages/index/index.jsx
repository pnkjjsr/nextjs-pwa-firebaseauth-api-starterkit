import React, { Component, Fragment } from "react";
import Link from 'next/link';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import user from "../../components/User/actions"
import homeActions from "./action"

import { service } from '../../utils';
import notification from "../../components/Notification/actions"

import authSession from "../../components/utils/authSession"
import authentication from "../../components/utils/authentication"

import "./style.scss";

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 0,
      email: "",
      password: "",
      confirmPassword: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
  }

  handleChange(e) {
    let elem = e.target.name;

    this.setState({
      [elem]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;
    const { notification, user, homeActions } = this.props;

    if (password !== confirmPassword) {
      return notification.showNotification({
        message: "Passwords must match"
      })
    }
    else {
      const auth = new authentication;
      auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          if (res.code) {
            notification.showNotification(res)
          }
          else {
            const session = new authSession;
            let token = res.user.uid;
            session.setToken(token);
            user.updateUser({ token: token });

            const data = {
              uid: token,
              email: email,
              password: password,
              confirmPassword: confirmPassword
            }
            service.post('/signup', data)
              .then((res) => {
                homeActions.get_verification();
                auth.sendEmailVerification()

              }).catch(async (error) => {
                let data = error.response.data;
                let msg = data[Object.keys(data)[0]]
                let obj = { message: msg }

                notification.showNotification(obj)
              });
          }
        })
        .catch(error => {
          notification.showNotification(error)
        })
    }


  }

  handleVerification(e) {
    e.preventDefault();
    const auth = new authentication;
    auth.sendEmailVerification()
  }

  renderHome = () => {
    return (
      <div className="text-center">
        HomePage
      </div>
    )
  }

  renderRegistration = () => {
    return (
      <div className="w-full max-w-xs mx-auto pt-4">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleSubmit}>
          <h1 className="mb-4 text-lg font-bold">
            User Registration
            </h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="username">
              Email <span className="font-hairline text-xs"></span>
            </label>
            <input name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="ex: abc@cba.com" onChange={this.handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
              Password <span className="font-hairline text-xs"></span>
            </label>
            <input name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******" autoComplete="true" onChange={this.handleChange} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
              Confirm Password <span className="font-hairline text-xs"></span>
            </label>
            <input name="confirmPassword" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******" autoComplete="true" onChange={this.handleChange} />
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Create My Account
              </button>
          </div>
          <div className="text-gray text-xs font-hairline mt-2">
            Alrady registered, click here to <Link href="/login">
              <a className="font-medium text-blue-600">login</a>
            </Link>
          </div>
        </form>
        <hr />
        <p className="text-gray text-xs italic font-hairline">
          By proceeding, I'm agreed 'Terms & Conditions' and 'Privary Policy'
        </p>
      </div>
    )
  }

  renderVerification = () => {
    return (
      <div className="w-full max-w-xs mx-auto pt-4">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleVerification}>
          <h1 className="mb-4 text-lg font-bold">
            Verification link sent on your email id.
          </h1>

          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Send Verification link again
            </button>
          </div>
        </form>
        <hr />
        <p className="text-gray-500 text-xs italic font-hairline">By clicking on button, I'm agreed to send verification link on my email id.</p>
      </div>
    )
  }

  componentDidMount() {
    const { homeActions } = this.props;
    homeActions.get_verification();
  }

  render() {
    const { home } = this.props;

    if (home.view === 0) {
      return this.renderRegistration()
    }
    else if (home.view === 1) {
      return this.renderVerification()
    }
    else if (home.view === 2) {
      return this.renderHome()
    }
    <style jsx>{``}</style>
  }
};

const mapDispatchToProps = dispatch => ({
  homeActions: bindActionCreators(homeActions, dispatch),
  user: bindActionCreators(user, dispatch),
  notification: bindActionCreators(notification, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Home);
