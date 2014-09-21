module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");

    /**
     * @memberOf R
     */
    var Dispatcher = function Dispatcher(displayName) {
        this._actionsListeners = {};
    };

    _.extend(Dispatcher.prototype, /** @lends R.Dispatcher.prototype */{
        _isDispatcher_: true,
        displayName: null,
        _actionsListeners: null,
        addActionListener: function addActionListener(action, fn) {
            var actionListener = new R.Dispatcher.ActionListener(action);
            if(!_.has(this._actionsListeners, action)) {
                this._actionsListeners[action] = {};
            }
            this._actionsListeners[action][actionListener.uniqueId] = fn;
            return actionListener;
        },
        removeActionListener: function removeActionListener(actionListener) {
            R.Debug.dev(R.scope(function() {
                assert(actionListener instanceof R.Dispatcher.ActionListener, "R.Dispatcher.removeActionListener(...): type R.Dispatcher.ActionListener expected.");
                assert(_.has(this._actionsListeners, actionListener), "R.Dispatcher.removeActionListener(...): no action listener for this action.");
                assert(_.has(this._actionsListeners[actionListener.action], actionListener.uniqueId), "R.Dispatcher.removeActionListener(...): no such action listener.");
            }, this));
            delete this._actionsListeners[actionListener.action][actionListener.uniqueId];
            if(_.size(this._actionsListeners[actionListener.action]) === 0) {
                delete this._actionsListeners[actionListener.action];
            }
        },
        dispatch: regeneratorRuntime.mark(function dispatch(action, params) {
            return regeneratorRuntime.wrap(function dispatch$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    params = params || {};
                    R.Debug.dev(R.scope(function() {
                        if(!_.has(this._actionsListeners, action)) {
                            console.warn("R.Dispatcher.trigger: triggering an action with no listeners attached.");
                        }
                    }, this));

                    if (!_.has(this._actionsListeners, action)) {
                        context$2$0.next = 6;
                        break;
                    }

                    context$2$0.next = 5;

                    return _.map(this._actionsListeners[action], function(listener) {
                        return listener(params);
                    });
                case 5:
                    return context$2$0.abrupt("return", context$2$0.sent);
                case 6:
                case "end":
                    return context$2$0.stop();
                }
            }, dispatch, this);
        }),
    });

    Dispatcher.ActionListener = function ActionListener(action) {
        this.uniqueId = _.uniqueId("ActionListener");
        this.action = action;
    };

    _.extend(Dispatcher.ActionListener.prototype, /** @lends R.Dispatcher.ActionListener */ {
        /**
         * @type {String}
         * @private
         * @readOnly
         */
        uniqueId: null,
        /**
         * @type {String}
         * @private
         * @readOnly
         */
        action: null,
    });

    R.Dispatcher = Dispatcher;
    return R;
};