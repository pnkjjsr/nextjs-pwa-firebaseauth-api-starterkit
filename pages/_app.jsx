import React from "react";
import App, { Container } from "next/app";

import { Provider } from 'react-redux';
import withRedux from "next-redux-wrapper";
import { initStore } from "../redux/store";

import Layout from "../components/Layout";
import Notification from "../components/Notification"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Layout pageTitle="">
            <Notification />
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore, { debug: true })(MyApp);
