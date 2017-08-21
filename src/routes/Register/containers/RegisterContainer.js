import { connect } from 'react-redux'
import { handleRegister } from 'vstore/auth'

import WrappedRegistrationForm from '../components/Register'

const mapActionCreators = {
  handleRegister
}

const mapStateToProps = (state) => ({
  redirectPath: state.location.query.redirect
})

export default connect(mapStateToProps, mapActionCreators)(WrappedRegistrationForm)
