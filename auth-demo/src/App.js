import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";

import Clarifai from "clarifai";

import './styles.css'

const app = new Clarifai.App({
  apiKey: "709c134d49844051802ae08a90f11081"
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "none",
      file: '',
      imagePreviewUrl: ''
    };
  }
  // https://codepen.io/hartzis/pen/VvNGZP
  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    var url = this.state.imagePreviewUrl
    var base64Data = url.split('base64,')[1];

    app.models.predict("e466caa0619f444ab97497640cefc4dc", { base64: base64Data }).then(
      response => {
        const res = response["outputs"]['0']['data']['regions']['0']['data']
        const celebName = res['face']['identity']['concepts']['0']['name']

        this.setState({
          name: celebName
        });
      }

    );

    console.log('handle uploading-', base64Data);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {

    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="placeholder" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<img alt="placeholder" id="image_upload_preview" src="http://placehold.it/100x100" alt="your image" />);
    }

    return (
      <div className="form-container">
        <h1>{this.state.name}</h1>
        <div className="previewComponent">
          <form onSubmit={(e) => this._handleSubmit(e)}>
            <input className="fileInput"
              type="file"
              onChange={(e) => this._handleImageChange(e)} />
            <button className="submitButton"
              type="submit"
              onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
          </form>
          <div className="imgPreview">
            {$imagePreview}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
