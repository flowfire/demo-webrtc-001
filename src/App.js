import './App.scss';
import React, { useEffect, useRef, useState } from "react"

function App() {
  // OOA => Offer Or Answer
  const [inputOOA, setInputOOA] = useState("")
  const [outputOOA, setOutputOOA] = useState("")

  const [inputCan, setInputCan] = useState("")
  const [outputCan,setOutputCan] = useState("")

  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")

  const rtcRef = useRef()
  const channelRef = useRef()

  const handleOOA = async () => {
    if (!inputOOA && !outputOOA) {
      // generate Offer
      const offer = await rtcRef.current.createOffer()
      rtcRef.current.setLocalDescription(offer)
      setOutputOOA(JSON.stringify(offer))
    }
    if (inputOOA && !outputOOA) {
      // genarate Answer
      const offer = JSON.parse(inputOOA)
      rtcRef.current.setRemoteDescription(offer)
      const answer = await rtcRef.current.createAnswer()
      rtcRef.current.setLocalDescription(answer)
      setOutputOOA(JSON.stringify(answer))
    }
    if (inputOOA && outputOOA) {
      // receive Answer
      const answer = JSON.parse(inputOOA)
      rtcRef.current.setRemoteDescription(answer)
    }
  }

  const handleCan = async () => {
    rtcRef.current.addIceCandidate(JSON.parse(inputCan))
  }

  useEffect(() => {
    rtcRef.current = new RTCPeerConnection()
    rtcRef.current.addEventListener("icecandidate", (event) => {
      console.log(event)
      if (event.candidate) {
        setOutputCan(JSON.stringify(event.candidate))
      }
    })
    // const now = new Date().getTime()
    // const randomPort = Math.round(Math.random * 10000) + 40000
    // const can = new RTCIceCandidate({
    //     candidate: `${now} 1 udp ${now} ::1 ${randomPort} typ host`,
    //     sdpMid: 0,
    //     sdpMLineIndex: 0,
    // })

    // rtcRef.current.addIceCandidate(can)
    channelRef.current = rtcRef.current.createDataChannel("data")
    channelRef.current.onopen = console.log
    channelRef.current.addEventListener("open", () => {
      console.log("__DATA_CHANNEL_OPEN__");
    })
    channelRef.current.addEventListener("close", () => {
      console.log("__DATA_CHANNEL_CLOSE__");
    })
    channelRef.current.addEventListener("message", (event) => {
      console.log("__DATA_CHANNEL_OPEN__");
    })
  }, [])

  return (<>
    <div className='output-box'>
    <div className='output'>
      <div className='title' onDoubleClick={handleOOA}>Offer 或 Answer</div>
      <div className='content'>{ outputOOA }</div>
    </div>
    <div className='output'>
      <div className='title' onDoubleClick={handleCan}>candidate</div>
      <div className='content'>{ outputCan }</div>
    </div>
    </div>
    <div className='input-box'>
    <div className='input'>
      <div className='title'>Offer 或 Answer</div>
      <textarea className='content' onChange={(event) => {
        setInputOOA(event.target.value)
      }}/>
    </div>
    <div className='input'>
      <div className='title'>candidate</div>
      <textarea className='content' onChange={(event) => {
        setInputCan(event.target.value)
      }}/>
    </div>
    </div>
    <div className='chat-box'>
    <div className='input'>
      <textarea/>
    </div>
    <div className='output'>
      <textarea className='output' readOnly={true}/>
    </div>
    </div>
  </>
  );
}

export default App;
