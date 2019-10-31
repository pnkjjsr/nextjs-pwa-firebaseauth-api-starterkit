import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import accountActions from "./actions";
import notifictionActions from "../../components/Notification/actions"

import {
  service
} from "../../utils"
import authSession from "../../components/utils/authSession"
import authentication from "../../components/utils/authentication"

import "./style.scss";

class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 0,
      country_code: "+91",
      mobile: "",
      otp: "",
      verifier: "",
      confirmationResult: ""
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

  async handleSubmit(e) {
    e.preventDefault();
    const { country_code, mobile, verifier } = this.state;
    const { notificationAction } = this.props;
    const session = new authSession();
    const auth = new authentication;
    const token = session.getToken();

    let phoneNumber = `${country_code} ${mobile}`
    let appVerifier = verifier;
    let confirmationResult = await auth.linkWithPhoneNumber(phoneNumber, appVerifier)

    if (confirmationResult) {
      const data = {
        token: token,
        country_code: country_code,
        phoneNumber: mobile
      }
      service.post('/phone', data)
        .then(res => {
          this.setState({
            view: 1,
            confirmationResult: confirmationResult
          })
        })
        .catch(error => {
          notificationAction.showNotification(error);
        })
    }
  }

  handleVerification(e) {
    e.preventDefault();
    const { otp, confirmationResult } = this.state;
    const { notificationAction, accountAction } = this.props;
    let auth = new authentication;
    let session = new authSession();
    let uid = session.getToken();

    const data = {
      token: uid,
      phoneVerified: true
    }

    confirmationResult.confirm(otp).then(function (result) {
      service.post('/verifyPhone', data)
        .then(res => {
          accountAction.update_mobile();
        })
        .catch(error => {
          notificationAction.showNotification(error);
        })

    }).catch(function (error) {
      notificationAction.showNotification(error);
    });


  }

  renderMobile = () => {
    return (
      <div className="w-full max-w-xs mx-auto pt-4">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleSubmit}>
          <h1 className="mb-4 text-lg font-bold">
            Please enter your contact number
            </h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="address">
              Mobile <span className="font-hairline text-xs"></span>
            </label>
            <input name="mobile" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="Mobile" placeholder="ex: 9210 XXXX60" onChange={this.handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Proceed
              </button>
          </div>
        </form>
        <hr />
        <p className="text-gray-500 text-xs italic font-hairline">By proceeding, I'm agreed 'Terms & Conditions' and 'Privary Policy'</p>
      </div>
    )
  }

  renderVerification = () => {
    return (
      <div className="w-full max-w-xs mx-auto pt-4">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" autoComplete="off" onSubmit={this.handleVerification}>
          <h1 className="mb-4 text-lg font-bold">
            Please enter verification code
            </h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="otp">
              OTP <span className="font-hairline text-xs">one-time password</span>
            </label>
            <input name="otp" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" pattern="[0-9]*" inputMode="numeric" placeholder="ex: 123456" autoComplete="off" onChange={this.handleChange} />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Proceed
              </button>
          </div>
          <div className="text-gray text-xs font-hairline mt-2">
            Click here to <span className="font-medium text-blue-600 cursor-pointer" onClick={this.handleSubmit}>resend</span>
          </div>
        </form>
        <hr />
        <p className="text-gray-500 text-xs italic font-hairline">By proceeding, I'm agreed 'Terms & Conditions' and 'Privary Policy'</p>
      </div>
    )
  }

  componentDidMount() {
    const auth = new authentication;
    let recaptchaVerifier = auth.recaptchaVerifier(this.recaptcha);
    this.setState({
      verifier: recaptchaVerifier
    })
  }

  render() {
    const { view } = this.state;
    return (
      <Fragment>
        {view === 0 ? this.renderMobile() : this.renderVerification()}

        <div ref={(ref) => this.recaptcha = ref}></div>

        <style jsx>{``}</style>
      </Fragment >
    )
  }
}

const mapDispatchToProps = dispatch => ({
  accountAction: bindActionCreators(accountActions, dispatch),
  notificationAction: bindActionCreators(notifictionActions, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Location);
