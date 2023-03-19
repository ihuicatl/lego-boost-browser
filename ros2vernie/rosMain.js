class CircularStack {
    constructor(size) {
        this.element = [];
        this.size = size
        this.top = -1
    }
    
    isEmpty() {
        return (this.element.length == 0)
    }
    
    push(element) {
        this.top++;
        // Wrap around
        this.top = (this.top < this.size) ? this.top : 0;
        this.element[this.top] = element;
    }
    
    pop() {
        // LIFO : get most recent
        if (this.isEmpty()) return null;
        const value = this.element[this.top]
        this.element[this.top] = null;
        return value
    }
    
    clear() {
        this.element = new Array()
        this.top = -1
    }
}


const topicMap = {};
let publisher = null;
  
// Receive messages from workers
let onMessageFromWorker = function( event ) {
    switch( event.data.command )
    {
        case "register":
            if (!(event.data.topic in topicMap)) {
                topicMap[event.data.topic] = {
                    messages: new CircularStack(5),
                    participants: []
                }
            }

            topicMap[event.data.topic].participants.push(event.data.gid);
            
            break;

        case "deregister":
            let gidIndex = topicMap[event.data.topic].participants.indexOf(event.data.gid);

            // TODO: fix
            // Remove from topic map
            // topicMap[event.data.topic].participants.splice(gidIndex, 1);

            // if (topicMap[event.data.topic].participants.length == 0) {
            //     delete topicMap[event.data.topic];
            // }

            break;

        case "publish":
            topicMap[event.data.topic].messages.push(event.data.message);
            document.getElementById("outputBox").innerHTML += event.data.message + "\n";
            break;

    }
}


// PUBLISHER 

function startPublisher() {

    document.getElementById("outputBox").innerHTML += "Initializing...\n";

    if (publisher === null) {
        publisher = new Worker("./ros2vernie/rainbow.js");
    }

    publisher.onmessage = onMessageFromWorker;
}

function stopPublisher() {
    publisher.terminate();
    publisher = null;

    document.getElementById("outputBox").innerHTML += "Terminated.\n\n";
}

function clearPublisher() {
    document.getElementById("outputBox").innerHTML = "";
}

