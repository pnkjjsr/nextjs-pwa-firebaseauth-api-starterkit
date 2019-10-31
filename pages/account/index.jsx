import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import accountActions from "./actions"

import withAuth from '../../components/utils/withAuth'

import Location from './location'
import Mobile from './mobile'


import "./style.scss";

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: 0,
      mobile: 0
    }
    this.dbListener = this.dbListener.bind(this);
  }

  dbListener = () => {
    const { user } = this.props;
    if (user.uid) {
      var db = firebase.firestore();
      let usersRef = db.collection('users').doc(user.uid);
      let getDoc = usersRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            let vLocation = doc.data().v_location;
            let vMobile = doc.data().v_mobile;

            this.setState({
              vLocation: vLocation,
              vMobile: vMobile
            });
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }
  }

  renderDashboard = () => {
    const { user } = this.props
    return (
      <div className="p-4 shadow rounded bg-white">
        <h1 className="text-teal-500 text-2xl leading-normal">
          Account
        </h1>
        <hr />
        <img src={user.photo} alt="" />
        <br />
        {user.name} [{user.uid}] [{JSON.stringify(user.eVerified)}]
        <br />
        {user.email}
        <br />
        {user.mobile}
      </div>
    )
  }

  renderAccount = () => {
    const { account } = this.props;


    if (account.location !== 1) {
      return (<Location />)
    }
    else if (account.mobile !== 1) {
      return (<Mobile />)
    }
    else if (account.location === 1 && account.mobile === 1) {
      return this.renderDashboard()
    }
  }

  componentDidMount() {
    const { account, accountAction } = this.props;
    accountAction.prefetchData();

    if (account.pincode) {
      this.setState({
        location: 1
      });
    }

  }

  render() {
    this.dbListener();

    return (
      <Fragment>
        {this.renderAccount()}
        <style jsx>{``}</style>
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  accountAction: bindActionCreators(accountActions, dispatch)
})

export default connect(state => state, mapDispatchToProps)(withAuth(Account));
