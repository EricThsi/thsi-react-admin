import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import {
  // Layout,
  // Spin,
  Form,
  Icon,
  Input,
  Button,
  // Checkbox,
  Row,
  Col,
  message,
  Alert
} from 'antd'
import { Helmet } from 'react-helmet'
import Footer from 'vcms/Footer'

import {
  chooseRoute
} from 'vutils/Tools'

import './Login.scss'

// const { Content } = Layout
const FormItem = Form.Item

class Login extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    handleLogin: PropTypes.func.isRequired,
    handleLogout: PropTypes.func,
    form: PropTypes.object,
    redirectPath: PropTypes.string,
    // isAuthenticated: PropTypes.bool,
    permissions: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      redirectPath: props.redirectPath
    }
    // console.log(props.intl)
  }

  componentWillMount = () => {
    this.props.handleLogout()
  }

  handleLoginSubmit = (evt) => {
    const { redirectPath } = this.state
    evt.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        this.props.handleLogin(values, () => {
          // console.log(this.props.permissions)
          message.success('登录成功', 1, () => {
            if (redirectPath) {
              browserHistory.push(redirectPath)
            } else {
              let redirectPath = chooseRoute(this.props.permissions)
              if (redirectPath !== '') {
                browserHistory.push(redirectPath)
              } else {
                message.error('您的账户暂时不能登录，请联系管理员')
              }
            }
          })
        }, (msg) => {
          message.error(msg)
        })
      }
    })
  }

  render () {
    const {
      isLoading,
      form,
    } = this.props

    const {
      getFieldDecorator,
      getFieldError
    } = form

    let emailErrors = getFieldError('email')
    let pswErrors = getFieldError('password')

    // console.log(this.props)

    return (
      <div className='page-login__container'>
        <Helmet>
          <title>登录</title>
        </Helmet>
        <div className='page-login_wrapper'>
          <Row>
            <Col xs={0} md={8} />
            <Col md={8}>
              <h1 className='login-logo'>LOGO</h1>
              <div className='login-form-wrapper'>
                <h2 className='page-title'>
                  <span className='title'>账号登录</span>
                </h2>
                <Form onSubmit={this.handleLoginSubmit} className='login-form'>
                  {emailErrors && <Alert message={emailErrors.join(',')} type='error' closable />}

                  {pswErrors && <Alert message={pswErrors.join(',')} type='error' closable />}
                  <FormItem help=''>
                    {getFieldDecorator('email', {
                      validateTrigger: ['onBlur'],
                      rules: [
                        {
                          required: true,
                          message: '请输入邮箱地址',
                        },
                        {
                          type: 'email',
                          message: '请输入合法的邮箱地址'
                        }
                      ],
                    })(
                      <Input size='large'
                        disabled={isLoading}
                        prefix={<Icon type='user' />}
                        placeholder='邮箱' />
                    )}
                  </FormItem>
                  <FormItem help=''>
                    {getFieldDecorator('password', {
                      validateTrigger: ['onBlur'],
                      rules: [
                        {
                          required: true,
                          message: '请输入密码'
                        },
                        {
                          min: 6,
                          message: '密码至少为6位'
                        }
                      ],
                    })(
                      <Input size='large'
                        disabled={isLoading}
                        prefix={<Icon type='lock' />}
                        type='password'
                        placeholder='密码' />
                    )}
                  </FormItem>
                  <FormItem>
                    {/* {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(
                      <Checkbox>
                        {formatMessage({
                          id: 'login.remember_me',
                          defaultMessage: 'Remember me'
                        })}
                      </Checkbox>
                    )}
                    <Link className='login-form-forgot' to='/reset-psw'>
                      {formatMessage({
                        id: 'login.forgot_password',
                        defaultMessage: 'Forgot password'
                      })}
                    </Link> */}
                    <Button loading={isLoading} size='large' type='primary' htmlType='submit' className='login-form-button'>登录</Button>
                    {/* {formatMessage({
                      id: 'login.register.tips',
                      defaultMessage: 'Or '
                    })}
                    <Link to='/register'>
                      {formatMessage({
                        id: 'login.register',
                        defaultMessage: 'Register now!'
                      })}
                    </Link> */}
                  </FormItem>
                </Form>
              </div>
            </Col>
            <Col xs={0} md={8} />
          </Row>
        </div>
        <Footer />
      </div>
    )
  }
}

const WrappedLoginForm = Form.create()(Login)

export default WrappedLoginForm
