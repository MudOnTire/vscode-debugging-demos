import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, message, Input } from 'antd';
import ChangePwdDrawer from '../../components/Drawers/ChangePassword';
import KeyValueAdder from '../../components/Custom/KeyValueAdder';

import styles from './UserSetting.less';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/updateCurrent']
}))
@Form.create()
export default class extends React.Component {

  state = {
    changePwdDrawerVisible: false
  }

  componentDidMount() {
    const { dispatch, user: { currentUser } } = this.props;
    if (!currentUser.username) {
      dispatch({
        type: 'user/fetchCurrent'
      });
    }
  }

  save = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'user/updateCurrent',
        payload: fieldsValue,
        callback: (res) => {
          if (res.code === 0) {
            dispatch({
              type: 'user/saveCurrentUser',
              payload: res.result
            });
            message.success('修改个人信息成功！');
          }
        }
      })
    })
  }

  toggleChangePwdDrawer = (visible) => {
    this.setState({
      changePwdDrawerVisible: visible
    });
  }

  render() {
    const { form, user, submitting } = this.props;
    const { changePwdDrawerVisible } = this.state;
    const { getFieldDecorator } = form;
    const { currentUser } = user;
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 16
      }
    };
    return (
      <div className={styles.main}>
        <ChangePwdDrawer
          visible={changePwdDrawerVisible}
          onClose={() => this.toggleChangePwdDrawer(false)}
        />
        <div style={{ textAlign: 'right' }}>
          <a
            href="javascript:;"
            className={styles.changePwdLink}
            onClick={() => { this.toggleChangePwdDrawer(true) }}
          >
            修改密码
          </a>
        </div>
        <Form onSubmit={this.save}>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username', {
              initialValue: currentUser.username,
              rules: [
                {
                  required: true,
                  message: '请填写您的用户名',
                },
              ]
            })(
              <Input placeholder='请填写您的用户名' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系电话">
            {getFieldDecorator('phone', {
              initialValue: currentUser.phone
            })(
              <Input placeholder='请填写您的电话' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="客服电话">
            {getFieldDecorator('servicePhones', {
              initialValue: currentUser.servicePhones
            })(
              <KeyValueAdder key={(currentUser.servicePhones && currentUser.servicePhones.length) || 0} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="地址">
            {getFieldDecorator('address', {
              initialValue: currentUser.address
            })(
              <Input placeholder='请填写您的地址' />
            )}
          </FormItem>
          <FormItem style={{
            borderBottom: 'none',
            textAlign: 'center',
            marginTop: '100px'
          }}>
            <Button
              htmlType='submit'
              className={styles.saveBtn}
              type='primary'
              loading={submitting}
            >
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}