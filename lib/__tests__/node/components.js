import jsdom from 'global-jsdom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import stores from '../../stores';
import Store from '../../Store';
import MemoryStore from '../../MemoryStore';
import Flux from '../../Flux';
import root from '../../root';
import should from 'should/as-function';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

const { describe, it, beforeEach, afterEach } = global;

describe('stores', () => {

  beforeEach(function $beforeEach() {
    this.cleanUp = jsdom(`<div id="app"></div>`);
  });
  afterEach(function $afterEach() {
    this.cleanUp();
  });

  it('should set state to undefined when binding is removed', () => {
    const fooStore = new MemoryStore('/foo').set({}, 'foo');
    const flux = Flux.create({
      stores: [fooStore],
    });
    class Bar extends Component {
      static displayName = 'Bar';
      static propTypes = {
        foo: Store.State.propType(PropTypes.string),
      };
      render() {
        const { foo } = this.props;
        if(foo === void 0) {
          return <span>{'foo is undefined'}</span>;
        }
        return <span>{'foo is not undefined'}</span>;
      }
    }
    const DecoratedBar = root()(
      stores(({ bindFoo }) => {
        if(bindFoo) {
          return { foo: '/foo' };
        }
        return {};
      })(Bar)
    );

    const rootElement = document.querySelector('#app');

    act(() => {
      ReactDOM.render(<DecoratedBar bindFoo flux={flux} />, rootElement);
    });

    should(rootElement.innerHTML).be.exactly('<span>foo is not undefined</span>');

    act(() => {
      ReactDOM.render(<DecoratedBar bindFoo={false} flux={flux} />, rootElement);
    });

    should(rootElement.innerHTML).be.exactly('<span>foo is undefined</span>');
  });
});
