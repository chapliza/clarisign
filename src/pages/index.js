import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Webcam from 'react-webcam'
import { Link } from 'gatsby'

import Clarifai from 'clarifai'

import '../components/styles.css'

const app = new Clarifai.App({
  apiKey: 'ef16427578aa4753a5012b7235cbf860',
})

class Video extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: 'none',
      query_format: '',
      file: '',
      imagePreviewUrl: '',
      email: '',
      twitter: '',
      city: '',
      phone: '',
      state: '',
      isHidden: false,
    }
  }


  // https://codepen.io/hartzis/pen/VvNGZP
  _handleSubmit(e) {
    e.preventDefault()
    this.capture()
    // TODO: do something with -> this.state.file
    var url = this.state.imagePreviewUrl
    var base64Data = url.split('base64,')[1]

    app.models
      .predict('7069c9a5c849450dab960d7329f4cdfd', { base64: base64Data })
      .then(response => {
        const res = response['outputs']['0']['data']['regions']['0']['data']
        const celebName = res['face']['identity']['concepts']['0']['name']

        this.setState({
          name: celebName,
        })

        var formatted = celebName.split(' ')
        formatted = formatted.join('%20')
        var url = '/.netlify/functions/cards-read/' + formatted
        console.log('url produced: ', url)
        console.log(
          'correct version: /.netlify/functions/cards-read/kayne%20west'
        )
        fetch(url)
          .then(response => response.json())
          .then(json => {
            console.log(json)
            const res_email = json[0]['data']['email']
            const res_twitter = json[0]['data']['twitter']
            const res_city = json[0]['data']['city']
            const res_phone = json[0]['data']['phone']
            const res_state = json[0]['data']['state']

            this.setState({
              email: res_email,
              twitter: res_twitter,
              city: res_city,
              phone: res_phone,
              state: res_state,
            })
            // console.log(json[0])
          })
      })

    // .then(json => this.setState({ loading: true, msg: json.msg }))
    // console.log('handle uploading-', base64Data)
  }

  _handleImageChange(e) {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      })
    }

    reader.readAsDataURL(file)
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  goBack = () => {
    window.history.back()
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot()
    this.setState({
      imagePreviewUrl: imageSrc, isHidden: true
    })
  }

  render() {
    const videoConstraints = {
      width: 2280,
      height: 720,
      facingMode: 'user',
    }

    let { imagePreviewUrl } = this.state
    let $imagePreview = null
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          className="video-preview"
          id="video_upload_preview"
          src={imagePreviewUrl}
        />
      )
    } else {
      $imagePreview = (
        <img
          className="video-preview"
          id="video_upload_preview"
          src="http://placehold.it/100x100"
          alt="your image"
        />
      )
    }

    return (<div>
      <button className="goBackLink button-style" onClick={this.goBack}>
        Go Back
            </button>
      {/* <a className='goBackLink' onClick={this.goBack}>Go Back</a> */}
      <div className="video-container">
        <div className="center">


          {!this.state.isHidden && <Webcam
            audio={false}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/png"
            width={550}
            videoConstraints={videoConstraints}
          />}

        </div>
        <div className="previewComponent">
          <div className="preview-container-video">

            <div className="imgPreview video-preview">{$imagePreview}</div>
          </div>
          <div className="videoButtons">
            <button className="button-style" onClick={this.toggleHidden.bind(this)}>
              Start Camera
            </button>
            <form className="video" onSubmit={e => this._handleSubmit(e)}>
              <button
                className="button-style"
                type="submit"
                onClick={e => this._handleSubmit(e)}
              >
                Capture Image
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
    )
  }
}

export default Video
