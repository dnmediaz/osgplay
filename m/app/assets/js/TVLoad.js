function ChangeFrame(id) {
    var dvPlayer = document.getElementById("dvPlayer");
    if (dvPlayer != null) {
        var iframe = "";
        if (id == 1)
        {
            iframe = '<iframe id="fp_embed_player" src="https://bro4bet.live:8888/embed_player?urlServer=wss://bro4bet.live:8443&amp;streamName=rtsp://202.160.175.28/tanu_ch_2&amp;mediaProviders=WebRTC,Flash,MSE,WSPlayer&amp;autoplay=1" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no" allowfullscreen="allowfullscreen"></iframe>';
        }
        else if (id == 2)
        {
            iframe = '<iframe id="fp_embed_player" src="https://bro4bet.live:8888/embed_player?urlServer=wss://bro4bet.live:8443&amp;streamName=rtsp://202.160.175.29/tanu_ch_1&amp;mediaProviders=WebRTC,Flash,MSE,WSPlayer&amp;autoplay=1" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no" allowfullscreen="allowfullscreen"></iframe>';
        }
        else if (id == 3)
        {
            iframe = '<iframe id="fp_embed_player" src="https://bro4bet.live:8888/embed_player?urlServer=wss://bro4bet.live:8443&amp;streamName=rtsp://202.160.175.28/tanu_ch_4&amp;mediaProviders=WebRTC,Flash,MSE,WSPlayer&amp;autoplay=1" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no" allowfullscreen="allowfullscreen"></iframe>';
        }
        else if (id == 4)
        {
            iframe = '<iframe id="fp_embed_player" src="https://bro4bet.live:8888/embed_player?urlServer=wss://bro4bet.live:8443&amp;streamName=rtsp://202.160.175.28/tanu_ch_3&amp;mediaProviders=WebRTC,Flash,MSE,WSPlayer&amp;autoplay=1" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no" allowfullscreen="allowfullscreen"></iframe>';
        }
        else if (id == 5)
        {
            iframe = '<iframe id="fp_embed_player" src="https://bro4bet.live:8888/embed_player?urlServer=wss://bro4bet.live:8443&amp;streamName=rtsp://178.32.67.42:1935/myStr1/myStream&amp;mediaProviders=WebRTC,Flash,MSE,WSPlayer&amp;autoplay=1" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no" allowfullscreen="allowfullscreen"></iframe>';

        }
        dvPlayer.innerHTML = iframe;
    }
}