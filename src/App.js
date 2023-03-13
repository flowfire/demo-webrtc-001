import './App.scss';
import React from "react"

function App() {
  const [rtcConfig, setRtcConfig] = React.useState("")
  const [rtcAnswer, setRtcAnswer] = React.useState("")
  const [rtcInput, setRtcInput] = React.useState("")
  const RTCRef = React.useRef()
  const ChannelRef = React.useRef()
  React.useEffect(() => {
    if (RTCRef.current) return
    RTCRef.current = new RTCPeerConnection();
    const rtc = RTCRef.current
    ChannelRef.current = rtc.createDataChannel("test")
    ChannelRef.current.addEventListener("open", () => {
      console.log("OPEN")
    })
    ChannelRef.current.addEventListener("message", (e) => {
      console.log("MESSAGE")
      console.log(e)
    })
    rtc.addEventListener("icecandidate", event => console.log(event))
    rtc.ondatachannel = (e) => {
      console.log(e)
    }
  }, [])


  const generateConfig = async () => {
    const rtc = RTCRef.current
    const config = await rtc.createOffer()
    // console.log(config)
    rtc.setLocalDescription(new RTCSessionDescription(config));
    // send the offer to a server to be forwarded to the friend you're calling.
    setRtcConfig(JSON.stringify(config))
  }

  const generateAnswer = async () => {
    const rtc = RTCRef.current
    rtc.setRemoteDescription(JSON.parse(rtcInput))
    const config = await rtc.createAnswer()
    setRtcAnswer(JSON.stringify(config))
    rtc.setLocalDescription(config)
  }

  const acceptAnswer = async () => {
    const rtc = RTCRef.current
    await rtc.setRemoteDescription(JSON.parse(rtcInput), console.log, console.log)

    // ChannelRef.current.send("asdasdasd")
  }
  return (
    <div className="App">
      <div className='main'>
        <div className="config">
          <div className='show-config'>
            <textarea 
            value={rtcConfig}
            onChange={event => {
              setRtcInput(event.target.value)
            }}></textarea>
          </div>
          <div className='show-answer'>
            <textarea 
            value={rtcAnswer}
            onChange={event => {
              setRtcInput(event.target.value)
            }}></textarea>
          </div>
          <div className='generate-config'
          onClick={generateConfig}
          >生成</div>
          <div className='paste-config'>
            <textarea 
            value={rtcInput}
            onChange={event => {
              setRtcInput(event.target.value)
            }}></textarea>
          </div>
          <div className='apply-config' onClick={ generateAnswer }>接受offer</div>
          <div className='apply-answer' onClick={ acceptAnswer }>接受answer</div>
        </div>
      </div>
    </div>
  );
}

export default App;
