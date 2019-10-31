import React, { Component, Fragment } from "react";
import Link from 'next/link';

import Router from 'next/router';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import authSession from "../../components/utils/authSession"
import authentication from "../../components/utils/authentication"

import actionNotification from "../../components/Notification/actions"
import actionUser from "../../components/User/actions"

import { service } from '../../utils';
import notification from "../../components/Notification/actions"

import "./style.scss";

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: "",
      email: "",
      password: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const { user, notification } = this.props;
    const session = new authSession;
    const auth = new authentication;

    auth.signInWithEmail(email, password)
      .then(res => {
        let token = res.user.uid;
        user.updateUser({ token: token });
        session.setToken(token);
        Router.push('/account')
      })
      .catch(error => {
        notification.showNotification(error)
      })
    return;

    const data = {
      email: email,
      password: password
    }

    service.post('/login', data)
      .then(function (res) {
        let token = res.data.token;
        user.updateUser({ token: token });
        session.setToken(token);
        Router.push('/account')
      })
      .catch(error => {
        let data = error.response.data;
        let msg = data[Object.keys(data)[0]]
        let obj = { message: msg }
        notification.showNotification(obj)
      });
  }

  handleChange(e) {
    let elem = e.target.name;

    this.setState({
      [elem]: e.target.value
    });
  }

  componentDidMount() {
    const session = new authSession;
    let token = session.getToken();

    if (token) {
      Router.push('/account')
    }
  }

  render() {
    return (
      <Fragment>
        <div className="w-full max-w-xs mx-auto pt-4">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleSubmit}>
            <h1 className="mb-4 text-lg font-bold">
              Login
            </h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
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

            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Login
              </button>
            </div>
            <div className="text-gray text-xs font-hairline mt-2">
              Create you account, click here to <Link href="/">
                <a className="font-medium text-blue-600">Registration</a>
              </Link>
            </div>
          </form>
          <hr />
          <p className="text-gray text-xs italic font-hairline">By proceeding, I'm agreed 'Terms & Conditions' and 'Privary Policy'</p>
        </div>
        <style jsx>{``}</style>
      </Fragment>
    )
  }
};

const mapDispatchToProps = dispatch => ({
  user: bindActionCreators(actionUser, dispatch),
  notification: bindActionCreators(actionNotification, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Login);