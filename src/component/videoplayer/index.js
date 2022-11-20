import ReactPlayer from 'react-player';
import React from "react";
import "./videoplayer.css"
export default class ResponsivePlayer extends React.Component {
    render () {
      return (
        <div className='maindiv'>
        <div className='player-wrapper'>
          <ReactPlayer
            className='react-player'
           onPlay={()=>this.props.afterComplete(false)}
           playing={true}
            url='https://www.youtube.com/watch?v=cwjMwmDSKV0'
            width='100%'
            height='100%'
            onReady={true}
            onEnded={()=>{this.props.afterComplete(true)}}
          />
        </div>
        </div>
      )
    }
  }