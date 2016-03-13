const { describe, it } = global;
import should from 'should/as-function';

import ApiServer from '../fixtures/ApiServer';

import { HTTPStore, MemoryStore, Store } from '../../';

const API_PORT = 7777;

describe('HTTPStore', () => {
  describe('#options', () => {
    describe('rewritePath', () => {
      it('should correctly access the server with the rewritten path for any path of the store', async function test() {
        const apiServer = new ApiServer({ port: API_PORT });
        await apiServer.startListening();
        try {
          const store = HTTPStore.create(
            '/test/users/:userId/custom/path',
            { protocol: 'http', hostname: 'localhost', port: API_PORT },
            {
              rewritePath({ userId }) {
                return `/users/${userId}`;
              },
            }
          );

          const user1Info = await store.fetch({ userId: '1' });
          should(user1Info.isResolved()).be.true();
          should(user1Info.value).be.deepEqual({ userId: 1, userName: 'Martin', rank: 'Gold' });

          const user2Info = await store.fetch({ userId: '2' });
          should(user2Info.isResolved()).be.true();
          should(user2Info.value).be.deepEqual({ userId: 2, userName: 'Matthieu', rank: 'Silver' });
        }
        finally {
          return await apiServer.stopListening();
        }
      });
    });
  });
});

describe('MemoryStore', () => {
  describe('#get', () => {
    const store = MemoryStore.create('/foo/:bar')
      .set({ bar: 'baz' }, 'qux')
      .set({ bar: 'quux' }, Store.State.reject('corge'))
      .set({ bar: 'grault' }, Store.State.pending());

    it('should retrieve the value of the memory store succefully', () => {
      should(store.get({ bar: 'baz' })).be.equal('qux');
    });

    it('should throw an error when the state is rejected', () => {
      should(() => store.get({ bar: 'quux' })).throw();
    });

    it('should throw the error with the right message', () => {
      try {
        store.get({ bar: 'quux' });
      }
      catch(error) {
        should(error.message).be.equal('corge');
      }
    });

    it('should return null when the status is pending', () => {
      should(store.get({ bar: 'grault' })).be.equal(null);
    });

    it('should return null when there is no corresponding query', () => {
      should(store.get({ bar: 'graply' })).be.equal(null);
    });
  });
});
