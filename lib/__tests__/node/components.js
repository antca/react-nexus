import React, { Component, PropTypes as T } from 'react';
import stores from '../../stores';
import Store from '../../Store';
import MemoryStore from '../../MemoryStore';
import Flux from '../../Flux';
import root from '../../root';
import { mount } from 'enzyme';
import should from 'should';

const { describe, it } = global;

describe('stores', () => {
  it('should set state to null when binding is removed', () => {
    const fooStore = new MemoryStore('/foo').set({}, 'foo');
    const flux = Flux.create({
      stores: [fooStore],
    });
    class Bar extends Component {
      static displayName = 'Bar';
      static propTypes = {
        foo: Store.State.propType(T.string),
      };
      render() {
        const { foo } = this.props;
        if(foo === null) {
          return <span>{'foo is null'}</span>;
        }
        return <span>{'foo is not null'}</span>;
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
    const mounted = mount(<DecoratedBar bindFoo flux={flux} />);
    should(mounted.html()).be.exactly('<span>foo is not null</span>');
    mounted.setProps({ bindFoo: false });
    should(mounted.html()).be.exactly('<span>foo is null</span>');
  });
});
