import React from 'react';
import { connect } from 'dva';
import {
  Input,
  InputNumber,
  Modal,
  Switch,
  Form,
  Row,
  Col,
  Select
} from 'antd';
import debounce from 'lodash/debounce';

import PicturesWall from '../Upload/PicturesWall';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ news, loading }) => ({
  news,
  loading: loading.effects['news/fetchLevelOneCategories'],
}))
@Form.create()
export default class EditCategoryModal extends React.Component {

  state = {
    parents: [] // 搜索出的一级分类
  }

  componentDidMount() {
    this.getLevelOneCategories();
  }

  getLevelOneCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetchLevelOneCategories'
    });
  }

  onOK = () => {
    const { category, form, handleSave } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let { logo, banner } = fieldsValue;
      if (logo.length > 0) {
        if (logo[0].response) {
          logo = logo[0].response.result[0].url;
        } else {
          logo = logo[0].url;
        }
      } else {
        logo = undefined;
      }
      if (banner.length > 0) {
        if (banner[0].response) {
          banner = banner[0].response.result[0].url;
        } else {
          banner = banner[0].url;
        }
      } else {
        banner = undefined;
      }
      const params = {
        ...category,
        ...fieldsValue,
        logo,
        banner
      };
      handleSave(params);
    });
  };

  render() {
    const { category, modalVisible, handleModalVisible, form, news } = this.props;
    const validParents = news.category.list.filter(c => !c.parentId && (!category || category && c._id !== category._id));
    const { order, title, subtitle, logo, banner, enabled, showInHome, parentId } = category || {};

    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 15
      },
    };

    const halfFormItemLayout = {
      labelCol: {
        span: 10
      },
      wrapperCol: {
        span: 10
      },
    };

    return (
      <Modal
        title={category && category._id ? '编辑分类' : '新建分类'}
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
          <FormItem {...formItemLayout} label="分类标题">
            {form.getFieldDecorator('title', {
              initialValue: title,
              rules: [{ required: true, message: '请输入分类标题' }],
            })(<Input placeholder="请输入分类标题" />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="分类副标题">
            {form.getFieldDecorator('subtitle', {
              initialValue: subtitle,
            })(<Input placeholder="请输入副标题" />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="上级分类">
            {form.getFieldDecorator('parentId', {
              initialValue: parentId,
            })(
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择上级分类"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  validParents && validParents.map(c => (
                    <Option value={c._id} key={c._id}>{c.title}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem {...halfFormItemLayout} label="是否启用">
                {
                  form.getFieldDecorator('enabled', {
                    initialValue: enabled,
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...halfFormItemLayout} label="首页展示">
                {
                  form.getFieldDecorator('showInHome', {
                    initialValue: showInHome,
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...halfFormItemLayout} label="分类logo">
                {
                  form.getFieldDecorator('logo', {
                    initialValue: logo ? [{ uid: 0, url: logo }] : [],
                    valuePropName: 'fileList'
                  })(
                    <PicturesWall maxCount={1} />
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...halfFormItemLayout} label="分类主图">
                {
                  form.getFieldDecorator('banner', {
                    initialValue: banner ? [{ uid: 0, url: banner }] : [],
                    valuePropName: 'fileList'
                  })(
                    <PicturesWall maxCount={1} />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}