# Pre Deploy Steps
1. Add “serviceAccountKey.json” 
- Create firebase project. 
- Go to “Project Settings” 
- Click “Service Accounts” 
- In the bottom, “Generate new private key” (.json file auto download) 
- Copy that file to root of the project. 

2. Setup Firebase in the root. [firebase login, firebase init] 
- Function & Hosting. 
- Do not replace function folder’s file. 
- Copy “serviceAccountKey.json” function folder as-well. 
- Use public folder as you want. 

3. Copy Firebase client config for firebase JS SDK 
- Firebase “Project Overview” 
- Create web app. 
- Go to web-app setting. 
- In the bottom, click on “config” 
- Copy all object and paste in the client file 
[/components/utils/client.js] 
[/functions/utils/config.js] 

4. Enable Sign-In Method 
- Enable “Email/Password” with password less sign-in 
- Enable “Phone” add phone number for testing  ex: phone: ‘+91 9971661022’ | code: ‘123123’ 
[currently +91 is hardcode as India code.] 

5. Create database to store the data 
- Start in locked mode 
- Select your region 
- Change the “/config/env-properties.json” 
- Host, Request_baseurl and Request_BaseURL_Local 

6. Authorised Domains 
- Add domain to authorised Firebase Auth SDK 
- Ex: localhost, for local development 
- GCloud test domain. 

7. GCloud setup in root folder 
- Enable billing and “App Engine” as Node. 
- Deploy your project. 


This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Table of Contents
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm run dev](#npm-run-dev)
  - [npm run build](#npm-run-build)
  - [npm run start](#npm-run-start)
- [Using CSS](#using-css)
- [Adding Components](#adding-components)
- [Fetching Data](#fetching-data)
- [Custom Server](#custom-server)
- [Syntax Highlighting](#syntax-highlighting)
- [Using the `static` Folder](#using-the-static-folder)
- [Deploy to Now](#deploy-to-now)
- [Something Missing?](#something-missing)

## Folder Structure

After creating an app, it should look something like:

```
.
├── README.md
├── components
│   ├── layout
│   └── Nav
│   └── Notification
│   └── User
│   └── utils
├── config
├── functions
├── pages
├── public
├── redux
├── static
├── utils
├── node_modules
├── next.config.js
│   ├── [...]
├── package.json
└── yarn.lock
```

Routing in Next.js is based on the file system, so `./pages/index/index.js` maps to the `/` route and
`./pages/login/index.js` would map to `/index`.

The `./static` directory maps to `/static` in the `next` server, so you can put all your
other static resources like images or compiled CSS in there.

Out of the box, we get:

- Automatic transpilation and bundling (with webpack and babel)
- Hot code reloading
- Server rendering and indexing of `./pages`
- Static file serving. `./static/` is mapped to `/static/`

Read more about [Next's Routing](https://github.com/zeit/next.js#routing)

## Available 'Root' Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the application in production mode.
The application should be compiled with \`next build\` first.

### `npm run deploy`
Deploy the code in gcloud once you set gcloud project with the repo.

See the section in Next docs about [deployment](https://github.com/zeit/next.js/wiki/Deployment) for more information.

## Available 'Functions' Scripts

In the functions directory to the root, you can run:

### `npm run serve`

Runs the API in the development mode.<br>
Open [http://localhost:5000/nextjs-pwa-firebaseauth-api/us-central1/api/v1/login](http://localhost:5000/nextjs-pwa-firebaseauth-api/us-central1/api/v1/login) to view it in the browser.

### `npm run deploy`
Deploy the api code in firbase function once you set firebase project with the repo.


## Using CSS

[`styled-jsx`](https://github.com/zeit/styled-jsx) is bundled with next to provide support for isolated scoped CSS. The aim is to support "shadow CSS" resembling of Web Components, which unfortunately [do not support server-rendering and are JS-only](https://github.com/w3c/webcomponents/issues/71).

```jsx
export default () => (
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
  </div>
)
```

Read more about [Next's CSS features](https://github.com/zeit/next.js#css).

## Tailwind css
A utility-first CSS framework for rapidly building custom designs.
Tailwind CSS is a highly customizable, low-level CSS framework that gives you all of the building blocks you need to build bespoke designs without any annoying opinionated styles you have to fight to override.
Read more about [Tailwind's CSS features](https://tailwindcss.com/).


## Adding Components

We recommend keeping React components in `./components` and they should look like:

### `./components/simple.js`

```jsx
const Simple = () => <div>Simple Component</div>

export default Simple // don't forget to export default!
```

### `./components/complex.js`

```jsx
import { Component } from 'react'

class Complex extends Component {
  state = {
    text: 'World'
  }

  render() {
    const { text } = this.state
    return <div>Hello {text}</div>
  }
}

export default Complex // don't forget to export default!
```

## Fetching Data

You can fetch data in `pages` components using `getInitialProps` like this:

### `./pages/stars.js`

```jsx
const Page = props => <div>Next stars: {props.stars}</div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  const stars = json.stargazers_count
  return { stars }
}

export default Page
```

For the initial page load, `getInitialProps` will execute on the server only. `getInitialProps` will only be executed on the client when navigating to a different route via the `Link` component or using the routing APIs.

_Note: `getInitialProps` can **not** be used in children components. Only in `pages`._

Read more about [fetching data and the component lifecycle](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle)

## Custom Server

Want to start a new app with a custom server? Run `create-next-app --example customer-server custom-app`

Typically you start your next server with `next start`. It's possible, however, to start a server 100% programmatically in order to customize routes, use route patterns, etc

This example makes `/a` resolve to `./pages/b`, and `/b` resolve to `./pages/a`:

```jsx
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

Then, change your `start` script to `NODE_ENV=production node server.js`.

Read more about [custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing)

## Syntax Highlighting

To configure the syntax highlighting in your favorite text editor, head to the [relevant Babel documentation page](https://babeljs.io/docs/editors) and follow the instructions. Some of the most popular editors are covered.