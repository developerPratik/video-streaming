var base_url = "http://localhost:9247"

$(document).ready(function () {

    // let video = document.getElementById('video-player');

    var options = {
        playbackRates: [1, 1.5, 2],
        scrubbing: true
       
    };
    var video = videojs('video-player', options, function onPlayerReady() {

        let _this = this;
        const mimeType = {
            vp8: 'video/webm; codecs="vorbis,vp8"',
            avc: 'video/mp4; codecs="avc1.64000d,mp4a.40.2"'

        }

        let mediaSource = new MediaSource();
        let blob_url = URL.createObjectURL(mediaSource);
        this.src(blob_url);
        var socket = io.connect(`/video`);
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get('id');
        let format = url.searchParams.get('v');

        // let mime = mimeType[format];
        let mime = mimeType[format];

        socket.emit('id', id);

        if (MediaSource.isTypeSupported(mime)) {

            mediaSource.addEventListener('sourceopen', function () {

                let sourceBuffer = mediaSource.addSourceBuffer(mimeType[format]);
                sourceBuffer.mode = 'sequence';
                ss(socket).on('video', function (stream) {

                    stream.on('data', function (data) {
                   
                        sourceBuffer.appendBuffer(data);



                    })
                });


            });
        }
        else {
           alert('video is not supported');
        }

    });






});
