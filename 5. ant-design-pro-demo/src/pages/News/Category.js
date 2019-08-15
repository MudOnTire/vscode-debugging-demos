import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Table,
  Icon
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditCategoryModal from '@/components/Modals/EditCategoryModal';

import styles from './Category.less';

@connect(({ news, loading }) => ({
  news,
  loading: loading.effects['news/fetchLevelOneCategories'],
}))
export default class TableList extends PureComponent {

  state = {
    modalVisible: false,
    selectedRows: [],
    editCategory: null,
    levelTwoCategories: {},
    expandedRowKeys: []
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/fetchLevelOneCategories',
      payload: params,
      callback: () => {
        this.setState({
          expandedRowKeys: []
        });
      }
    });
  }

  handleModalVisible = flag => {
    if (flag == true) {
      this.setState({
        modalVisible: true,
      });
    } else {
      this.setState({
        modalVisible: false,
        editCategory: null,
      });
    }
  };

  handleSave = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/saveCategory',
      payload: fields,
      callback: (res) => {
        if (res.code === 0) {
          message.success('保存成功');
          this.handleModalVisible(false);
          this.fetchCategories();
        } else {
          message.error(`保存失败：${res.message}`);
        }
      }
    });
  };

  handleDelete = (record) => {
    Modal.confirm({
      title: `确认删除分类：${record.title}吗？`,
      okType: 'danger',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { _id } = record;
        dispatch({
          type: 'news/deleteCategory',
          payload: { _id },
          callback: (res) => {
            if (res.code === 0) {
              message.success('删除成功');
              this.fetchCategories();
            } else {
              message.error(`删除失败：${res.message}`);
            }
          }
        });
      }
    });
  }

  queryLevelTwoCategories = (parentId, expanded) => {
    this.setState((state) => {
      const { expandedRowKeys } = state;
      const index = expandedRowKeys.indexOf(parentId);
      if (index < 0) {
        return {
          ...state,
          expandedRowKeys: [...state.expandedRowKeys, parentId]
        }
      } else {
        const keysCopy = [...expandedRowKeys];
        keysCopy.splice(index, 1);
        return {
          ...state,
          expandedRowKeys: keysCopy
        }
      }
    }, () => {
      console.log(this.state.expandedRowKeys);
    });
    if (!expanded) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'news/queryLevelTwoCategories',
      payload: { parentId }
    });
  }

  categoryCols = () => {
    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        render: val => <img src={val} className={styles.categoryAvatar} style={{ maxWidth: 60, maxHeight: 60 }} />,
      },
      {
        title: '分类标题',
        dataIndex: 'title',
      },
      {
        title: '分类副标题',
        dataIndex: 'subtitle',
      },
      {
        title: '排序',
        dataIndex: 'order'
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        render(val) {
          return <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />;
        },
      },
      {
        title: '首页展示',
        dataIndex: 'showInHome',
        render(val) {
          return <Badge status={val ? 'success' : 'error'} text={val ? '是' : '否'} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <span
                className='link-btn'
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    editCategory: record,
                  }, () => {
                    this.handleModalVisible(true);
                  });
                }}
              >
                编辑
              </span>
              <Divider type="vertical" />
              <span
                className='link-btn'
                onClick={e => { this.handleDelete(record) }}
              >
                删除
              </span>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { loading, news } = this.props;
    const { modalVisible, expandedRowKeys } = this.state;

    const parentMethods = {
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="新闻分类">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增分类
              </Button>
            </div>
            <Table
              rowKey='_id'
              loading={loading}
              dataSource={news.category.list.map(c => ({ ...c, children: c.children || [] }))}
              expandedRowKeys={expandedRowKeys}
              onExpand={(expanded, record) => {
                this.queryLevelTwoCategories(record._id, expanded);
              }}
              pagination={{
                ...news.category.pagination,
                showQuickJumper: true,
                onChange: (pageNum, pageSize) => { this.fetchCategories({ pageNum, pageSize }) }
              }}
              columns={this.categoryCols()}
            />
          </div>
        </Card>
        <EditCategoryModal
          {...parentMethods}
          modalVisible={modalVisible}
          category={this.state.editCategory}
        />
      </PageHeaderWrapper>
    );
  }
}
