import Flickity from "flickity";
import React from "react";
import ReactDOM from "react-dom";
import "flickity/dist/flickity.min.css";

/**
 * https://flickity.metafizzy.co/options.html
 * https://medium.com/yemeksepeti-teknoloji/using-flickity-with-react-a906649b11de
 */
export default class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flickityReady: false,
    };

    this.refreshFlickity = this.refreshFlickity.bind(this);
  }

  componentDidMount() {
    this.flickity = new Flickity(this.flickityNode, this.props.options || {});

    this.setState({
      flickityReady: true,
    });
  }

  refreshFlickity() {
    this.flickity.reloadCells();
    this.flickity.resize();
    this.flickity.updateDraggable();
  }

  componentWillUnmount() {
    // this.flickity.destroy(); //VT - fix so it does not throw a "removeChild, Node not found" error. Let React unmount the component.
  }

  componentDidUpdate(prevProps, prevState) {
    const flickityDidBecomeActive = !prevState.flickityReady && this.state.flickityReady;
    const childrenDidChange = prevProps.children.length !== this.props.children.length;

    if (flickityDidBecomeActive || childrenDidChange) {
      this.refreshFlickity();
    }
  }

  renderPortal() {
    if (!this.flickityNode) {
      return null;
    }

    const mountNode = this.flickityNode.querySelector(".flickity-slider");

    if (mountNode) {
      return ReactDOM.createPortal(this.props.children, mountNode);
    }
  }

  render() {
    return [
      <div className="test" key="flickityBase" ref={(node) => (this.flickityNode = node)} />,
      this.renderPortal(),
    ].filter(Boolean);
  }
}
