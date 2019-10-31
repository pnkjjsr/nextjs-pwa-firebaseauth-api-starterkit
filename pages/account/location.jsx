import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import actions from "./actions";

import authSession from "../../components/utils/authSession"

import { service } from '../../utils';
import notification from "../../components/Notification/actions"



import "./style.scss";

class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: "",
      address: "",
      state: "",
      pincode: "",
      country: "India"
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let elem = e.target.name;

    this.setState({
      [elem]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { address, state, pincode, country } = this.state;
    const session = new authSession();
    const token = session.getToken();
    const data = {
      token: token,
      address: address,
      state: state,
      pincode: pincode,
      country: country
    }

    service.post('/location', data).then((res) => {
      const { action } = this.props;
      action.update_location();
    }).catch(async (error) => {
      let data = error.response.data;
      let msg = data[Object.keys(data)[0]]
      let obj = { message: msg }

      notificationAction.showNotification(obj);
    });
  }

  render() {
    return (
      <Fragment>
        <div className="w-full max-w-xs mx-auto pt-4">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleSubmit}>
            <h1 className="mb-4 text-lg font-bold">
              Select Your Area
            </h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="address">
                Address <span className="font-hairline text-xs">[area, street name]</span>
              </label>
              <input name="address" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="house, floor, street" onChange={this.handleChange} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="state">
                State
              </label>
              <div className="relative">
                <select name="state" className="shadow appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={this.handleChange}>
                  <option>Select</option>
                  <option>New Delhi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="pincode">
                Pincode
                </label>
              <input name="pincode" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="ex: 110064" onChange={this.handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="country">
                Country <span className="font-hairline text-xs">[pre-defined]</span>
              </label>
              <input name="country" className="shadow appearance-none border rounded bg-gray-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="India" disabled="disabled" value="India" onChange={this.handleChange} />
            </div>

            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Proceed
              </button>
            </div>
          </form>
          <hr />
          <p className="text-gray text-xs italic font-hairline">By proceeding, I'm agreed 'Terms & Conditions' and 'Privary Policy'</p>
        </div>

        <style jsx>{``}</style>
      </Fragment>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(actions, dispatch),
  notificationAction: bindActionCreators(notification, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Location);
