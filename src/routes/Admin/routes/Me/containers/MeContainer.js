import { connect } from 'react-redux'
// import { handleMe } from 'vstore/auth'
import Me from '../components/Me'

const mapActionCreators = {
  // handleMe
}

const mapStateToProps = (state) => ({
  // redirectPath: state.location.query.redirect
  pathname: state.location.pathname
})

export default connect(mapStateToProps, mapActionCreators)(Me)
