import _ from 'lodash';
import Promise from 'bluebird';
import Koa from 'koa';
import cors from '@koa/cors';
import createBody from 'koa-body';
import createRouter from 'koa-router';
import should from 'should/as-function';
const __DEV__ = process.env.NODE_ENV === 'development';

// These symbols enumerate the possible states of a Server instance
const [NOT_STARTED, STARTED, STOPPED] = [Symbol('NOT_STARTED'), Symbol('STARTED'), Symbol('STOPPED')];

let users = null;

class ApiServer {
  /**
   * koa app
   * @type {Object}
   */
  app = null;

  /**
   * server status
   * @type {Symbol}
   */
  _status = null;

  /**
   * server instance
   * @type {Object}
   */
  server = null;

  constructor(config) {
    this._status = NOT_STARTED;
    this.app = new Koa();
    this.config = config;
    users = [
      {
        userId: 1,
        userName: 'Martin',
        rank: 'Gold',
      },
      {
        userId: 2,
        userName: 'Matthieu',
        rank: 'Silver',
      },
    ];

    this.app
      .use(cors({ origin: '*' }))
      .use(
        createRouter()
        .get('/users', async function $users(ctx) {
          ctx.body = users;
          ctx.status = 200;
        })
        .get('/users/:userId', async function $user(ctx) {
          const { userId: userIdToFind } = ctx.params;
          ctx.body = _.find(users, ({ userId }) => userId === parseInt(userIdToFind));
          ctx.status = 200;
        })
        .get('/echoQuery', async function $testQueryString(ctx) {
          ctx.body = ctx.query;
          ctx.status = 200;
        })
        .post('/users/create', createBody(), async function $createUser(ctx) {
          const { userName, rank } = ctx.request.body;
          users.push({ userId: _.last(users).userId + 1, userName, rank });
          ctx.status = 200;
        })
        .post('/users/:userId/update', createBody(), async function $deleteUser(ctx) {
          const { userId: userIdToUpdate } = ctx.params;
          const { userName, rank } = ctx.request.body;
          users = users.map((user) => {
            if(user.userId === parseInt(userIdToUpdate)) {
              return { userId: user.userId, userName, rank };
            }
            return user;
          });
          ctx.status = 200;
        })
        .delete('/users/:userId/delete', async function $deleteUser(ctx) {
          const { userId: userIdToRemove } = ctx.params;
          users = users.filter(({ userId }) => userId !== parseInt(userIdToRemove));
          ctx.status = 200;
        })
        .routes()
      );
  }

  /**
   * Start listening for incoming requests
   * @return {Promise} Resolves when/if the server successfully starts
   */
  startListening() {
    const { port } = this.config;
    return new Promise((resolve, reject) => {
      if(__DEV__) {
        should(this._status).be.exactly(NOT_STARTED);
      }

      // Grab a reference to the HTTPServer instance so we can close it later
      this.server = this.app.listen(port, (err) => {
        if(err) {
          return reject(err);
        }
        return resolve();
      });
    })
    .then(() => {
      this._status = STARTED;
    });
  }

  /**
   * Stop listening for incoming requests
   * @return {Promise} Resolves when/if the server successfully stops
   */
  stopListening() {
    return Promise.try(() => {
      if(__DEV__) {
        should(this._status).be.exactly(STARTED);
      }
      return Promise.resolve(this.server.close());
    })
    .then(() => {
      this._status = STOPPED;
      users = null;
    });
  }
}

export default ApiServer;
