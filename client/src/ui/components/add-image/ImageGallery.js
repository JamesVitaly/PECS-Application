/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import Modal from 'react-modal';
import _ from 'underscore';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GalleryImage from './GalleryImage';
import { loadCategories, loadUserGallery } from '../../actions';
import handleAddImage from '../../../modules/handle-add-image';
import handleAddCategory from '../../../modules/handle-add-category';
import handleRemoveImage from '../../../modules/handle-remove-image';
import handleRemoveCategory from '../../../modules/handle-remove-category';
import Select from '../_common/Select';
import Header from '../_common/Header';
import Form from '../_common/Form';
import Input from '../_common/Input';
import Button from '../_common/Button';
import ImageUpload from './ImageUpload';

const mapStateToProps = state => ({
  userId: state.userId,
});

class ImageGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddImageModalOpen: false,
      currentImage: '',
      isUpdateCategoryModalOpen: false,
      isUploadImageModalOpen: false,
    };
    this.openImageModal = this.openImageModal.bind(this);
    this.closeImageModal = this.closeImageModal.bind(this);
    this.closeUploadImageModal = this.closeUploadImageModal.bind(this);
    this.closeUpdateCategoryModal = this.closeUpdateCategoryModal.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  openUploadImageModal() {
    this.setState({
      isUploadImageModalOpen: true,
    });
  }

  closeUploadImageModal() {
    this.setState({
      isUploadImageModalOpen: false,
    });
  }

  openUpdateCategoryModal() {
    this.setState({
      isUpdateCategoryModalOpen: true,
    });
  }

  closeUpdateCategoryModal() {
    this.setState({
      isUpdateCategoryModalOpen: false,
    });
  }

  openImageModal(image) {
    this.setState({
      isAddImageModalOpen: true,
      currentImage: image,
    });
  }

  closeImageModal() {
    this.setState({
      isAddImageModalOpen: false,
      currentImage: '',
    });
  }

  removeImage(image) {
    const { dispatch, userId } = this.props;
    handleRemoveImage({ image, userId })
      .then(() => {
        dispatch(loadUserGallery({ userId }));
      })
      .catch(error => console.log(error));
  }

  removeCategory() {
    const { dispatch, userId } = this.props;
    const category = document.querySelector('[name="removeCategory"]').value;
    handleRemoveCategory({ category, userId })
      .then((response) => {
        console.log(`Category ${response} removed`);
        dispatch(loadCategories({ userId }));
        this.closeUpdateCategoryModal();
      })
      .catch(error => console.log(error));
  }

  addCategory() {
    const { dispatch, userId } = this.props;
    const category = document.querySelector('[name="categoryName"]').value;
    handleAddCategory({ category, userId })
      .then((response) => {
        this.closeUpdateCategoryModal();
        dispatch(loadCategories({ userId }));
        console.log(`You added the category: ${response}`);
      })
      .catch(error => console.log(error));
  }


  addImage() {
    const { currentImage } = this.state;
    const { dispatch, userId } = this.props;
    const category = document.querySelector('[name="categoryName"]').value;
    handleAddImage({ image: currentImage, category, userId })
      .then((response) => {
        this.closeImageModal();
        dispatch(loadUserGallery({ userId }));
        console.log(`You added the image: ${response.fileName}`);
      })
      .catch(error => console.log(error));
  }

  renderUpdateCategoryModal() {
    const { isUpdateCategoryModalOpen } = this.state;
    const { categories } = this.props;
    return (
      /* eslint-disable */
      <Modal
        isOpen={isUpdateCategoryModalOpen}
        onRequestClose={this.closeUpdateCategoryModal}
        contentLabel="Add Image Details"
        shouldCloseOnOverlayClick
        ariaHideApp={false}
      >
        <div
          className="ModalHeader"
          onClick={() => this.closeUpdateCategoryModal()}
        >
          <i className="fa fa-times" />
        </div>
        <div
          className="UpdateCategoryModal"
        >
          <Form id="add-category">
            <p>
              Add new
            </p>
            <Input
              type="text"
              name="categoryName"
              label="Category Name"
              className="Input--invert"
            />
            <Button
              label="Add category"
              theme="success"
              onClick={() => this.addCategory()}
            />
          </Form>
          <Form id="remove-category">
            <Select
              name="removeCategory"
              label="Remove category"
            >
              {categories ? categories.map(category => (
                <option value={category} key={category}>
                  {category}
                </option>
              )) : null}
            </Select>
            <Button
              label="Remove category"
              theme="warning"
              onClick={() => this.removeCategory()}
            />
            <Button
              label="Cancel"
              theme="link"
              onClick={() => this.closeUpdateCategoryModal()}
            />
          </Form>
        </div>
      </Modal>
    );
  }

  renderUploadImageModal() {
    const { userId, categories } = this.props;
    const { isUploadImageModalOpen } = this.state;
    return (
      <Modal
        isOpen={isUploadImageModalOpen}
        onRequestClose={this.closeUploadImageModal}
        contentLabel="Add Image Details"
        shouldCloseOnOverlayClick
        ariaHideApp={false}
      >
        <div
          className="ModalHeader"
          onClick={() => this.closeUploadImageModal()}
        >
          <i className="fa fa-times" />
        </div>
        <ImageUpload
          userId={userId}
          closeUploadImageModal={this.closeUploadImageModal}
          categories={categories}
        />
      </Modal>);
  }

  renderAddImageModal() {
    const { isAddImageModalOpen, currentImage } = this.state;
    const { categories } = this.props;
    return (
      <Modal
        isOpen={isAddImageModalOpen}
        onRequestClose={this.closeImageModal}
        contentLabel="Add Image Details"
        shouldCloseOnOverlayClick
        ariaHideApp={false}
      >
        <div
          className="ModalHeader"
          onClick={() => this.closeImageModal()}
        >
          <i className="fa fa-times" />
        </div>
        <div className="AddImageForm">
          <GalleryImage
            key={currentImage}
            image={currentImage}
          />
          <Form id="add-image">
            <Select
              label="Select a category"
              name="categoryName"
            >
              {categories ? categories.map(category => (
                <option
                  value={category}
                  key={category}
                >
                  {category}
                </option>
              )) : null}
            </Select>
            <Button
              label="Add Image"
              onClick={() => this.addImage()}
              theme="success"
              type="button"
            />
            <Button
              label="Cancel"
              onClick={() => this.closeImageModal()}
              theme="link"
              type="button"
            />
          </Form>
        </div>
      </Modal>
    );
  }


  render() {
    const { gallery, userGallery } = this.props;
    return (
      <div className="ImageGallery">
        <Header
          heading="Add images from gallery"
          size="large"
        />
        <Header
          heading="Add and remove category titles"
          size="small"
        />
        <div className="ButtonGroup">
          <Button
            label="Update categories"
            theme="open"
            onClick={() => this.openUpdateCategoryModal()}
          />
          <Button
            label="Upload image"
            theme="open"
            onClick={() => this.openUploadImageModal()}
          />
        </div>
        <div className="ImageGallery--wrapper">
          <div className="ImageGallery--images">
            {userGallery.map((image) => {
              const { userSubmitted } = image;
              return (
                <GalleryImage
                  key={image}
                  userSubmitted={userSubmitted}
                  isOwnedByUser
                  image={image}
                  removeImage={this.removeImage}
                  openImageModal={this.openImageModal}
                />);
            })
              }
          </div>
        </div>
        <div className="ImageGallery--wrapper">
          <div className="ImageGallery--images">
            {gallery.map((image) => {
              const notUserOwner = !_.contains(userGallery, image);
              return notUserOwner ? (
                <GalleryImage
                  key={image}
                  image={image}
                  removeImage={this.removeImage}
                  openImageModal={this.openImageModal}
                />) : null;
            })}
          </div>
        </div>
        {this.renderAddImageModal()}
        {this.renderUpdateCategoryModal()}
        {this.renderUploadImageModal()}
      </div>
    );
  }
}


ImageGallery.propTypes = {
  gallery: PropTypes.arrayOf(PropTypes.string),
  userGallery: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  dispatch: PropTypes.func,
  userId: PropTypes.string,
};

ImageGallery.defaultProps = {
  gallery: undefined,
  userGallery: undefined,
  categories: undefined,
  dispatch: undefined,
  userId: undefined,
};

export default connect(mapStateToProps)(ImageGallery);
