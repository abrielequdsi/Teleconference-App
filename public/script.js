const socket = io('/')
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream); 
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            })
    })


    socket.on('user-connected',(userId) => {
        connectToNewUser(userId, stream);
    })


    // Take Input Value
    let text = $("input");
    // When press enter, send message
    
    $('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
            }
    });
    // Send to socket.io
    socket.on("createMessage", message => {
       
        $(".messages").append(` <li class="message">
            <img src="https://i1.wp.com/mainstsolar.com/wp-content/uploads/2016/08/avatar-placeholder-generic.png?fit=300%2C300" class="right">
            <div class='content'>
             <b>User</b>
             <p>${message}</p>
            </div>
        </li>
`   );
        scrollToBottom()
    })


})

peer.on('open', id => { 
    console.log(id)
    socket.emit('join-room', ROOM_ID, id);
}) 




const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

 

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}





// Scrolling Issue
const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

// Mute button
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

// Video button
const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

// Mute Button UI
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone" style="padding: 0 4px;"></i>
   
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

// Mute Button UI
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash" style="padding: 0 4px;"></i>
 
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

// Video Button UI
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
 
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

// Video Button UI
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
 
  `
  document.querySelector('.main__video_button').innerHTML = html;
}