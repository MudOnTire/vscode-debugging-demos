import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, List, Button, Modal, message, Tag, Form, Select, Row, Col } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ news, loading }) => ({
  news,
  loading: loading.effects['news/fetchNews'],
}))
@Form.create()
export default class CoverCardList extends React.Component {

  state = {
    categories: []
  }

  componentDidMount() {
    this.fetchNews();
  }

  fetchNews = (payload) => {
    console.log(payload);
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetchNews',
      payload,
    });
  }

  queryNews = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      const params = {};
      for (const key in fieldsValue) {
        const value = fieldsValue[key];
        if (value && value.length > 0) {
          params[key] = value;
        }
      }
      console.log(params);
      this.fetchNews(params);
    });
  }

  /**
   * 获取新闻分类
   */
  fetchCategories = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetchLevelOneCategories',
      payload: params,
      callback: (res) => {
        if (res.code === 0) {
          this.setState({
            categories: res.result.list
          })
        } else {
          message.error(`获取新闻分类失败：${res.message}`);
        }
      }
    });
  }

  /**
   * 删除新闻
   */
  onDelete = (item) => {
    console.log(item);
    const { dispatch } = this.props;
    confirm({
      title: `确定删除新闻：${item.title} 吗？`,
      okType: 'danger',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'news/deleteNews',
          payload: {
            _id: item._id
          },
          callback: (res) => {
            console.log(res);
            if (res.code === 0) {
              message.success(`删除成功`, 1);
              this.fetchNews();
            } else {
              message.error(`删除失败：${res.detailMessage}`);
            }
          }
        });
      }
    });
  }

  /**
   * 预览新闻
   */
  goPreview = (item) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/pages/news-detail/${item._id}?preview=true`));
  }

  render() {
    const { news, loading, dispatch, form } = this.props;
    const { categories } = this.state;
    const { getFieldDecorator } = form;
    const cardList = news.news.list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={news.news.list}
        pagination={{
          ...news.news.pagination,
          showQuickJumper: true,
          onChange: (pageNum, pageSize) => { this.fetchNews({ pageNum, pageSize }) }
        }}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.listImg} height={154} />}
              onClick={() => {
                dispatch(routerRedux.push(`/news/edit/${item._id}`));
              }}
            >
              <Card.Meta
                title={<a>{item.title}</a>}
                description={<Ellipsis lines={2}>{item.subtitle}</Ellipsis>}
              />
              <div className={styles.cardItemContent}>
                <Tag color={item.enabled ? 'green' : 'red'}>
                  {item.enabled ? '启用' : '禁用'}
                </Tag>
                <div style={{ textAlign: 'right' }}>
                  <Button title='预览' shape="circle" icon="mobile" style={{ marginRight: 8 }} onClick={(e) => {
                    e.stopPropagation();
                    this.goPreview(item);
                  }} />
                  <Button title='删除' shape="circle" icon="delete" onClick={(e) => {
                    e.stopPropagation();
                    this.onDelete(item);
                  }} />
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;

    return (
      <div className={styles.main}>
        <PageHeaderWrapper>
          <Form layout="inline" className={styles.queryForm} onSubmit={this.queryNews}>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem label="新闻分类">
                  {getFieldDecorator('categoryId', {
                    initialValue: '',
                  })(
                    <Select
                      showSearch
                      placeholder='请输入分类名称搜索分类'
                      defaultActiveFirstOption={true}
                      filterOption={false}
                      onSearch={
                        (query) => {
                          const params = {};
                          if (query) {
                            params.query = query;
                          }
                          this.fetchCategories(params);
                        }
                      }
                    >
                      <Option value="">全部</Option>
                      {
                        categories.map(c => (
                          <Option key={c._id}>{c.title}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="是否展示">
                  {getFieldDecorator('enabled', {
                    initialValue: '',
                  })(
                    <Select style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
          <div className={styles.cardList}>{cardList}</div>
        </PageHeaderWrapper>
      </div>
    );
  }
}