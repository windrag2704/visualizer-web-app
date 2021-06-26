export default () => {
    onmessage = function(e) {
        let speed = e.data;
        setTimeout(function() {
            postMessage(speed)
        }, 1000 / e.data)
    }
}