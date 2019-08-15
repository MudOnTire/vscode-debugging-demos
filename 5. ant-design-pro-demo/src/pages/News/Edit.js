import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Switch, message, Cascader } from 'antd';
import CKEditor from '../../components/CKEditor';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PictureWall from '@/components/Upload/PicturesWall';

const FormItem = Form.Item;

@connect(({ news, loading }) => ({
  news,
  submitting: loading.effects['news/saveNews']
}))
@Form.create()
export default class extends PureComponent {

  state = {
    editingItem: {},
    loadingLevelOneId: null
  }

  componentDidMount() {
    this.getEditingItem();
    this.getLevelOneCategories();
  }

  getLevelOneCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetchLevelOneCategories'
    });
  }

  loadLevelTwoCategories = (data) => {
    const levelOne = data[0];

    if (levelOne) {
      this.setState({
        loadingLevelOneId: levelOne.value
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'news/queryLevelTwoCategories',
        payload: {
          parentId: levelOne.value
        },
        callback: () => {
          this.setState({
            loadingLevelOneId: null
          });
        }
      });
    }
  }

  /**
   * 获取编辑新闻详情
   */
  getEditingItem = () => {
    const { dispatch, match } = this.props;
    const editItemId = match.params.id;
    if (typeof editItemId !== 'undefined') {
      dispatch({
        type: 'news/getNewsDetail',
        payload: {
          _id: editItemId,
        },
        callback: (res) => {
          this.setState({
            editingItem: res.result
          });
          // 获取选中一级分类的子分类
          if (res.result.categoryId && res.result.categoryId[0]) {
            dispatch({
              type: 'news/queryLevelTwoCategories',
              payload: {
                parentId: res.result.categoryId[0]._id
              }
            });
          }
        }
      });
    } else {
      this.setState({
        editingItem: {}
      });
    }
  }

  /**
   * 提交
   */
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { editingItem } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      let { listImg } = fieldsValue;
      if (listImg.length > 0) {
        if (listImg[0].response) {
          listImg = listImg[0].response.result[0].url
        } else {
          listImg = listImg[0].url;
        }
      } else {
        listImg = undefined;
      }
      const params = {
        ...fieldsValue,
        _id: editingItem._id,
        listImg
      };
      dispatch({
        type: 'news/saveNews',
        payload: params,
        callback: (res) => {
          if (res.code === 0) {
            message.success('保存成功');
            setTimeout(() => {
              dispatch(routerRedux.push(`/news/list`));
            }, 500);
          } else {
            message.error('保存失败!');
          }
        }
      });
    });
  };

  render() {
    const { submitting, form, news } = this.props;
    const { editingItem, loadingLevelOneId } = this.state;
    const { title, subtitle, detail, categoryId, listImg, enabled } = editingItem;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
        md: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 3 },
      },
    };

    return (
      <PageHeaderWrapper title="新闻编辑">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [
                  {
                    required: true,
                    message: '请输入新闻标题',
                  },
                ],
              })(<Input placeholder="请输入新闻标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="副标题">
              {getFieldDecorator('subtitle', {
                initialValue: subtitle,
                rules: [
                  {
                    required: true,
                    message: '请输入新闻副标题',
                  },
                ],
              })(<Input placeholder="请输入新闻副标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label='列表缩略图'>
              {getFieldDecorator('listImg', {
                initialValue: listImg ? [{ uid: 0, url: listImg }] : [],
                valuePropName: 'fileList'
              })(
                <PictureWall
                  maxCount={1}
                  multiple={true}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='分类'>
              {getFieldDecorator('categoryId', {
                initialValue: categoryId ? categoryId.map(c => c._id) : []
              })(
                <Cascader
                  options={news.category.list.map(c => ({
                    ...c,
                    value: c._id,
                    label: c.title,
                    isLeaf: false,
                    loading: c._id === loadingLevelOneId
                  }))}
                  loadData={this.loadLevelTwoCategories}
                  changeOnSelect={true}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新闻详情">
              {getFieldDecorator('detail', {
                initialValue: detail,
              })(
                <CKEditor />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否展示">
              {form.getFieldDecorator('enabled', {
                initialValue: enabled,
                valuePropName: 'checked'
              })(
                <Switch />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" size='large' htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
