import { Upload, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import Config from '../../services/config';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList || []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    console.log(fileList);
    this.setState({ fileList });
    this.props.onChange(fileList);
  }

  componentWillReceiveProps(props) {
    if (this.props.fileList.length !== props.fileList.length) {
      this.setState({
        fileList: props.fileList
      })
    } else {
      if (props.fileList.length > 0) {
        for (let i = 0; i < props.fileList.length; i++) {
          let newFile = props.fileList[i];
          let oldFile = this.props.fileList.find(file => file.uid === newFile.uid);
          if (typeof oldFile === 'undefined' || newFile.url !== oldFile.url) {
            this.setState({
              fileList: props.fileList
            });
            break;
          }
        }
      }
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action={`/api/upload`}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          multiple={this.props.multiple}
          withCredentials={true}
        >
          {fileList.length >= this.props.maxCount ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

PicturesWall.propTypes = {
  maxCount: PropTypes.number,
  onChange: PropTypes.func,
  fileList: PropTypes.array,
  multiple: PropTypes.bool
}

PicturesWall.defaultProps = {
  maxCount: 1,
  onChange: () => { },
  multiple: false
}

export default PicturesWall;