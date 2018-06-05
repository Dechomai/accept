import './FileUpload.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import autobind from 'autobindr';
import classNames from 'classnames';
import {omit} from 'ramda';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    autobind(this);
  }

  onDrop(acceptedFiles) {
    if (!this.props.multiple) {
      const file = acceptedFiles[0];
      if (!file) return;
      this.setState({file});
      this.props.onSelect(file);
    } else {
      const files = acceptedFiles;
      if (!files.length) return;
      this.props.onSelect(files);
    }
  }

  render() {
    const {
      className,
      dropzoneClassName,
      showPreview,
      multiple,
      children,
      imgUrl,
      ...rest
    } = this.props;
    const pass = omit(['onSelect', 'onAccept', 'onReject'], rest);
    const previewUrl = this.state.file ? this.state.file.preview : imgUrl ? imgUrl : null;
    // TODO:
    // 2) use better image cropping
    return (
      <div className={classNames('file-upload', className)}>
        <Dropzone
          multiple={multiple}
          className={classNames('file-upload__dropzone', dropzoneClassName)}
          onDrop={this.onDrop}
          onDropAccepted={this.props.onAccept}
          onDropRejected={this.props.onReject}
          {...pass}>
          {showPreview &&
            (this.state.file || this.props.imgUrl) && (
              <div
                className="file-upload__preview"
                style={{backgroundImage: `url(${previewUrl})`}}
              />
            )}
          {children}
        </Dropzone>
      </div>
    );
  }
}

FileUpload.propTypes = {
  className: PropTypes.string,
  dropzoneClassName: PropTypes.string,
  showPreview: PropTypes.bool,
  imgUrl: PropTypes.string,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func
};

FileUpload.defaultProps = {
  showPreview: true,
  multiple: false
};

export default FileUpload;
