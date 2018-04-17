import React from 'react';
import '../styles/ControllerUnit.scss';

class ControllerUnit extends React.Component {

  clickHandle = e => {
    this.props.imageState.isCentered ? this.props.flip() : this.props.center();
    e.preventDefault();
    e.stopPropagation();
  }

  render() {

    let controllerUnitClassName = 'controller-unit';
    if (this.props.imageState.isCentered) {
      controllerUnitClassName += ' img-center';
      if (this.props.imageState.isFlipped) {
        controllerUnitClassName += ' img-flip';
      }
    }

    return (
      <div className={ controllerUnitClassName } onClick={ this.clickHandle }></div>
    );
  }
}

export default ControllerUnit
