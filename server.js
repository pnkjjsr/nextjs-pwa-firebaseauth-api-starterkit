qconst express = require('express')
var compression = require('compression')
const bodyParser = require('body-parser')
const {
  parse
} = require('url')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const next = require('next')
const admin = require('firebase-admin')
const {
  join
} = require('path')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev
})
const handle = app.getRequestHandler()


const serviceAccount = require("./serviceAccountKey.json");
const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://neta-62fcb.firebaseio.com" // TODO database URL goes here
  },
  'server'
)

app.prepare()
  .then(() => {
    const server = express()
    server.use(compression())
    server.use(bodyParser.json())

    server.use(
      session({
        secret: 'geheimnis',
        saveUninitialized: true,
        store: new FileStore({
          path: '/tmp/sessions',
          secret: 'geheimnis'
        }),
        resave: false,
        rolling: true,
        httpOnly: true,
        cookie: {
          maxAge: 604800000
        } // week
      })
    )

    server.use((req, res, next) => {
      req.firebaseServer = firebase
      next()
    })

    server.post('/api/login', (req, res) => {
      if (!req.body) return res.sendStatus(400)

      const token = req.body.token
      firebase
        .auth()
        .verifyIdToken(token)
        .then(decodedToken => {
          req.session.decodedToken = decodedToken
          return decodedToken
        })
        .then(decodedToken => res.json({
          status: true,
          decodedToken
        }))
        .catch(error => res.json({
          error
        }))
    })

    server.post('/api/logout', (req, res) => {
      req.session.decodedToken = null
      res.json({
        status: true
      })
    })

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true)
      const {
        pathname,
        query
      } = parsedUrl

      // Redirecting url before mount

      // if (pathname === '/') {
      //   app.render(req, res, '/account', query);
      // }

      // handle GET request to /service-worker.js
      if (pathname === '/service-worker.js') {
        const filePath = join(__dirname, '.next', pathname)
        app.serveStatic(req, res, filePath)
      } else {
        handle(req, res, parsedUrl)
      }
    })

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  }).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });