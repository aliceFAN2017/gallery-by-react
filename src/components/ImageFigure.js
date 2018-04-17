import React from 'react';
import '../styles/ImageFigure.scss';

class ImageFigure extends React.Component {
  clickHandle = e => {
    this.props.imageState.isCentered ? this.props.flip() : this.props.center();
    e.preventDefault();
    e.stopPropagation();
  }

  render() {

    let styleObj = {};

    // Append pos if it exists
    if (this.props.imageState.pos) {
      styleObj = this.props.imageState.pos;
    }

    // Append rotate degree if it exists
    if (this.props.imageState.rotate) {
      ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(type => {
        styleObj[type] = 'rotate(' + this.props.imageState.rotate + 'deg)';
      })
    }

    // Set z-index as 11 for the centered image
    if (this.props.imageState.isCentered) {
      styleObj.zIndex = 11;
    }

    // Append
    let imgFigureStyle = 'img-figure';
    imgFigureStyle += this.props.imageState.isFlipped ? ' img-flip' : '';
    return (
      <figure onClick={ this.clickHandle } style={ styleObj } className={ imgFigureStyle }>
        <img src={ this.props.image.imageURL } alt={ this.props.image.title } />
        <figcaption>
          <h2 className='img-title'>{ this.props.image.title }</h2>
          <div className='img-back'>
            <p>{ this.props.image.desc }</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

export default ImageFigure;
