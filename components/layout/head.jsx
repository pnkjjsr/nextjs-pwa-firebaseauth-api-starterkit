import React, { Fragment } from "react";
import NextHead from "next/head";
import { string } from "prop-types";
import { connect } from "react-redux";


const defaultDescription = "";
const defaultOGURL = "";
const defaultOGImage = "";

const Header = props => (
  <Fragment>
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{`${props.title} | Web title`}</title>
      <meta
        name="description"
        content={props.desc || defaultDescription}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" />
      <link rel="manifest" href="static/manifest.json" />
      <meta property="og:url" content={props.url || defaultOGURL} />
      <meta property="og:title" content={props.title || ""} />
      <meta
        property="og:description"
        content={props.des || defaultDescription}
      />
      <meta name="twitter:site" content={props.url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="theme-color" content="#000" />
    </NextHead>

    <noscript>
      <div className="alert  alert-warning">
        <h4>Warning!</h4>
        <h5>Javascript is disabled for this website.</h5>
        <p>Javascript is required to use this website.</p>
        <p>
          {`You won't be able to navigate in this website until you activate javascript.`}
        </p>
      </div>
    </noscript>
  </Fragment>
);

class Head extends React.Component {
  componentDidMount() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "/" })
          .then(function (registration) {
            // console.log("SW registered: ", registration);
          })
          .catch(function (registrationError) {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }

  render() {
    return <Header title={this.props.layout.title} desc={this.props.layout.desc} />;
  }
}

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
};

export default connect(state => state)(Head);
