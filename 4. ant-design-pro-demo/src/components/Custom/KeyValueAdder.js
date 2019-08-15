import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Col, Row } from 'antd';
import styles from './KeyValueAdder.less';

export default class KeyValueAdder extends React.Component {

  state = {
    list: this.props.value || []
  }

  handleChange = () => {
    const { onChange } = this.props;
    const result = this.state.list.filter(item => {
      const { key, value } = item;
      return key && value && key.length && value.length
    }).map((item, index) => ({
      ...item,
      index
    }));
    onChange(result);
  }

  add = () => {
    this.setState((state) => {
      return {
        list: [...state.list, { key: '', value: '' }]
      }
    }, this.handleChange);
  }

  subtract = (index) => {
    this.setState((state) => {
      const { list } = state;
      return {
        list: [
          ...list.slice(0, index),
          ...list.slice(index + 1)
        ]
      }
    }, this.handleChange);
  }

  update = (value, index, type) => {
    this.setState((state) => {
      const { list } = state;
      const targetItem = list[index];
      let updatedItem;
      if (type === 'key') {
        updatedItem = { key: value, value: targetItem.value };
      }
      if (type === 'value') {
        updatedItem = { key: targetItem.key, value };
      }
      return {
        list: [
          ...list.slice(0, index),
          updatedItem,
          ...list.slice(index + 1)
        ]
      }
    }, this.handleChange);
  }

  render() {

    const { list } = this.state;
    const { keyPlaceholder, valuePlaceholder, isVideo } = this.props;
    return (
      <div className={styles.main}>
        {
          list.map((item, index) => {
            return (
              <Row key={index}>
                <Col span={6}>
                  <Input
                    value={item.key}
                    placeholder={keyPlaceholder}
                    onChange={(e) => {
                      this.update(e.target.value, index, 'key')
                    }}
                  />
                </Col>
                <Col span={1} style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#666' }}>
                  :
                </Col>
                <Col span={14}>
                  <Input
                    value={item.value}
                    placeholder={valuePlaceholder}
                    onChange={(e) => {
                      this.update(e.target.value, index, 'value')
                    }}
                  />
                </Col>
                <Col span={3}>
                  <Icon
                    type="minus-circle"
                    theme="outlined"
                    onClick={() => this.subtract(index)}
                    className={styles.minusBtn}
                  />
                  {
                    isVideo && item.value &&
                    <a href={item.value} target='_blank'>
                      <Icon type="play-circle" className={styles.playBtn} />
                    </a>
                  }
                </Col>
              </Row>
            )
          })
        }
        <div className={styles.addBox}>
          <Icon
            type="plus-circle"
            theme="outlined"
            onClick={this.add}
            className={styles.addBtn}
          />
        </div>
      </div>
    )
  }
}

KeyValueAdder.propTypes = {
  keyPlaceholder: PropTypes.string,
  valuePlaceholder: PropTypes.string,
  isVideo: PropTypes.bool
  // value: PropTypes.array,
  // onChange:PropTypes.func,
}

KeyValueAdder.defaultProps = {
  keyPlaceholder: '请输入客服名称',
  valuePlaceholder: '请输入客服电话',
  isVideo: false
  // value: [],
  // onChange:()=>{},
}