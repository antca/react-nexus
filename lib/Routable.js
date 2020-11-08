import { pathToRegexp, compile } from 'path-to-regexp';

/**
 * Represents a routable Object
 * @abstract
 */
class Routable {
  /**
   * Constructs a new Routable instance.
   * @constructor
   * @param {String} route Route of the routable.
   */
  constructor(route) {
    this.route = route;
    this.keys = [];
    this.re = pathToRegexp(route, this.keys);
    this.toPath = compile(this.route);
  }
}

export default Routable;
