import React,{ Component} from 'react'

class KommunicateChat extends Component{
    constructor(props)
    {
        super(props)
    }

    componentDidMount()
    {
        (function(d, m){
            var kommunicateSettings = {"appId":"b43691ff71d457d3d58eed41029b5359","popupWidget":true,"automaticChatOpenOnNavigation":true};
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
          })(document, window.kommunicate || {});
    }

    componentDidUpdate() {
        if (!window.kommunicate) {
            const kommunicateSettings = {"appId":"b43691ff71d457d3d58eed41029b5359","popupWidget":true,"automaticChatOpenOnNavigation":true};
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            const h = document.getElementsByTagName("head")[0];
            h.appendChild(s);
            window.kommunicate = window.kommunicate || {};
            window.kommunicate._globals = kommunicateSettings;
        }
    }
    

    render()
    {
        return (<div></div>)
    }
}


export default KommunicateChat;