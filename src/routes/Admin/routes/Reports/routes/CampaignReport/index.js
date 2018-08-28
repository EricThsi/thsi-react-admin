import { injectReducer } from 'vstore/reducers'

export default store => ({
  path: 'campaign',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, next) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const campaignReport = require('./containers').default
      const reducer = require('./modules').default

      /*  Add the reducer to the store on key 'totalReport'  */
      injectReducer(store, {
        key: 'campaignReport',
        reducer
      })

      /*  Return getComponent   */
      next(null, campaignReport)

      /* Webpack named bundle   */
    })
  }
})
