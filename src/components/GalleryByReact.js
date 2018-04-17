import React from 'react';
import ReactDOM from 'react-dom';
import imagesData from '../data/imagesData.json';
import ImageFigure from './ImageFigure';
import ControllerUnit from './ControllerUnit';

import '../styles/GalleryByReact.scss';

// Convert images data to url
(function convertToImageURL(images) {
  images.map(image => image.imageURL = require('../images/' + image.fileName));
})(imagesData);

class GalleryByReact extends React.Component {
  constructor() {
    super();
    this.state = {
      imageFiguresState: [
        /* {
              pos: {
              left: '0',
              top: '0'
              },
              rotate: 0,  // Rotate degree between -30 ~ 30
              isFlipped: false,  // Indicate whether the photo is displayed in the front or back page
              isCentered: false  // Indicate whether the photo is located in center
        } */
      ]
    }
  }

  coordCategory = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {   // Horizontal coordination range
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {   // Vertical coordination range
      x: [0, 0],
      topY: [0, 0]
    }
  };

  /*
  * flip current image
  * @param index: pass in the index of the image that needs to be flipped currently
  * @return { Function }: this is a closure function
  */

  flip = index => {
    return function() {
      let currentImageFiguresState = this.state.imageFiguresState;
      currentImageFiguresState[index].isFlipped = !currentImageFiguresState[index].isFlipped;

      this.setState({
        imageFiguresState: currentImageFiguresState
      })
    }
  }

  // Generate a random num within a range
  generateRandomNum = (low, high) => {
    return Math.ceil(low + Math.random() * (high - low));
  }

  // Generate a random degree from -30 to 30
  generateRandRotationDegree = () => {
    return (Math.random() < 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

  /*
  * Re-place current photo
  * @param index: pass in the index of the image that needs to be placed in the center
  * @return { Function }: this is a closure function
  */

  layoutImageFigures = centerIndex => {
    let imageFiguresState = this.state.imageFiguresState,
        coordCategory = this.coordCategory,
        centerPos = coordCategory.centerPos,
        hPosRange = coordCategory.hPosRange,
        vPosRange = coordCategory.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        // Extract images for the center part
        imageFiguresPlacedInCenter = imageFiguresState.splice(centerIndex, 1),

        // Handle top part
        imageFiguresPlacedInTop = [],
        topImageFiguresNum = Math.floor(Math.random() * 2),    // 0 or 1
        topImageFigureSpliceIndex = Math.floor(Math.random() * (imageFiguresState.length - topImageFiguresNum));

        // Get the image with centerIndex centered, no rotation is needed here
        imageFiguresPlacedInCenter[0] = {
          pos: centerPos,
          rotate: 0,
          isCentered: true
        };

        // Extract images for the top part
        imageFiguresPlacedInTop = imageFiguresState.splice(topImageFigureSpliceIndex, topImageFiguresNum);

        // Retrieve images' state which are placed in the top section
        imageFiguresPlacedInTop.map(() => {
          return {
            pos: {
              left: this.generateRandomNum(vPosRangeX[0], vPosRangeX[1]),
              top:  this.generateRandomNum(vPosRangeTopY[0], vPosRangeTopY[1])
            },
            rotate: this.generateRandRotationDegree(),
            isCentered: false
          }
        });

        // Handle left and right parts
        for (let i = 0, n = imageFiguresState.length, k = Math.floor(n / 2); i < n; i++) {

          // Place the first half in Left, and second half in right
          let hPosRangeLORX = i < k ? hPosRangeLeftSecX : hPosRangeRightSecX;

          imageFiguresState[i] = {
            pos: {
              left: this.generateRandomNum(hPosRangeLORX[0], hPosRangeLORX[1]),
              top: this.generateRandomNum(hPosRangeY[0], hPosRangeY[1])
            },
            rotate: this.generateRandRotationDegree(),
            isCentered: false
          };
        }

        if (imageFiguresPlacedInTop && imageFiguresPlacedInTop[0]) {
          imageFiguresState.splice(topImageFigureSpliceIndex, 0, imageFiguresPlacedInTop[0]);
        }

        imageFiguresState.splice(centerIndex, 0, imageFiguresPlacedInCenter[0]);
        this.setState({
          imageFiguresState: imageFiguresState
        })
  }

  /*
  * Re-place current photo
  * @param index: pass in the index of the image that needs to be placed in the center
  * @return { Function }: this is a closure function
  */
  center = index => {
    return function() {
      this.layoutImageFigures(index);
    }
  }

  // Calculate coordinate range for each photo after component was mounted
  componentDidMount() {

    // Calculate width and height for the element of "stage"
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // Calculate width and height for each photo
    let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
        imageW = imageFigureDOM.scrollWidth,
        imageH = imageFigureDOM.scrollHeight,
        halfImageW = Math.ceil(imageW / 2),
        halfImageH = Math.ceil(imageH / 2);

    // Calculate coordinate for the image placed in center
    this.coordCategory.centerPos = {
      left: halfStageW - halfImageW,
      top: halfStageH - halfImageH
    }

    // Calculate coordinate range for images placed in left and right sections
    this.coordCategory.hPosRange = {
      leftSecX: [-halfImageW, halfStageW - halfImageW * 3],
      rightSecX: [halfStageW + halfImageW, stageW - halfImageW],
      y: [-halfImageH, stageH - halfImageH]
    }

    // Calculate coordinate range for images placed in the top section
    this.coordCategory.vPosRange = {
      x: [halfStageW - imageW, halfStageW],
      topY: [-halfImageH, halfStageH - halfImageH * 3]
      // topY: [-halfImageH, halfImageH]
    }

    // Place first image in center
    this.layoutImageFigures(0);
  }

  render() {
    var imageFigures = [], controllerUnits = [];
    imagesData.forEach((image, index) => {
      if (!this.state.imageFiguresState[index]) {
        this.state.imageFiguresState[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isFlipped: false,
          isCentered: false
        }
      }

      imageFigures.push(<ImageFigure key={ index } image={ image } ref={ 'imageFigure' + index } imageState={ this.state.imageFiguresState[index] } flip={ this.flip(index).bind(this) } center={ this.center(index).bind(this) }/>);
      controllerUnits.push(<ControllerUnit key={ index } imageState={ this.state.imageFiguresState[index] } flip={ this.flip(index).bind(this) } center={ this.center(index).bind(this) }/>);
    })

    return (
      <section className='stage' ref='stage'>
        <section className='img-sec'>{ imageFigures }</section>
        <section className='controller-nav'>{ controllerUnits }</section>
      </section>
    );
  }
}

export default GalleryByReact;
