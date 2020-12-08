class Node {
    constructor(ID, val, _neighbors) {
        this.stopID = ID;
        this.value = val;
        this.neighbors = _neighbors;
    }
}

class PriorityQueue {
    constructor() {
      this.heap = []
      this.size = 0
    }
    
    insert(stopID, value, neighbors) {

        //Create a node
        const newNode = new Node(stopID, value, neighbors);

        //Push Node to the back of the heap
        this.heap.push(newNode);

        //Current index of the new node
        let currentIndex = this.heap.length - 1;

        //Index of parent node => 0 if new node is the root & and floor((index-1)/2) otherwise
        let parentIndex = (currentIndex===0) ? 0 : Math.floor((currentIndex - 1) / 2);

        //Heapify Up => While index of new node != 0 and new node's value < parent's value
        while ((currentIndex !== 0) && newNode.value < this.heap[parentIndex].value) {

            //If in here, Nodes => create a temp node called tempNode
            const parentNode = this.heap[parentIndex];
            this.heap[parentIndex] = newNode;
            this.heap[currentIndex] = parentNode;
            currentIndex = parentIndex;
            parentIndex = Math.floor((currentIndex - 1) / 2);
        }

        //Increase size of heap by 1
        this.size = this.size + 1;
    }
    remove() {

        //If heap is empty
        if (this.size === 0) {
            return null;
        }

        //Need to return the top node
        let toRemove = this.heap[0];

        //Decrement heap size by 1
        this.size = this.size - 1;

        //Move the last node to the top
        this.heap[0] = this.heap[this.size];

        //Current index
        let currentIndex = 0;

        //Left Child's index
        let leftChildIndex = 2*currentIndex + 1;

        //Right Child's index
        let rightChildIndex = 2*currentIndex + 2;

        //Smallest node index
        let smallestNodeIndex = currentIndex;

        //Heapify down => While node has a child
        var done = false 

        while(!done) {

            //If left child exists & is less than the parent
            if ((leftChildIndex < this.size) && (this.heap[leftChildIndex].value < this.heap[smallestNodeIndex].value)) {

                //If here, left child is less than parent
                smallestNodeIndex = leftChildIndex;
            }

            //If right child exists & is less than the parent or the left if left < parent
            if ((rightChildIndex < this.size) && (this.heap[rightChildIndex].value < this.heap[smallestNodeIndex].value)) {

                //If here, left child is less than parent
                smallestNodeIndex = rightChildIndex;
            }

            //If smallest node changed
            if (currentIndex !== smallestNodeIndex) {

                //Swap
                const parentNode = this.heap[currentIndex];
                this.heap[currentIndex] = this.heap[smallestNodeIndex];
                this.heap[smallestNodeIndex] = parentNode;
                currentIndex = smallestNodeIndex;
                leftChildIndex = 2*currentIndex + 1;
                rightChildIndex = 2*currentIndex + 2;
            }
            else {
                done = true;
            }
        }
        return toRemove;
    }
}

function setMaps(distance, newSize, graph, from, _predecessor) {
    for(var i = 0; i < graph.length; i++) {
        if (graph[i].src !== from.stop_id) {
            distance.set(graph[i].src, {distance: Infinity, neighbors: graph[i].edges});
            _predecessor.set(graph[i].src, -1);
        }
        else {
            distance.set(graph[i].src, {distance: 0, neighbors: graph[i].edges});
            _predecessor.set(graph[i].src, -1);
        }
    }
}

export function djikstra(from, to, graph) {
    //Containers
    var checked_Set = new Set();
    var unchecked_Set = new Set();
    var distance = new Map();
    var predecessor = new Map();
    var queue = new PriorityQueue();

    //Add vertices to unchecked Set
    for(var i = 0; i < graph.length; i++) {
        unchecked_Set.add(graph[i].src);
    }
        
    //Set all the distances to infinity, source distance to 0, and all predecessors to -1
    setMaps(distance, graph.length, graph, from, predecessor);

    //Add distances to priority queue
    const iterator = distance.entries();
    for (var i = 0; i < distance.size; i++) {
        let arr = iterator.next().value;
        queue.insert(arr[0], arr[1].distance, arr[1].neighbors);
    }
    
    //Start of Djikstra's Algorithm
    while (unchecked_Set.size > 0) {

        //Bus Stop with the shortest distance from the source bus stop
        let node = queue.remove();
        let stop = node.stopID;
        let stopDistance = node.value;
        let stopNeighbors = node.neighbors;

        //Go through the neighbors for the stop and do the relaxation 
        for (var i = 0; i < stopNeighbors.length; i++) {
            let destStop = stopNeighbors[i].dest;
            let oldDistance = distance.get(destStop).distance
            let newDistance = stopDistance + stopNeighbors[i].weight;
            if (newDistance < oldDistance) {
                distance.set(destStop, {distance: newDistance, neighbors: distance.get(destStop).neighbors});
                predecessor.set(destStop, stop);
            }
        }

        //Remove bus stop from unchecked set and insert it into the checked set
        unchecked_Set.delete(stop);
        checked_Set.add(stop);

        //Recreate Queue
        queue = new PriorityQueue();
        
        //Add distances to priority queue but if stop is in checked set, don't add it
        const iterator2 = distance.entries();
        for (var i = 0; i < distance.size; i++) {
            let arr = iterator2.next().value;
            if (!checked_Set.has(arr[0])) {
                queue.insert(arr[0], arr[1].distance, arr[1].neighbors);
            }
        }
    }

    //Distance map is complete

    //Create list of stops leading from source stop to destination
    var reversedPath = [];
    var stopID = to.stop_id;
    reversedPath.push(stopID);
    while (stopID !== from.stop_id) {
        stopID = predecessor.get(stopID);
        if (stopID === -1) {
            return [];
        }
        reversedPath.push(stopID);
    }
    let path = reversedPath.reverse();
    /*
    for (var i = 0; i < path.length; i++) {
        console.log(path[i]);
    }
    */
    return path;
}