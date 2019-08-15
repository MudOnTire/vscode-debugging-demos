import React, { Component } from 'react';
import { Spin, Icon, List, Avatar } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { defaultUserAvatar } from '@/utils/constants';

import styles from './Detail.less';

@connect(({ news, comment, loading }) => ({
  news,
  comment,
  loading: loading.effects['news/getPreviewDetail'],
  gettingComments: loading.effects['comment/fetchComments']
}))
export default class Detail extends Component {

  state = {
    news: {}
  }

  componentDidMount() {
    this.getNewsDetail();
    this.getNewsComments();
  }

  getNewsDetail = () => {
    const { dispatch, match } = this.props;
    const newsId = match.params.id;
    if (typeof newsId !== 'undefined') {
      dispatch({
        type: 'news/getPreviewDetail',
        payload: {
          _id: newsId,
        },
        callback: (res) => {
          this.setState({
            news: res.result
          });
        }
      });
    }
  }

  getNewsComments = (params = {}) => {
    const { dispatch, match } = this.props;
    const newsId = match.params.id;
    if (typeof newsId !== 'undefined') {
      dispatch({
        type: 'comment/fetchComments',
        payload: {
          targetId: newsId,
          ...params
        }
      });
    }
  }

  render() {
    const { comment, loading, gettingComments } = this.props;
    const { news } = this.state;
    const { data } = comment;
    const { pagination } = data;
    const hasMore = (pagination.pageNum * pagination.pageSize) < pagination.total;
    return (
      <div>
        {loading ? (
          <Spin
            size="large"
            className={styles.loader}
            indicator={<Icon type="loading" style={{ fontSize: 34 }} spin />}
          />
        ) : (
            <div className={styles.main}>
              <InfiniteScroll
                initialLoad={true}
                pageStart={1}
                loadMore={(page) => { this.getNewsComments({ pageNum: page }) }}
                hasMore={hasMore}
                useWindow={true}
              >
                <p className={styles.newsTitle}>{news.title}</p>
                {/* <p className={styles.newsSubtitle}>{news.subtitle}</p> */}
                <p className={styles.createDate}>
                  <span>
                    {moment(news.createdTime).format('YYYY-MM-DD HH:mm')}
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    {news.watchCount}人阅读
                </span>
                </p>
                <p
                  className={styles.newsContent}
                  dangerouslySetInnerHTML={{ __html: news.detail }}
                />
                <h4>评论（{pagination.total}）</h4>
                <List
                  dataSource={data.list}
                  renderItem={item => {
                    console.log(item);
                    return (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          avatar={<Avatar src={(item.fromUser && item.fromUser.avatar) || defaultUserAvatar} />}
                          title={(item.fromUser && item.fromUser.alias) || '匿名用户'}
                          description={item.content}
                        />
                        <div className={styles.commentTime}>
                          {moment(item.updatedTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </List.Item>
                    )
                  }}
                >
                  {
                    gettingComments &&
                    <div className="demo-loading-container">
                      <Spin />
                    </div>
                  }
                </List>
              </InfiniteScroll>
            </div>
          )}
      </div >
    )
  }
}
