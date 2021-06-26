
export default () => {
    var cnt = 0;
    var buffer = {};
    onmessage = async function (e) {
        let counter
        console.log(e.data)
        counter = e.data.step;
        let HOST = e.data.host;
        let getThGraph = async (step) => {
            let params = {step: step}
            let url = new URL(HOST + "/thread")
            url.search = new URLSearchParams(params).toString()
            let result = []
            result = await fetch(url.toString()).then((response) => response.json())
                .then((arr) => arr.nodes.concat(arr.edges))
            return result
        }

        let getFunGraphs = async (step) => {
            let params = {step: step}
            let url = new URL(HOST + "/func")
            url.search = new URLSearchParams(params).toString()
            let result = await fetch(url.toString()).then((response) => response.json())
                .then((arr) => arr.nodes.concat(arr.edges))
            return result
        }

        let getStack = async (step) => {
            let params = {step: step}
            let url = new URL(HOST + "/stack")
            url.search = new URLSearchParams(params).toString()
            let result = await fetch(url.toString()).then((response) => response.json())
                .then((arr) => arr)
            return result
        }

        let getState = async (step) => {
            let params = {step: step}
            let url = new URL(HOST + "/graphs")
            url.search = new URLSearchParams(params).toString()
            let result = await fetch(url.toString()).then((response) => response.json())
                .then((arr) => arr)
            return result
        }
        while (counter <= e.data.max && buffer[counter] === undefined) {
            // let thRes = await getThGraph(counter)
            // let funRes = await getFunGraphs(counter)
            // let stackRes = await getStack(counter)
            let state = await getState(counter)
            let thRes = state.threadGraph.nodes.concat(state.threadGraph.edges)
            let funRes = state.funcGraph.nodes.concat(state.funcGraph.edges)
            let stackRes = state.stacks
            postMessage({
                "thRes": thRes, "step": counter,
                "funRes": funRes, "stackRes": stackRes
            })
            buffer[counter] = 1
            counter++
        }
    }

}

