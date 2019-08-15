import React from 'react';
import {
  Input,
  InputNumber,
  Modal,
  Switch,
  Form
} from 'antd';

import PicturesWall from '../Upload/PicturesWall';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class extends React.Component {

  onOK = () => {
    const { teacher, form, handleSave } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      let { avatar } = fieldsValue;
      if (avatar.length > 0) {
        if (avatar[0].response) {
          avatar = avatar[0].response.result[0].url;
        } else {
          avatar = avatar[0].url;
        }
      } else {
        avatar = undefined;
      }
      const params = {
        ...teacher,
        ...fieldsValue,
        avatar
      };
      console.log(params);
      handleSave(params);
    });
  };

  render() {
    const { teacher, modalVisible, handleModalVisible, form } = this.props;
    const { order, name, detail, avatar, enabled } = teacher || {};

    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 15
      },
    };

    return (
      <Modal
        title={this.props.teacher ? '编辑教师' : '新建教师'}
        visible={modalVisible}
        onOk={this.onOK}
        destroyOnClose={true}
        onCancel={() => {
          handleModalVisible(false);
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="排序">
            {form.getFieldDecorator('order', {
              initialValue: order || 1
            })(<InputNumber min={1} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {form.getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入教师姓名' }],
            })(<Input placeholder="请输入教师姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="头像">
            {
              form.getFieldDecorator('avatar', {
                initialValue: avatar ? [{ uid: 0, url: avatar }] : [],
                valuePropName: 'fileList'
              })(
                <PicturesWall maxCount={1} />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="简介">
            {
              form.getFieldDecorator('detail', {
                initialValue: detail
              })(
                <TextArea placeholder="请输入教师简介" autosize={{ minRows: 2, maxRows: 6 }} />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="是否启用">
            {
              form.getFieldDecorator('enabled', {
                initialValue: enabled,
                valuePropName: 'checked'
              })(
                <Switch />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}