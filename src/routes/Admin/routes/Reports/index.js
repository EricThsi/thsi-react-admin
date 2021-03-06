import { injectReducer } from 'vstore/reducers'
import { permissionIsAuthenticated } from 'vcms/RouterAuth/RouterAuth'

export default store => ({
  path: 'reports',
  getIndexRoute (location, cb) {
    require.ensure([], require => {
      cb(null, require('./routes/OrderReport').default(store))
    })
  },
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, next) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(['./containers/ReportsContainer', './modules/reports'], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Reports = require('./containers/ReportsContainer').default
      const reportsReducer = require('./modules/reports').default

      /*  Add the reducer to the store on key 'User'  */
      injectReducer(store, {
        key: 'reports',
        reducer: reportsReducer
      })

      /*  Return getComponent   */
      next(null, permissionIsAuthenticated(Reports))
    })
  },
  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        // Remove imports!
        require('./routes/OrderReport').default(store),
      ])
    })
  }
})
