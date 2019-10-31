const withOffline = require('next-offline')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withPlugins = require("next-compose-plugins");
const withImages = require('next-images');

module.exports = withPlugins([
  withCSS,
  withSass,
  withOffline,
  withImages
]), {
  dontAutoRegisterSw: true, // since we want runtime registration
}