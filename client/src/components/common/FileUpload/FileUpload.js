import './FileUpload.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import autobind from 'autobindr';
import classNames from 'classnames';

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
    const {className, dropzoneClassName, showPreview, multiple, children, ...rest} = this.props;

    // TODO:
    // 1) show error msg why photo was rejected
    // 2) use better image cropping
    return (
      <div className={classNames('file-upload', className)}>
        <Dropzone
          multiple={multiple}
          className={classNames('file-upload__dropzone', dropzoneClassName)}
          onDrop={this.onDrop}
          {...rest}>
          {showPreview && this.state.file ? (
            <img className="file-upload__preview" src={this.state.file.preview} alt="" />
          ) : (
            children
          )}
        </Dropzone>
      </div>
    );
  }
}

FileUpload.propTypes = {
  className: PropTypes.string,
  dropzoneClassName: PropTypes.string,
  showPreview: PropTypes.bool,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

FileUpload.defaultProps = {
  showPreview: true,
  multiple: false
};

export default FileUpload;