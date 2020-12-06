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
        let parentIndex = (currentIndex==0) ? 0 : Math.floor((currentIndex - 1) / 2);
        //Heapify Up => While index of new node != 0 and new node's value < parent's value
        while ((currentIndex != 0) && newNode.value < this.heap[parentIndex].value) {
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
        if (this.size == 0) {
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
            if (currentIndex != smallestNodeIndex) {
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
        if (graph[i].src != from.stop_id) {
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
    while (stopID != from.stop_id) {
        stopID = predecessor.get(stopID);
        if (stopID == -1) {
            return [];
        }
        reversedPath.push(stopID);
    }
    let path = reversedPath.reverse();
    for (var i = 0; i < path.length; i++) {
        console.log(path[i]);
    }
    return path;
}

let graph = 
[
    {
    _id: "5fc17b1b1115fd490825428a",
    src: "4158894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72cd",
    dest: "4158898",
    weight: 222
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825428c",
    src: "4158898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ce",
    dest: "4158902",
    weight: 442.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825428e",
    src: "4158902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72cf",
    dest: "4175884",
    weight: 202.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254290",
    src: "4175884",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d0",
    dest: "4158870",
    weight: 1439.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254292",
    src: "4158870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d1",
    dest: "4158874",
    weight: 647.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254294",
    src: "4158874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d2",
    dest: "4129042",
    weight: 1099.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825429f",
    src: "4166498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d7",
    dest: "4092962",
    weight: 416.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825429a",
    src: "4129050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d5",
    dest: "4158846",
    weight: 525.6
    },
    {
    _id: "5fc15f453b1b763994eb7387",
    dest: "4092966",
    weight: 205.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254298",
    src: "4129046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d4",
    dest: "4129050",
    weight: 324
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254296",
    src: "4129042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d3",
    dest: "4129046",
    weight: 232.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825429d",
    src: "4158846",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d6",
    dest: "4166498",
    weight: 554.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542a1",
    src: "4092962",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d8",
    dest: "4092994",
    weight: 337.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542a5",
    src: "4092998",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72da",
    dest: "4166486",
    weight: 718.1
    },
    {
    _id: "5fc15f453b1b763994eb7391",
    dest: "4164066",
    weight: 364.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542a3",
    src: "4092994",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72d9",
    dest: "4092998",
    weight: 271
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542a8",
    src: "4166486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72db",
    dest: "4166490",
    weight: 487.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ac",
    src: "4166494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72dd",
    dest: "4188898",
    weight: 1146.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542b6",
    src: "4092330",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e2",
    dest: "4092338",
    weight: 458
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542b0",
    src: "4092318",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72df",
    dest: "4092322",
    weight: 334.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542b4",
    src: "4092326",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e1",
    dest: "4092330",
    weight: 296.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ae",
    src: "4188898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72de",
    dest: "4092318",
    weight: 200.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542b2",
    src: "4092322",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e0",
    dest: "4092326",
    weight: 202.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542aa",
    src: "4166490",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72dc",
    dest: "4166494",
    weight: 633.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542b8",
    src: "4092338",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e3",
    dest: "4092342",
    weight: 249.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ba",
    src: "4092342",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e4",
    dest: "4092346",
    weight: 218.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542bc",
    src: "4092346",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e5",
    dest: "4092350",
    weight: 216.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542be",
    src: "4092350",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e6",
    dest: "4091398",
    weight: 497.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542c0",
    src: "4091398",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e7",
    dest: "4091402",
    weight: 283.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542c8",
    src: "4092474",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72eb",
    dest: "4092478",
    weight: 157.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542c2",
    src: "4091402",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e8",
    dest: "4091406",
    weight: 318.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542c4",
    src: "4091406",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72e9",
    dest: "4092470",
    weight: 228.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ca",
    src: "4092478",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ec",
    dest: "4092482",
    weight: 338.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542c6",
    src: "4092470",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ea",
    dest: "4092474",
    weight: 247.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542cc",
    src: "4092482",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ed",
    dest: "4092486",
    weight: 245
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ce",
    src: "4092486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ee",
    dest: "4092494",
    weight: 294.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542d0",
    src: "4092494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ef",
    dest: "4092498",
    weight: 149.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542d4",
    src: "4092502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72f1",
    dest: "4175882",
    weight: 497.5
    },
    {
    _id: "5fc15f453b1b763994eb7753",
    dest: "4220754",
    weight: 350
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542d2",
    src: "4092498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72f0",
    dest: "4092502",
    weight: 388.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542da",
    src: "4092522",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72f6",
    dest: "4092526",
    weight: 242.8
    },
    {
    _id: "5fc15f453b1b763994eb7758",
    dest: "4191448",
    weight: 671.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542d7",
    src: "4175882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72f2",
    dest: "4191542",
    weight: 298.9
    },
    {
    _id: "5fc15f453b1b763994eb772c",
    dest: "4251520",
    weight: 220.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542dd",
    src: "4092526",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72f7",
    dest: "4191448",
    weight: 425.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542e1",
    src: "4091010",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ff",
    dest: "4091014",
    weight: 207.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542e7",
    src: "4091022",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7302",
    dest: "4090902",
    weight: 442.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542e5",
    src: "4091018",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7301",
    dest: "4091022",
    weight: 415.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542df",
    src: "4091006",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72fe",
    dest: "4091010",
    weight: 305.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542e3",
    src: "4091014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7300",
    dest: "4091018",
    weight: 186.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542e9",
    src: "4090902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7303",
    dest: "4090906",
    weight: 461.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ed",
    src: "4090910",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7305",
    dest: "4090914",
    weight: 164.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542eb",
    src: "4090906",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7304",
    dest: "4090910",
    weight: 360.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ef",
    src: "4090914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7306",
    dest: "4090918",
    weight: 252.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542f1",
    src: "4090918",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7307",
    dest: "4090926",
    weight: 439.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542f3",
    src: "4090926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7308",
    dest: "4091026",
    weight: 371.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542f5",
    src: "4091026",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7309",
    dest: "4091030",
    weight: 853.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542fb",
    src: "4229614",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730c",
    dest: "4229618",
    weight: 592.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542f7",
    src: "4091030",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730a",
    dest: "4229610",
    weight: 610.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542f9",
    src: "4229610",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730b",
    dest: "4229614",
    weight: 323.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542fd",
    src: "4229618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730d",
    dest: "4229622",
    weight: 614.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082542ff",
    src: "4229622",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730e",
    dest: "4090842",
    weight: 406.4
    },
    {
    _id: "5fc15f453b1b763994eb77c7",
    dest: "4220644",
    weight: 411.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254304",
    src: "4090846",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7310",
    dest: "4090850",
    weight: 180.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254302",
    src: "4090842",
    edges: [
    {
    _id: "5fc15f453b1b763994eb730f",
    dest: "4090846",
    weight: 314.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254306",
    src: "4090850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7311",
    dest: "4090854",
    weight: 286.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825430e",
    src: "4090866",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7315",
    dest: "4090870",
    weight: 388.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254310",
    src: "4090870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7316",
    dest: "4090874",
    weight: 634.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825430a",
    src: "4090858",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7313",
    dest: "4090862",
    weight: 397.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825430c",
    src: "4090862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7314",
    dest: "4090866",
    weight: 313.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254308",
    src: "4090854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7312",
    dest: "4090858",
    weight: 170.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254314",
    src: "4090878",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7318",
    dest: "4090882",
    weight: 238.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254312",
    src: "4090874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7317",
    dest: "4090878",
    weight: 573.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254316",
    src: "4090882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7319",
    dest: "4091034",
    weight: 398.1
    },
    {
    _id: "5fc15f453b1b763994eb77bc",
    dest: "4220646",
    weight: 325.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254319",
    src: "4091034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731a",
    dest: "4091042",
    weight: 318.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825431b",
    src: "4091042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731b",
    dest: "4160146",
    weight: 572.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825431d",
    src: "4160146",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731c",
    dest: "4091050",
    weight: 599.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825431f",
    src: "4091050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731d",
    dest: "4091054",
    weight: 349.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254323",
    src: "4091058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731f",
    dest: "4091062",
    weight: 359.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254325",
    src: "4091062",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7320",
    dest: "4091066",
    weight: 215.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254331",
    src: "4091086",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7326",
    dest: "4091090",
    weight: 409.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254329",
    src: "4091070",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7322",
    dest: "4091074",
    weight: 371.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825432b",
    src: "4091074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7323",
    dest: "4091078",
    weight: 319
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825432d",
    src: "4091078",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7324",
    dest: "4091082",
    weight: 295.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254327",
    src: "4091066",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7321",
    dest: "4091070",
    weight: 442.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254335",
    src: "4091094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7328",
    dest: "4091098",
    weight: 239.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825432f",
    src: "4091082",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7325",
    dest: "4091086",
    weight: 434.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254333",
    src: "4091090",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7327",
    dest: "4091094",
    weight: 249.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254337",
    src: "4091098",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7329",
    dest: "4091102",
    weight: 578.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254321",
    src: "4091054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb731e",
    dest: "4091058",
    weight: 327.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254339",
    src: "4091102",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732a",
    dest: "4091106",
    weight: 250.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825433b",
    src: "4091106",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732b",
    dest: "4091110",
    weight: 363.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825433d",
    src: "4091110",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732c",
    dest: "4091114",
    weight: 228.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825433f",
    src: "4091114",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732d",
    dest: "4091118",
    weight: 550.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254341",
    src: "4091118",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732e",
    dest: "4091126",
    weight: 174.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254343",
    src: "4091126",
    edges: [
    {
    _id: "5fc15f453b1b763994eb732f",
    dest: "4091678",
    weight: 451
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254347",
    src: "4091482",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7339",
    dest: "4091490",
    weight: 745.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825434b",
    src: "4091494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733b",
    dest: "4091498",
    weight: 411.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254345",
    src: "4229572",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7338",
    dest: "4091482",
    weight: 146.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254349",
    src: "4091490",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733a",
    dest: "4091494",
    weight: 171.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825434d",
    src: "4091498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733c",
    dest: "4090754",
    weight: 246.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825434f",
    src: "4090754",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733d",
    dest: "4090758",
    weight: 580.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254353",
    src: "4090762",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733f",
    dest: "4229580",
    weight: 295.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254351",
    src: "4090758",
    edges: [
    {
    _id: "5fc15f453b1b763994eb733e",
    dest: "4090762",
    weight: 163.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254355",
    src: "4229580",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7340",
    dest: "4090774",
    weight: 383.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254359",
    src: "4090778",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7342",
    dest: "4090782",
    weight: 279.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825435b",
    src: "4090782",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7343",
    dest: "4090786",
    weight: 362.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825435d",
    src: "4090786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7344",
    dest: "4229586",
    weight: 252.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825435f",
    src: "4229586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7345",
    dest: "4229590",
    weight: 472.9
    },
    {
    _id: "5fc15f453b1b763994eb79a8",
    dest: "4235304",
    weight: 3579.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254357",
    src: "4090774",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7341",
    dest: "4090778",
    weight: 450.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254362",
    src: "4229590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7346",
    dest: "4229594",
    weight: 371.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254364",
    src: "4229594",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7347",
    dest: "4090802",
    weight: 276.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825436a",
    src: "4229598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734a",
    dest: "4229602",
    weight: 512.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254368",
    src: "4090806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7349",
    dest: "4229598",
    weight: 279
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254366",
    src: "4090802",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7348",
    dest: "4090806",
    weight: 321.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825436c",
    src: "4229602",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734b",
    dest: "4090818",
    weight: 733
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825436e",
    src: "4090818",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734c",
    dest: "4229606",
    weight: 255.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254374",
    src: "4090890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734f",
    dest: "4229628",
    weight: 790.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254372",
    src: "4090886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734e",
    dest: "4090890",
    weight: 477.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254370",
    src: "4229606",
    edges: [
    {
    _id: "5fc15f453b1b763994eb734d",
    dest: "4090886",
    weight: 311.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254376",
    src: "4229628",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7350",
    dest: "4090930",
    weight: 371.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254378",
    src: "4090930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7351",
    dest: "4090938",
    weight: 532.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825437a",
    src: "4090938",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7352",
    dest: "4090942",
    weight: 262.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825437c",
    src: "4090942",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7353",
    dest: "4090946",
    weight: 398.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825437e",
    src: "4090946",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7354",
    dest: "4090950",
    weight: 351.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254382",
    src: "4090962",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7356",
    dest: "4090966",
    weight: 278.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254380",
    src: "4090950",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7355",
    dest: "4090962",
    weight: 619.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254388",
    src: "4164054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7364",
    dest: "4164058",
    weight: 258.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254386",
    src: "4090970",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7358",
    dest: "4090978",
    weight: 645.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254384",
    src: "4090966",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7357",
    dest: "4090970",
    weight: 448.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825438a",
    src: "4164058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7365",
    dest: "4092802",
    weight: 186.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825438c",
    src: "4092822",
    edges: [
    {
    _id: "5fc15f453b1b763994eb736b",
    dest: "4092830",
    weight: 233.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825438e",
    src: "4092830",
    edges: [
    {
    _id: "5fc15f453b1b763994eb736c",
    dest: "4092834",
    weight: 179.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254390",
    src: "4092834",
    edges: [
    {
    _id: "5fc15f453b1b763994eb736d",
    dest: "4092838",
    weight: 168.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825439a",
    src: "4092854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7372",
    dest: "4092858",
    weight: 425.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254394",
    src: "4092842",
    edges: [
    {
    _id: "5fc15f453b1b763994eb736f",
    dest: "4092846",
    weight: 219.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254396",
    src: "4092846",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7370",
    dest: "4092850",
    weight: 622.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825439c",
    src: "4092858",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7373",
    dest: "4092862",
    weight: 190.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254392",
    src: "4092838",
    edges: [
    {
    _id: "5fc15f453b1b763994eb736e",
    dest: "4092842",
    weight: 489.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254398",
    src: "4092850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7371",
    dest: "4092854",
    weight: 260.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825439e",
    src: "4092862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7374",
    dest: "4092870",
    weight: 256
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543a0",
    src: "4092870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7375",
    dest: "4092874",
    weight: 209.2
    },
    {
    _id: "5fc15f453b1b763994eb76d2",
    dest: "4220736",
    weight: 101.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543a3",
    src: "4092874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7376",
    dest: "4092878",
    weight: 200.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543a5",
    src: "4092878",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7377",
    dest: "4091854",
    weight: 378.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543a9",
    src: "4092882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7379",
    dest: "4092886",
    weight: 291.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ad",
    src: "4092890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737b",
    dest: "4092894",
    weight: 208.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543a7",
    src: "4091854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7378",
    dest: "4092882",
    weight: 351.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543af",
    src: "4092894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737c",
    dest: "4092898",
    weight: 598.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ab",
    src: "4092886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737a",
    dest: "4092890",
    weight: 369.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543b1",
    src: "4092898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737d",
    dest: "4092902",
    weight: 202.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543b3",
    src: "4092902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737e",
    dest: "4092910",
    weight: 289.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543b5",
    src: "4092910",
    edges: [
    {
    _id: "5fc15f453b1b763994eb737f",
    dest: "4092914",
    weight: 382
    },
    {
    _id: "5fc15f453b1b763994eb7771",
    dest: "4220626",
    weight: 304.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543b8",
    src: "4092914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7380",
    dest: "4092918",
    weight: 460.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ba",
    src: "4092918",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7381",
    dest: "4092922",
    weight: 686.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543bc",
    src: "4092922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7382",
    dest: "4092926",
    weight: 276.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543be",
    src: "4092926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7383",
    dest: "4164062",
    weight: 205
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543c2",
    src: "4092966",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7388",
    dest: "4092970",
    weight: 277.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543c4",
    src: "4092970",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7389",
    dest: "4092974",
    weight: 212.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543c6",
    src: "4092974",
    edges: [
    {
    _id: "5fc15f453b1b763994eb738a",
    dest: "4092978",
    weight: 355.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543c0",
    src: "4164062",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7384",
    dest: "4129042",
    weight: 310.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543cc",
    src: "4092986",
    edges: [
    {
    _id: "5fc15f453b1b763994eb738d",
    dest: "4091802",
    weight: 230.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543c8",
    src: "4092978",
    edges: [
    {
    _id: "5fc15f453b1b763994eb738b",
    dest: "4092982",
    weight: 174.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ca",
    src: "4092982",
    edges: [
    {
    _id: "5fc15f453b1b763994eb738c",
    dest: "4092986",
    weight: 910
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ce",
    src: "4091802",
    edges: [
    {
    _id: "5fc15f453b1b763994eb738e",
    dest: "4092962",
    weight: 341.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543d0",
    src: "4164066",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7392",
    dest: "4093010",
    weight: 515.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543d4",
    src: "4093014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7394",
    dest: "4093018",
    weight: 409.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543d2",
    src: "4093010",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7393",
    dest: "4093014",
    weight: 692.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543da",
    src: "4093030",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7397",
    dest: "4093034",
    weight: 572.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543d8",
    src: "4093022",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7396",
    dest: "4093030",
    weight: 528.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543d6",
    src: "4093018",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7395",
    dest: "4093022",
    weight: 358.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543dc",
    src: "4093034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7398",
    dest: "4093038",
    weight: 297.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543de",
    src: "4093038",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7399",
    dest: "4093042",
    weight: 304.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543e0",
    src: "4093042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739a",
    dest: "4093046",
    weight: 231.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543e2",
    src: "4093046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739b",
    dest: "4093050",
    weight: 359.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543e4",
    src: "4093050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739c",
    dest: "4093054",
    weight: 344.1
    },
    {
    _id: "5fc15f453b1b763994eb7796",
    dest: "4220620",
    weight: 720
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543e7",
    src: "4093054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739d",
    dest: "4093058",
    weight: 228.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543e9",
    src: "4093058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739e",
    dest: "4093062",
    weight: 249.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ed",
    src: "4093066",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a0",
    dest: "4093074",
    weight: 167.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543eb",
    src: "4093062",
    edges: [
    {
    _id: "5fc15f453b1b763994eb739f",
    dest: "4093066",
    weight: 261.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543ef",
    src: "4093074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a1",
    dest: "4093078",
    weight: 435.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543f3",
    src: "4093082",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a3",
    dest: "4092386",
    weight: 732.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543f9",
    src: "4092362",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a6",
    dest: "4092366",
    weight: 284.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254400",
    src: "4093130",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73b1",
    dest: "4129270",
    weight: 663.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254405",
    src: "4186626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73b3",
    dest: "4091826",
    weight: 390.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543f1",
    src: "4093078",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a2",
    dest: "4093082",
    weight: 214.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543f7",
    src: "4092358",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a5",
    dest: "4092362",
    weight: 248.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254402",
    src: "4129270",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73b2",
    dest: "4186626",
    weight: 396.1
    },
    {
    _id: "5fc15f453b1b763994eb78e2",
    dest: "4093886",
    weight: 910.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254407",
    src: "4093006",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73b5",
    dest: "4093138",
    weight: 9854.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543fd",
    src: "4093126",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73b0",
    dest: "4093130",
    weight: 132.9
    },
    {
    _id: "5fc15f453b1b763994eb770d",
    dest: "4191470",
    weight: 102
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543fb",
    src: "4092366",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a7",
    dest: "4093086",
    weight: 381.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082543f5",
    src: "4092386",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73a4",
    dest: "4092358",
    weight: 391.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254409",
    src: "4093306",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c3",
    dest: "4093310",
    weight: 344.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825440b",
    src: "4093310",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c4",
    dest: "4093314",
    weight: 243.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254411",
    src: "4093142",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c7",
    dest: "4093146",
    weight: 136.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254417",
    src: "4092538",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e2",
    dest: "4092542",
    weight: 1213.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825440d",
    src: "4093314",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c5",
    dest: "4093318",
    weight: 192.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254413",
    src: "4093146",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c8",
    dest: "4093150",
    weight: 189.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825441b",
    src: "4092546",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e4",
    dest: "4092550",
    weight: 186.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825440f",
    src: "4093318",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73c6",
    dest: "4093142",
    weight: 329.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254419",
    src: "4092542",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e3",
    dest: "4092546",
    weight: 390
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254415",
    src: "4220760",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e1",
    dest: "4092538",
    weight: 136.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825441d",
    src: "4092550",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e5",
    dest: "4092554",
    weight: 282.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825441f",
    src: "4092554",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e6",
    dest: "4191584",
    weight: 350.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254426",
    src: "4092570",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e9",
    dest: "4092574",
    weight: 336.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825442e",
    src: "4191592",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ed",
    dest: "4189686",
    weight: 213.5
    },
    {
    _id: "5fc15f453b1b763994eb759d",
    dest: "4090922",
    weight: 352
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254421",
    src: "4191584",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e7",
    dest: "4092566",
    weight: 220.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254423",
    src: "4092566",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73e8",
    dest: "4092570",
    weight: 229.7
    },
    {
    _id: "5fc15f453b1b763994eb7515",
    dest: "4175870",
    weight: 320.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825442a",
    src: "4092578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73eb",
    dest: "4092586",
    weight: 385.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254431",
    src: "4189686",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ee",
    dest: "4090922",
    weight: 525
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825442c",
    src: "4092586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ec",
    dest: "4191592",
    weight: 336.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254428",
    src: "4092574",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ea",
    dest: "4092578",
    weight: 341.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254433",
    src: "4090922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ef",
    dest: "4092590",
    weight: 162.5
    },
    {
    _id: "5fc15f453b1b763994eb759e",
    dest: "4091390",
    weight: 653.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254436",
    src: "4092590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f0",
    dest: "4092594",
    weight: 254.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254438",
    src: "4092594",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f1",
    dest: "4092598",
    weight: 233.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825443e",
    src: "4092614",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f4",
    dest: "4092618",
    weight: 324.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254446",
    src: "4092630",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f8",
    dest: "4092634",
    weight: 247.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254442",
    src: "4092622",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f6",
    dest: "4092626",
    weight: 191.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254440",
    src: "4092618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f5",
    dest: "4092622",
    weight: 232.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254444",
    src: "4092626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f7",
    dest: "4092630",
    weight: 267.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825443c",
    src: "4092610",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f3",
    dest: "4092614",
    weight: 275.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825443a",
    src: "4092598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f2",
    dest: "4092610",
    weight: 657.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254448",
    src: "4092634",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73f9",
    dest: "4092638",
    weight: 217.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825444a",
    src: "4092638",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73fa",
    dest: "4092642",
    weight: 229.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825444c",
    src: "4092642",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73fb",
    dest: "4092650",
    weight: 569.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825444e",
    src: "4092650",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73fc",
    dest: "4092654",
    weight: 468.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254450",
    src: "4092654",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73fd",
    dest: "4092658",
    weight: 409.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825445a",
    src: "4092690",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7404",
    dest: "4092694",
    weight: 221.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254452",
    src: "4092658",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73fe",
    dest: "4092662",
    weight: 223.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254456",
    src: "4092678",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7402",
    dest: "4092686",
    weight: 452.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254458",
    src: "4092686",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7403",
    dest: "4092690",
    weight: 599.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254454",
    src: "4092662",
    edges: [
    {
    _id: "5fc15f453b1b763994eb73ff",
    dest: "4092666",
    weight: 154.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825445c",
    src: "4092694",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7405",
    dest: "4092698",
    weight: 205.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254460",
    src: "4092702",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7407",
    dest: "4092706",
    weight: 293.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825445e",
    src: "4092698",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7406",
    dest: "4092702",
    weight: 226.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254464",
    src: "4092714",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7409",
    dest: "4092718",
    weight: 258.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254466",
    src: "4092718",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740a",
    dest: "4220762",
    weight: 244.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254468",
    src: "4220762",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740b",
    dest: "4092734",
    weight: 539.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254462",
    src: "4092706",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7408",
    dest: "4092714",
    weight: 523.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825446a",
    src: "4092734",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740c",
    dest: "4092738",
    weight: 354.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825446c",
    src: "4092738",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740d",
    dest: "4092742",
    weight: 260.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825446e",
    src: "4092742",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740e",
    dest: "4090662",
    weight: 154.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254470",
    src: "4090662",
    edges: [
    {
    _id: "5fc15f453b1b763994eb740f",
    dest: "4090706",
    weight: 347.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254472",
    src: "4090706",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7410",
    dest: "4090746",
    weight: 218.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254474",
    src: "4090746",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7411",
    dest: "4092746",
    weight: 177.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254476",
    src: "4092746",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7412",
    dest: "4092750",
    weight: 313.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825447b",
    src: "4092754",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7414",
    dest: "4092758",
    weight: 267.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825447d",
    src: "4092758",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7415",
    dest: "4092766",
    weight: 315.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254478",
    src: "4092750",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7413",
    dest: "4092754",
    weight: 392.3
    },
    {
    _id: "5fc15f453b1b763994eb7581",
    dest: "4136894",
    weight: 608.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825447f",
    src: "4092766",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7416",
    dest: "4091038",
    weight: 236.3
    },
    {
    _id: "5fc15f453b1b763994eb7520",
    dest: "4191586",
    weight: 390
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254484",
    src: "4091122",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7418",
    dest: "4091178",
    weight: 377.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254482",
    src: "4091038",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7417",
    dest: "4091122",
    weight: 265.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254486",
    src: "4091178",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7419",
    dest: "4091218",
    weight: 144.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254488",
    src: "4091218",
    edges: [
    {
    _id: "5fc15f453b1b763994eb741a",
    dest: "4220764",
    weight: 115.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825448a",
    src: "4220764",
    edges: [
    {
    _id: "5fc15f453b1b763994eb741b",
    dest: "4092774",
    weight: 964.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825448c",
    src: "4092774",
    edges: [
    {
    _id: "5fc15f453b1b763994eb741c",
    dest: "4220766",
    weight: 159.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254492",
    src: "4191558",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7504",
    dest: "4191560",
    weight: 611.2
    },
    {
    _id: "5fc15f453b1b763994eb7575",
    dest: "4191570",
    weight: 546.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825448e",
    src: "4220766",
    edges: [
    {
    _id: "5fc15f453b1b763994eb741d",
    dest: "4191448",
    weight: 605.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254490",
    src: "4191556",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7503",
    dest: "4191558",
    weight: 184.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254495",
    src: "4191560",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7505",
    dest: "4191562",
    weight: 904.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254497",
    src: "4191562",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7506",
    dest: "4191564",
    weight: 510
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254499",
    src: "4191564",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7507",
    dest: "4191566",
    weight: 512.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825449b",
    src: "4191566",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7508",
    dest: "4191568",
    weight: 927.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825449d",
    src: "4191568",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7509",
    dest: "4191570",
    weight: 576.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825449f",
    src: "4191570",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750a",
    dest: "4191572",
    weight: 582.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544a1",
    src: "4191572",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750b",
    dest: "4191574",
    weight: 178
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544a3",
    src: "4191574",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750c",
    dest: "4191576",
    weight: 261.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544a7",
    src: "4191578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750e",
    dest: "4191580",
    weight: 192
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544a5",
    src: "4191576",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750d",
    dest: "4191578",
    weight: 309
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544a9",
    src: "4191580",
    edges: [
    {
    _id: "5fc15f453b1b763994eb750f",
    dest: "4191582",
    weight: 299.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544ab",
    src: "4191582",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7510",
    dest: "4175864",
    weight: 642.7
    },
    {
    _id: "5fc15f453b1b763994eb757c",
    dest: "4090662",
    weight: 635
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544ae",
    src: "4175864",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7511",
    dest: "4090954",
    weight: 232.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544b0",
    src: "4090954",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7512",
    dest: "4175866",
    weight: 342.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544b2",
    src: "4175866",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7513",
    dest: "4090998",
    weight: 392.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544b4",
    src: "4090998",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7514",
    dest: "4092566",
    weight: 339.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544b6",
    src: "4175870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7516",
    dest: "4175850",
    weight: 258.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544bc",
    src: "4091530",
    edges: [
    {
    _id: "5fc15f453b1b763994eb751c",
    dest: "4175872",
    weight: 390.1
    },
    {
    _id: "5fc15f453b1b763994eb7646",
    dest: "4094786",
    weight: 737.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544b8",
    src: "4175850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7517",
    dest: "4175874",
    weight: 243.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544ba",
    src: "4175874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7518",
    dest: "4093558",
    weight: 269.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544bf",
    src: "4175872",
    edges: [
    {
    _id: "5fc15f453b1b763994eb751d",
    dest: "4175852",
    weight: 294.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544c1",
    src: "4175852",
    edges: [
    {
    _id: "5fc15f453b1b763994eb751e",
    dest: "4175868",
    weight: 271.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544c3",
    src: "4175868",
    edges: [
    {
    _id: "5fc15f453b1b763994eb751f",
    dest: "4092766",
    weight: 324
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544c5",
    src: "4191586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7521",
    dest: "4191588",
    weight: 186.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544d2",
    src: "4091486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7527",
    dest: "4091558",
    weight: 331.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544d8",
    src: "4091614",
    edges: [
    {
    _id: "5fc15f453b1b763994eb752a",
    dest: "4091698",
    weight: 526.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544da",
    src: "4091698",
    edges: [
    {
    _id: "5fc15f453b1b763994eb752b",
    dest: "4091786",
    weight: 842.5
    },
    {
    _id: "5fc15f453b1b763994eb75a6",
    dest: "4091742",
    weight: 232.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544d0",
    src: "4115830",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7526",
    dest: "4091486",
    weight: 295.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544d4",
    src: "4091558",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7528",
    dest: "4091582",
    weight: 212.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544c7",
    src: "4191588",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7522",
    dest: "4191590",
    weight: 421.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544cd",
    src: "4091390",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7525",
    dest: "4115830",
    weight: 432.4
    },
    {
    _id: "5fc15f453b1b763994eb759f",
    dest: "4091458",
    weight: 261.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544d6",
    src: "4091582",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7529",
    dest: "4091614",
    weight: 525.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544cb",
    src: "4090618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7524",
    dest: "4091390",
    weight: 757.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544c9",
    src: "4191590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7523",
    dest: "4090618",
    weight: 174.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544e1",
    src: "4136938",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7543",
    dest: "4092034",
    weight: 468.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544eb",
    src: "4092070",
    edges: [
    {
    _id: "5fc15f453b1b763994eb754c",
    dest: "4092074",
    weight: 842.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544e7",
    src: "4092058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb754a",
    dest: "4092062",
    weight: 260
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544dd",
    src: "4136946",
    edges: [
    {
    _id: "5fc15f453b1b763994eb753d",
    dest: "4094850",
    weight: 358.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544e5",
    src: "4092054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7549",
    dest: "4092058",
    weight: 292.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544df",
    src: "4136942",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7542",
    dest: "4136938",
    weight: 315.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544e3",
    src: "4092050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7548",
    dest: "4092054",
    weight: 237.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544e9",
    src: "4092062",
    edges: [
    {
    _id: "5fc15f453b1b763994eb754b",
    dest: "4092070",
    weight: 604.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544ed",
    src: "4092094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7552",
    dest: "4092098",
    weight: 436.5
    },
    {
    _id: "5fc15f453b1b763994eb77d1",
    dest: "4220634",
    weight: 784.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544f0",
    src: "4092098",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7553",
    dest: "4092102",
    weight: 315.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544f2",
    src: "4092102",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7554",
    dest: "4092110",
    weight: 416.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544f8",
    src: "4092118",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7557",
    dest: "4092122",
    weight: 266.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544f6",
    src: "4092114",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7556",
    dest: "4092118",
    weight: 417
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544f4",
    src: "4092110",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7555",
    dest: "4092114",
    weight: 128.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544fe",
    src: "4092162",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7562",
    dest: "4092166",
    weight: 690
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544fc",
    src: "4092142",
    edges: [
    {
    _id: "5fc15f453b1b763994eb755d",
    dest: "4092146",
    weight: 359.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254504",
    src: "4136910",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7584",
    dest: "4093726",
    weight: 241.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254500",
    src: "4136894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7582",
    dest: "4136902",
    weight: 228
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254502",
    src: "4136902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7583",
    dest: "4136910",
    weight: 348.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082544fa",
    src: "4092138",
    edges: [
    {
    _id: "5fc15f453b1b763994eb755c",
    dest: "4092142",
    weight: 287.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254506",
    src: "4094750",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7587",
    dest: "4094754",
    weight: 232.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825450d",
    src: "4094770",
    edges: [
    {
    _id: "5fc15f453b1b763994eb758a",
    dest: "4129306",
    weight: 542.2
    },
    {
    _id: "5fc15f453b1b763994eb75e0",
    dest: "4094774",
    weight: 273.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254508",
    src: "4094754",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7588",
    dest: "4094766",
    weight: 428.5
    },
    {
    _id: "5fc15f453b1b763994eb7627",
    dest: "4175876",
    weight: 210.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825450b",
    src: "4094766",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7589",
    dest: "4094770",
    weight: 352.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254510",
    src: "4129306",
    edges: [
    {
    _id: "5fc15f453b1b763994eb758b",
    dest: "4094230",
    weight: 361.5
    },
    {
    _id: "5fc15f453b1b763994eb7748",
    dest: "4094014",
    weight: 305
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254517",
    src: "4129310",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7590",
    dest: "4094626",
    weight: 561.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254515",
    src: "4177466",
    edges: [
    {
    _id: "5fc15f453b1b763994eb758f",
    dest: "4129310",
    weight: 726.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825451b",
    src: "4094630",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7592",
    dest: "4094634",
    weight: 468.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254519",
    src: "4094626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7591",
    dest: "4094630",
    weight: 292.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254513",
    src: "4136918",
    edges: [
    {
    _id: "5fc15f453b1b763994eb758e",
    dest: "4177466",
    weight: 260.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825451d",
    src: "4094634",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7593",
    dest: "4094638",
    weight: 178.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254526",
    src: "4136898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7599",
    dest: "4092574",
    weight: 263.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254524",
    src: "4136906",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7598",
    dest: "4136898",
    weight: 228.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254522",
    src: "4136914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7597",
    dest: "4136906",
    weight: 330.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825451f",
    src: "4094638",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7594",
    dest: "4091434",
    weight: 767.8
    },
    {
    _id: "5fc15f453b1b763994eb75bb",
    dest: "4094646",
    weight: 275.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254528",
    src: "4091458",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75a0",
    dest: "4115830",
    weight: 170.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825452a",
    src: "4091742",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75a7",
    dest: "4091786",
    weight: 610
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825452c",
    src: "4094578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ad",
    dest: "4094582",
    weight: 485.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254530",
    src: "4094586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75af",
    dest: "4094590",
    weight: 304.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825452e",
    src: "4094582",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ae",
    dest: "4094586",
    weight: 377
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254532",
    src: "4094590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75b0",
    dest: "4094594",
    weight: 413.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254534",
    src: "4094618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75b6",
    dest: "4094622",
    weight: 391
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254536",
    src: "4094622",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75b7",
    dest: "4094626",
    weight: 294.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825453c",
    src: "4094666",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75c0",
    dest: "4094046",
    weight: 347.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254538",
    src: "4094654",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75be",
    dest: "4094658",
    weight: 432
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825453a",
    src: "4094658",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75bf",
    dest: "4094666",
    weight: 482.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825453e",
    src: "4094670",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75c6",
    dest: "4220662",
    weight: 359.2
    },
    {
    _id: "5fc15f453b1b763994eb762f",
    dest: "4178026",
    weight: 907.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254541",
    src: "4220662",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75c7",
    dest: "4220664",
    weight: 721
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254545",
    src: "4220772",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75c9",
    dest: "4094686",
    weight: 570.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254543",
    src: "4220664",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75c8",
    dest: "4220772",
    weight: 3161.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254547",
    src: "4094686",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ca",
    dest: "4094690",
    weight: 306.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254549",
    src: "4094690",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75cb",
    dest: "4094702",
    weight: 1316.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825454b",
    src: "4094702",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75cc",
    dest: "4094706",
    weight: 1009.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254551",
    src: "4094714",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75cf",
    dest: "4115386",
    weight: 3116.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825454d",
    src: "4094706",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75cd",
    dest: "4129318",
    weight: 1033.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825454f",
    src: "4129318",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ce",
    dest: "4094714",
    weight: 588
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254559",
    src: "4094730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75d9",
    dest: "4094738",
    weight: 504.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254557",
    src: "4094726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75d2",
    dest: "4094170",
    weight: 225.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254553",
    src: "4115386",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75d0",
    dest: "4094722",
    weight: 747.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254555",
    src: "4094722",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75d1",
    dest: "4094726",
    weight: 166.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825455b",
    src: "4094738",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75da",
    dest: "4094742",
    weight: 369.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825455d",
    src: "4094774",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75e1",
    dest: "4094778",
    weight: 377
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825455f",
    src: "4094778",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75e2",
    dest: "4175886",
    weight: 584.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254563",
    src: "4094802",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ea",
    dest: "4094806",
    weight: 363
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254565",
    src: "4094806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75eb",
    dest: "4094818",
    weight: 499.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254561",
    src: "4175886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75e3",
    dest: "4093550",
    weight: 119
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825456b",
    src: "4220606",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ef",
    dest: "4094498",
    weight: 570
    },
    {
    _id: "5fc15f453b1b763994eb792f",
    dest: "4094434",
    weight: 487
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254567",
    src: "4094818",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ec",
    dest: "4191448",
    weight: 378.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254569",
    src: "4220604",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75ee",
    dest: "4220606",
    weight: 176.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825456e",
    src: "4220676",
    edges: [
    {
    _id: "5fc15f453b1b763994eb75f8",
    dest: "4091770",
    weight: 200.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254570",
    src: "4220674",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7610",
    dest: "4094874",
    weight: 659.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254572",
    src: "4220592",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7617",
    dest: "4220594",
    weight: 242.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254574",
    src: "4220594",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7618",
    dest: "4220742",
    weight: 723.1
    },
    {
    _id: "5fc15f453b1b763994eb790e",
    dest: "4195936",
    weight: 1094.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254577",
    src: "4220742",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7619",
    dest: "4188890",
    weight: 433.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825457b",
    src: "4175876",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7628",
    dest: "4175860",
    weight: 245.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254579",
    src: "4175854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7622",
    dest: "4093726",
    weight: 322.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825457d",
    src: "4175860",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7629",
    dest: "4094046",
    weight: 437
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254581",
    src: "4129282",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7631",
    dest: "4091730",
    weight: 408.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825457f",
    src: "4178026",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7630",
    dest: "4129282",
    weight: 723.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254583",
    src: "4129278",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7634",
    dest: "4091746",
    weight: 2263.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254585",
    src: "4129034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7639",
    dest: "4177828",
    weight: 695.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825458a",
    src: "4175862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7641",
    dest: "4175878",
    weight: 190.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254587",
    src: "4177828",
    edges: [
    {
    _id: "5fc15f453b1b763994eb763a",
    dest: "4094170",
    weight: 914.8
    },
    {
    _id: "5fc15f453b1b763994eb775e",
    dest: "4094070",
    weight: 924.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825458e",
    src: "4171434",
    edges: [
    {
    _id: "5fc15f453b1b763994eb765e",
    dest: "4136890",
    weight: 2265.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825458c",
    src: "4175878",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7642",
    dest: "4094638",
    weight: 387.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254592",
    src: "4220736",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76a9",
    dest: "4093062",
    weight: 144.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254590",
    src: "4136890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb765f",
    dest: "4093946",
    weight: 11441.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254594",
    src: "4209534",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76b9",
    dest: "4091182",
    weight: 589.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254596",
    src: "4220678",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76dc",
    dest: "4220682",
    weight: 263.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254598",
    src: "4220682",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76dd",
    dest: "4220686",
    weight: 342.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825459a",
    src: "4220686",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76de",
    dest: "4220690",
    weight: 492.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545aa",
    src: "4220626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e6",
    dest: "4220624",
    weight: 392.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545a2",
    src: "4220702",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e2",
    dest: "4220728",
    weight: 564.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545a8",
    src: "4220708",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e5",
    dest: "4220626",
    weight: 452.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545a0",
    src: "4220698",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e1",
    dest: "4220702",
    weight: 464.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545a4",
    src: "4220728",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e3",
    dest: "4220706",
    weight: 258.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ac",
    src: "4220624",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e7",
    dest: "4220622",
    weight: 720.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ae",
    src: "4220622",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e8",
    dest: "4220712",
    weight: 441.8
    },
    {
    _id: "5fc15f453b1b763994eb7774",
    dest: "4095066",
    weight: 413.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825459e",
    src: "4220694",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e0",
    dest: "4220698",
    weight: 393.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545a6",
    src: "4220706",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e4",
    dest: "4220708",
    weight: 331.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825459c",
    src: "4220690",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76df",
    dest: "4220694",
    weight: 385.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545b1",
    src: "4220712",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76e9",
    dest: "4220716",
    weight: 374.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545bb",
    src: "4220734",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ee",
    dest: "4220732",
    weight: 387.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545b5",
    src: "4220720",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76eb",
    dest: "4220724",
    weight: 286.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545b9",
    src: "4220730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ed",
    dest: "4220734",
    weight: 386.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545b3",
    src: "4220716",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ea",
    dest: "4220720",
    weight: 327.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545bd",
    src: "4220732",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ef",
    dest: "4220726",
    weight: 281.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545b7",
    src: "4220724",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ec",
    dest: "4220730",
    weight: 321.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545c3",
    src: "4220718",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f2",
    dest: "4220714",
    weight: 403.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545bf",
    src: "4220726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f0",
    dest: "4220722",
    weight: 298.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545c1",
    src: "4220722",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f1",
    dest: "4220718",
    weight: 299.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545c5",
    src: "4220714",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f3",
    dest: "4220632",
    weight: 404
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ce",
    src: "4220710",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f7",
    dest: "4231810",
    weight: 387.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545c7",
    src: "4220632",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f4",
    dest: "4220630",
    weight: 889.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545c9",
    src: "4220630",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f5",
    dest: "4220628",
    weight: 305.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545d0",
    src: "4231810",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f8",
    dest: "4231812",
    weight: 340.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545cb",
    src: "4220628",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f6",
    dest: "4220710",
    weight: 363
    },
    {
    _id: "5fc15f453b1b763994eb778f",
    dest: "4093022",
    weight: 315.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545d4",
    src: "4220704",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76fa",
    dest: "4220700",
    weight: 426.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545d6",
    src: "4220700",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76fb",
    dest: "4220696",
    weight: 428.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545d8",
    src: "4220696",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76fc",
    dest: "4220692",
    weight: 335.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545d2",
    src: "4231812",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76f9",
    dest: "4220704",
    weight: 478.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545da",
    src: "4220692",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76fd",
    dest: "4220688",
    weight: 585.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545e4",
    src: "4220584",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7718",
    dest: "4220586",
    weight: 163.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545e2",
    src: "4223958",
    edges: [
    {
    _id: "5fc15f453b1b763994eb770b",
    dest: "4093122",
    weight: 297.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545de",
    src: "4220684",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76ff",
    dest: "4220680",
    weight: 312.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545e0",
    src: "4220680",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7700",
    dest: "4092146",
    weight: 706.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545dc",
    src: "4220688",
    edges: [
    {
    _id: "5fc15f453b1b763994eb76fe",
    dest: "4220684",
    weight: 259.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545e9",
    src: "4251514",
    edges: [
    {
    _id: "5fc15f453b1b763994eb771a",
    dest: "4196158",
    weight: 281.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545eb",
    src: "4251520",
    edges: [
    {
    _id: "5fc15f453b1b763994eb772d",
    dest: "4220752",
    weight: 273.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545e6",
    src: "4220586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7719",
    dest: "4251514",
    weight: 291.4
    },
    {
    _id: "5fc15f453b1b763994eb788d",
    dest: "4220770",
    weight: 107.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ed",
    src: "4220752",
    edges: [
    {
    _id: "5fc15f453b1b763994eb772e",
    dest: "4092238",
    weight: 258.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ef",
    src: "4220666",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7731",
    dest: "4093998",
    weight: 465.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545fb",
    src: "4220660",
    edges: [
    {
    _id: "5fc15f453b1b763994eb774c",
    dest: "4220740",
    weight: 382.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545f3",
    src: "4220738",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7736",
    dest: "4220588",
    weight: 528
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254601",
    src: "4220610",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7752",
    dest: "4092502",
    weight: 593.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545fd",
    src: "4220740",
    edges: [
    {
    _id: "5fc15f453b1b763994eb774d",
    dest: "4220668",
    weight: 296.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545f7",
    src: "4220670",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7738",
    dest: "4220672",
    weight: 463.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545f1",
    src: "4220608",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7735",
    dest: "4220738",
    weight: 397.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545ff",
    src: "4220668",
    edges: [
    {
    _id: "5fc15f453b1b763994eb774e",
    dest: "4094234",
    weight: 392.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545f9",
    src: "4220672",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7739",
    dest: "4094214",
    weight: 467.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd49082545f5",
    src: "4220588",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7737",
    dest: "4220670",
    weight: 243.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254603",
    src: "4220754",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7754",
    dest: "4175880",
    weight: 164.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254605",
    src: "4220618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7766",
    dest: "4220616",
    weight: 255.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825460d",
    src: "4220620",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7797",
    dest: "4094134",
    weight: 354.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254609",
    src: "4220614",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7768",
    dest: "4220612",
    weight: 265.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825460b",
    src: "4220612",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7769",
    dest: "4091854",
    weight: 802.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254607",
    src: "4220616",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7767",
    dest: "4220614",
    weight: 199.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254611",
    src: "4220640",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77ae",
    dest: "4092070",
    weight: 316.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254615",
    src: "4220646",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77bd",
    dest: "4220648",
    weight: 780.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254613",
    src: "4220642",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77b8",
    dest: "4090870",
    weight: 397.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825460f",
    src: "4220638",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77ad",
    dest: "4220640",
    weight: 453.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254617",
    src: "4220648",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77be",
    dest: "4229632",
    weight: 410.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254619",
    src: "4229632",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77bf",
    dest: "4220652",
    weight: 203.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825461b",
    src: "4220652",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77c0",
    dest: "4220654",
    weight: 281.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825461f",
    src: "4220656",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77c2",
    dest: "4220658",
    weight: 847.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825461d",
    src: "4220654",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77c1",
    dest: "4220656",
    weight: 855.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254621",
    src: "4220658",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77c3",
    dest: "4229610",
    weight: 221.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254625",
    src: "4220634",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77d2",
    dest: "4220636",
    weight: 466.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254629",
    src: "4220792",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77f1",
    dest: "4220788",
    weight: 513.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254627",
    src: "4220636",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77d3",
    dest: "4093390",
    weight: 1064.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254623",
    src: "4220644",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77c8",
    dest: "4094442",
    weight: 931
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825462b",
    src: "4220788",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77f2",
    dest: "4220784",
    weight: 334.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825462d",
    src: "4220784",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77f3",
    dest: "4220794",
    weight: 338.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825462f",
    src: "4220794",
    edges: [
    {
    _id: "5fc15f453b1b763994eb77f4",
    dest: "4090978",
    weight: 5969
    },
    {
    _id: "5fc15f453b1b763994eb79a1",
    dest: "4188890",
    weight: 12268.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254632",
    src: "4220590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7801",
    dest: "4094442",
    weight: 593.1
    },
    {
    _id: "5fc15f453b1b763994eb790b",
    dest: "4094494",
    weight: 747.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254635",
    src: "4220796",
    edges: [
    {
    _id: "5fc15f453b1b763994eb780d",
    dest: "4220782",
    weight: 377.3
    },
    {
    _id: "5fc15f453b1b763994eb79a3",
    dest: "4231806",
    weight: 560.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254638",
    src: "4220782",
    edges: [
    {
    _id: "5fc15f453b1b763994eb780e",
    dest: "4220786",
    weight: 384.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825463c",
    src: "4220790",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7810",
    dest: "4229498",
    weight: 966.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254640",
    src: "4195934",
    edges: [
    {
    _id: "5fc15f453b1b763994eb781e",
    dest: "4195930",
    weight: 547.4
    },
    {
    _id: "5fc15f453b1b763994eb792d",
    dest: "4220604",
    weight: 1044.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825463e",
    src: "4195928",
    edges: [
    {
    _id: "5fc15f453b1b763994eb781d",
    dest: "4195934",
    weight: 550.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825463a",
    src: "4220786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb780f",
    dest: "4220790",
    weight: 641.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254646",
    src: "4220744",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7820",
    dest: "4188886",
    weight: 466.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254643",
    src: "4195930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb781f",
    dest: "4220744",
    weight: 493.1
    },
    {
    _id: "5fc15f453b1b763994eb795f",
    dest: "4188890",
    weight: 634
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254648",
    src: "4196044",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7836",
    dest: "4196046",
    weight: 152.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825464a",
    src: "4196046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7837",
    dest: "4091658",
    weight: 389.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825464c",
    src: "4220746",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7840",
    dest: "4195932",
    weight: 494.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825464e",
    src: "4195932",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7841",
    dest: "4195936",
    weight: 554.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254650",
    src: "4195936",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7842",
    dest: "4094422",
    weight: 452.7
    },
    {
    _id: "5fc15f453b1b763994eb790f",
    dest: "4094518",
    weight: 573.9
    },
    {
    _id: "5fc15f453b1b763994eb7937",
    dest: "4158882",
    weight: 553.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254658",
    src: "4220580",
    edges: [
    {
    _id: "5fc15f453b1b763994eb78ac",
    dest: "4175858",
    weight: 514.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254656",
    src: "4220578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb78ab",
    dest: "4220580",
    weight: 401.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254654",
    src: "4220770",
    edges: [
    {
    _id: "5fc15f453b1b763994eb788e",
    dest: "4094562",
    weight: 550.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825465a",
    src: "4220582",
    edges: [
    {
    _id: "5fc15f453b1b763994eb78d0",
    dest: "4191448",
    weight: 6416.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825465c",
    src: "4231816",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7933",
    dest: "4236264",
    weight: 200.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825465e",
    src: "4236264",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7934",
    dest: "4231818",
    weight: 1305
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254662",
    src: "4158882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7938",
    dest: "4238112",
    weight: 429.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254660",
    src: "4231818",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7935",
    dest: "4195932",
    weight: 542.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254666",
    src: "4251500",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7947",
    dest: "4094826",
    weight: 214.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254664",
    src: "4238112",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7939",
    dest: "4091446",
    weight: 811.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825466a",
    src: "4158890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb795c",
    dest: "4195928",
    weight: 586.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254668",
    src: "4167902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb795b",
    dest: "4158890",
    weight: 361.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825467e",
    src: "4231808",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79a0",
    dest: "4220794",
    weight: 687.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254674",
    src: "4220598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7995",
    dest: "4220600",
    weight: 597.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254672",
    src: "4220596",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7994",
    dest: "4220598",
    weight: 325.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825467a",
    src: "4251504",
    edges: [
    {
    _id: "5fc15f453b1b763994eb799a",
    dest: "4251512",
    weight: 8337.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825467c",
    src: "4251512",
    edges: [
    {
    _id: "5fc15f453b1b763994eb799b",
    dest: "4093138",
    weight: 76008.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254676",
    src: "4220600",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7996",
    dest: "4220602",
    weight: 310.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825466e",
    src: "4191502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7968",
    dest: "4191504",
    weight: 355.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254670",
    src: "4191504",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7969",
    dest: "4094942",
    weight: 284
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254678",
    src: "4251502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7999",
    dest: "4251504",
    weight: 38812.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825466c",
    src: "4220602",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7960",
    dest: "4095010",
    weight: 492
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254680",
    src: "4231806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79a4",
    dest: "4093418",
    weight: 1774.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254682",
    src: "4235304",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79a9",
    dest: "4238114",
    weight: 13526
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254684",
    src: "4238114",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79aa",
    dest: "4093250",
    weight: 903.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254688",
    src: "4251506",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79cb",
    dest: "4251508",
    weight: 12257.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd4908254686",
    src: "4251518",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79b9",
    dest: "4195936",
    weight: 647
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825468c",
    src: "4251510",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79cd",
    dest: "4093138",
    weight: 48982.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825468e",
    src: "4251516",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79ce",
    dest: "4191470",
    weight: 3388.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b1b1115fd490825468a",
    src: "4251508",
    edges: [
    {
    _id: "5fc15f453b1b763994eb79cc",
    dest: "4251510",
    weight: 20953.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546a2",
    src: "4191456",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f16",
    dest: "4191458",
    weight: 175.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254690",
    src: "4191448",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f11",
    dest: "4115822",
    weight: 424.7
    },
    {
    _id: "5fc15f453b1b763994eb71e0",
    dest: "4191548",
    weight: 537
    },
    {
    _id: "5fc15f453b1b763994eb72b5",
    dest: "4091834",
    weight: 410
    },
    {
    _id: "5fc15f453b1b763994eb73e0",
    dest: "4220760",
    weight: 632.6
    },
    {
    _id: "5fc15f453b1b763994eb75ac",
    dest: "4094578",
    weight: 392.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825469a",
    src: "4191450",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f13",
    dest: "4191452",
    weight: 256.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825469c",
    src: "4191452",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f14",
    dest: "4191454",
    weight: 310.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825469e",
    src: "4191454",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f15",
    dest: "4191456",
    weight: 304.3
    },
    {
    _id: "5fc15f453b1b763994eb72b9",
    dest: "4175880",
    weight: 400.3
    },
    {
    _id: "5fc15f453b1b763994eb772b",
    dest: "4175882",
    weight: 285.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546ab",
    src: "4191464",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1a",
    dest: "4191466",
    weight: 180.7
    },
    {
    _id: "5fc15f453b1b763994eb708e",
    dest: "4091774",
    weight: 162.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254696",
    src: "4115822",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f12",
    dest: "4191450",
    weight: 224.9
    },
    {
    _id: "5fc15f453b1b763994eb6f63",
    dest: "4091910",
    weight: 389.7
    },
    {
    _id: "5fc15f453b1b763994eb6fc8",
    dest: "4093514",
    weight: 249.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546a9",
    src: "4191462",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f19",
    dest: "4191464",
    weight: 143.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546a7",
    src: "4191460",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f18",
    dest: "4191462",
    weight: 171.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546a4",
    src: "4191458",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f17",
    dest: "4191460",
    weight: 341.7
    },
    {
    _id: "5fc15f453b1b763994eb71b0",
    dest: "4091758",
    weight: 430.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546ae",
    src: "4191466",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1b",
    dest: "4191468",
    weight: 122.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546b0",
    src: "4191468",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1c",
    dest: "4191470",
    weight: 202.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546b6",
    src: "4191472",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1e",
    dest: "4191474",
    weight: 291.7
    },
    {
    _id: "5fc15f453b1b763994eb7006",
    dest: "4094354",
    weight: 691
    },
    {
    _id: "5fc15f453b1b763994eb78fc",
    dest: "4091502",
    weight: 626.8
    },
    {
    _id: "5fc15f453b1b763994eb79d0",
    dest: "4093230",
    weight: 1086.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546b2",
    src: "4191470",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1d",
    dest: "4191472",
    weight: 466.3
    },
    {
    _id: "5fc15f453b1b763994eb7087",
    dest: "4093246",
    weight: 487.2
    },
    {
    _id: "5fc15f453b1b763994eb70b8",
    dest: "4093978",
    weight: 384.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546c5",
    src: "4191482",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f22",
    dest: "4191484",
    weight: 428.8
    },
    {
    _id: "5fc15f453b1b763994eb7069",
    dest: "4093214",
    weight: 247.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546ca",
    src: "4191486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f24",
    dest: "4191488",
    weight: 226.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546bb",
    src: "4191474",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f1f",
    dest: "4191476",
    weight: 437.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546bd",
    src: "4191476",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f20",
    dest: "4191480",
    weight: 617.8
    },
    {
    _id: "5fc15f453b1b763994eb6f4a",
    dest: "4091142",
    weight: 179.7
    },
    {
    _id: "5fc15f453b1b763994eb715a",
    dest: "4164070",
    weight: 749.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546c8",
    src: "4191484",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f23",
    dest: "4191486",
    weight: 354.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546c1",
    src: "4191480",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f21",
    dest: "4191482",
    weight: 914.4
    },
    {
    _id: "5fc15f453b1b763994eb71f0",
    dest: "4091546",
    weight: 1486.7
    },
    {
    _id: "5fc15f453b1b763994eb7850",
    dest: "4093286",
    weight: 1492.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546cc",
    src: "4191488",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f25",
    dest: "4191490",
    weight: 411.2
    },
    {
    _id: "5fc15f453b1b763994eb7032",
    dest: "4091646",
    weight: 936.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546cf",
    src: "4191490",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f26",
    dest: "4191492",
    weight: 364.8
    },
    {
    _id: "5fc15f453b1b763994eb78aa",
    dest: "4220578",
    weight: 410.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546db",
    src: "4188892",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2b",
    dest: "4188896",
    weight: 269
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546e1",
    src: "4188890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2d",
    dest: "4188886",
    weight: 422.7
    },
    {
    _id: "5fc15f453b1b763994eb75ed",
    dest: "4220604",
    weight: 1187.6
    },
    {
    _id: "5fc15f453b1b763994eb7932",
    dest: "4231816",
    weight: 1065.9
    },
    {
    _id: "5fc15f453b1b763994eb7998",
    dest: "4251502",
    weight: 26268.9
    },
    {
    _id: "5fc15f453b1b763994eb79a2",
    dest: "4220796",
    weight: 11131
    },
    {
    _id: "5fc15f453b1b763994eb79ca",
    dest: "4251506",
    weight: 12977
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546e8",
    src: "4188886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2e",
    dest: "4188894",
    weight: 219.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546d8",
    src: "4175858",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2a",
    dest: "4188892",
    weight: 266.3
    },
    {
    _id: "5fc15f453b1b763994eb798f",
    dest: "4090734",
    weight: 409.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546d4",
    src: "4191494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f28",
    dest: "4191496",
    weight: 226
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546d2",
    src: "4191492",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f27",
    dest: "4191494",
    weight: 258.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546d6",
    src: "4191496",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f29",
    dest: "4175858",
    weight: 476.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546dd",
    src: "4188896",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2c",
    dest: "4188890",
    weight: 340.6
    },
    {
    _id: "5fc15f453b1b763994eb703b",
    dest: "4188888",
    weight: 125.9
    },
    {
    _id: "5fc15f453b1b763994eb783f",
    dest: "4220746",
    weight: 382
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546ea",
    src: "4188894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f2f",
    dest: "4175856",
    weight: 280.4
    },
    {
    _id: "5fc15f453b1b763994eb703f",
    dest: "4090734",
    weight: 426.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546f8",
    src: "4191512",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f35",
    dest: "4191514",
    weight: 365.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546fa",
    src: "4191514",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f36",
    dest: "4191516",
    weight: 416.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546f2",
    src: "4191506",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f32",
    dest: "4191508",
    weight: 338.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546ed",
    src: "4175856",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f30",
    dest: "4231804",
    weight: 303.9
    },
    {
    _id: "5fc15f453b1b763994eb7967",
    dest: "4191502",
    weight: 520.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546f4",
    src: "4191508",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f33",
    dest: "4191510",
    weight: 166.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254700",
    src: "4191518",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f38",
    dest: "4191522",
    weight: 816.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546f0",
    src: "4231804",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f31",
    dest: "4191506",
    weight: 1005.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546fc",
    src: "4191516",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f37",
    dest: "4191518",
    weight: 766.1
    },
    {
    _id: "5fc15f453b1b763994eb704d",
    dest: "4093814",
    weight: 800.2
    },
    {
    _id: "5fc15f453b1b763994eb7073",
    dest: "4091822",
    weight: 1308.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082546f6",
    src: "4191510",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f34",
    dest: "4191512",
    weight: 145.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254702",
    src: "4191522",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f39",
    dest: "4191524",
    weight: 404.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254704",
    src: "4191524",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3a",
    dest: "4191526",
    weight: 427
    },
    {
    _id: "5fc15f453b1b763994eb6f60",
    dest: "4093246",
    weight: 548.2
    },
    {
    _id: "5fc15f453b1b763994eb7205",
    dest: "4091502",
    weight: 493.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825470b",
    src: "4191528",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3c",
    dest: "4191530",
    weight: 289.8
    },
    {
    _id: "5fc15f453b1b763994eb723b",
    dest: "4092786",
    weight: 202
    },
    {
    _id: "5fc15f453b1b763994eb765c",
    dest: "4093894",
    weight: 2400.3
    },
    {
    _id: "5fc15f453b1b763994eb78e0",
    dest: "4093130",
    weight: 229.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254708",
    src: "4191526",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3b",
    dest: "4191528",
    weight: 220.8
    },
    {
    _id: "5fc15f453b1b763994eb7431",
    dest: "4191530",
    weight: 510.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254717",
    src: "4191536",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f40",
    dest: "4191538",
    weight: 286.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254713",
    src: "4191532",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3e",
    dest: "4191534",
    weight: 240.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825471c",
    src: "4191540",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f42",
    dest: "4191542",
    weight: 215.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254710",
    src: "4191530",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3d",
    dest: "4191532",
    weight: 195.1
    },
    {
    _id: "5fc15f453b1b763994eb7432",
    dest: "4142886",
    weight: 205.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254719",
    src: "4191538",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f41",
    dest: "4191540",
    weight: 304.8
    },
    {
    _id: "5fc15f453b1b763994eb70b2",
    dest: "4091626",
    weight: 195.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254715",
    src: "4191534",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f3f",
    dest: "4191536",
    weight: 179.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825471e",
    src: "4191542",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f43",
    dest: "4191544",
    weight: 310.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254729",
    src: "4115826",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f47",
    dest: "4191448",
    weight: 451
    },
    {
    _id: "5fc15f453b1b763994eb78cf",
    dest: "4220582",
    weight: 7376.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254723",
    src: "4091618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f45",
    dest: "4191546",
    weight: 97.3
    },
    {
    _id: "5fc15f453b1b763994eb72f5",
    dest: "4092522",
    weight: 103.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254733",
    src: "4091142",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f4b",
    dest: "4129014",
    weight: 224.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825472c",
    src: "4093250",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f48",
    dest: "4191474",
    weight: 137.2
    },
    {
    _id: "5fc15f453b1b763994eb7029",
    dest: "4093254",
    weight: 544.7
    },
    {
    _id: "5fc15f453b1b763994eb7099",
    dest: "4094354",
    weight: 536.4
    },
    {
    _id: "5fc15f453b1b763994eb70dc",
    dest: "4191470",
    weight: 732.7
    },
    {
    _id: "5fc15f453b1b763994eb7185",
    dest: "4093246",
    weight: 527
    },
    {
    _id: "5fc15f453b1b763994eb79a5",
    dest: "4093846",
    weight: 629.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254726",
    src: "4191546",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f46",
    dest: "4115826",
    weight: 224.8
    },
    {
    _id: "5fc15f453b1b763994eb718f",
    dest: "4091714",
    weight: 554.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254738",
    src: "4093266",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f4d",
    dest: "4178862",
    weight: 189.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254720",
    src: "4191544",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f44",
    dest: "4091618",
    weight: 149.4
    },
    {
    _id: "5fc15f453b1b763994eb7757",
    dest: "4092522",
    weight: 253
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254735",
    src: "4129014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f4c",
    dest: "4093266",
    weight: 224.9
    },
    {
    _id: "5fc15f453b1b763994eb7078",
    dest: "4093230",
    weight: 170.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825473a",
    src: "4178862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f4e",
    dest: "4093270",
    weight: 327.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825473c",
    src: "4093270",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f4f",
    dest: "4091258",
    weight: 328.4
    },
    {
    _id: "5fc15f453b1b763994eb73bb",
    dest: "4093274",
    weight: 279.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825473f",
    src: "4091258",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f50",
    dest: "4091266",
    weight: 504.9
    },
    {
    _id: "5fc15f453b1b763994eb7717",
    dest: "4220584",
    weight: 529.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254755",
    src: "4091242",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f58",
    dest: "4091246",
    weight: 331.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254742",
    src: "4091266",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f51",
    dest: "4091274",
    weight: 300.3
    },
    {
    _id: "5fc15f453b1b763994eb706d",
    dest: "4129054",
    weight: 462.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825474e",
    src: "4209546",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f55",
    dest: "4091446",
    weight: 250
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825474b",
    src: "4091278",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f54",
    dest: "4209546",
    weight: 311.7
    },
    {
    _id: "5fc15f453b1b763994eb795a",
    dest: "4167902",
    weight: 947.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254748",
    src: "4094398",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f53",
    dest: "4091278",
    weight: 352.3
    },
    {
    _id: "5fc15f453b1b763994eb70e6",
    dest: "4094402",
    weight: 418.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254752",
    src: "4094538",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f57",
    dest: "4091242",
    weight: 144.1
    },
    {
    _id: "5fc15f453b1b763994eb7105",
    dest: "4094542",
    weight: 138.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254745",
    src: "4091274",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f52",
    dest: "4094398",
    weight: 195.8
    },
    {
    _id: "5fc15f453b1b763994eb701b",
    dest: "4094542",
    weight: 143.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254750",
    src: "4091446",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f56",
    dest: "4094538",
    weight: 454
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254757",
    src: "4091246",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f59",
    dest: "4091254",
    weight: 498.6
    },
    {
    _id: "5fc15f453b1b763994eb788b",
    dest: "4220584",
    weight: 224.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825475a",
    src: "4091254",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f5a",
    dest: "4093222",
    weight: 353.1
    },
    {
    _id: "5fc15f453b1b763994eb7070",
    dest: "4093274",
    weight: 173.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825475d",
    src: "4093222",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f5b",
    dest: "4143922",
    weight: 267.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254761",
    src: "4093226",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f5d",
    dest: "4091158",
    weight: 177.1
    },
    {
    _id: "5fc15f453b1b763994eb73da",
    dest: "4093230",
    weight: 168.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254764",
    src: "4091158",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f5e",
    dest: "4191522",
    weight: 498
    },
    {
    _id: "5fc15f453b1b763994eb7062",
    dest: "4091330",
    weight: 559.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825475f",
    src: "4143922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f5c",
    dest: "4093226",
    weight: 247.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825476f",
    src: "4091958",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f66",
    dest: "4091966",
    weight: 143
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825476d",
    src: "4091926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f65",
    dest: "4091958",
    weight: 206.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825476a",
    src: "4091910",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f64",
    dest: "4091926",
    weight: 271.2
    },
    {
    _id: "5fc15f453b1b763994eb7112",
    dest: "4093982",
    weight: 331.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254767",
    src: "4093246",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f61",
    dest: "4093250",
    weight: 411.6
    },
    {
    _id: "5fc15f453b1b763994eb7088",
    dest: "4091350",
    weight: 287.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254771",
    src: "4091966",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f67",
    dest: "4091970",
    weight: 243.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254773",
    src: "4091970",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f68",
    dest: "4091974",
    weight: 247.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254775",
    src: "4091974",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f69",
    dest: "4091978",
    weight: 360.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254777",
    src: "4091978",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6a",
    dest: "4092802",
    weight: 189.2
    },
    {
    _id: "5fc15f453b1b763994eb7538",
    dest: "4091982",
    weight: 218.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825477e",
    src: "4092810",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6d",
    dest: "4092814",
    weight: 257.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254780",
    src: "4092814",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6e",
    dest: "4092818",
    weight: 409.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825477c",
    src: "4092806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6c",
    dest: "4092810",
    weight: 282.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825477a",
    src: "4092802",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6b",
    dest: "4092806",
    weight: 338.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254782",
    src: "4092818",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f6f",
    dest: "4092370",
    weight: 367.9
    },
    {
    _id: "5fc15f453b1b763994eb736a",
    dest: "4092822",
    weight: 186.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254785",
    src: "4092370",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f70",
    dest: "4092378",
    weight: 263.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254787",
    src: "4092378",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f71",
    dest: "4093322",
    weight: 368.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254789",
    src: "4093322",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f72",
    dest: "4093326",
    weight: 281.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825478b",
    src: "4093326",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f73",
    dest: "4093330",
    weight: 267.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825478d",
    src: "4093330",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f74",
    dest: "4093334",
    weight: 528.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254793",
    src: "4093346",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f77",
    dest: "4093350",
    weight: 558.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825478f",
    src: "4093334",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f75",
    dest: "4093342",
    weight: 501.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254791",
    src: "4093342",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f76",
    dest: "4093346",
    weight: 430.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254797",
    src: "4093354",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f79",
    dest: "4135406",
    weight: 497.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254795",
    src: "4093350",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f78",
    dest: "4093354",
    weight: 228.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254799",
    src: "4135406",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7a",
    dest: "4093358",
    weight: 190.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825479b",
    src: "4093358",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7b",
    dest: "4093362",
    weight: 207.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547a3",
    src: "4093374",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7f",
    dest: "4093382",
    weight: 277.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547a1",
    src: "4093370",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7e",
    dest: "4093374",
    weight: 242.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ab",
    src: "4093394",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f83",
    dest: "4093398",
    weight: 442.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825479f",
    src: "4093366",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7d",
    dest: "4093370",
    weight: 169.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547af",
    src: "4093402",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f85",
    dest: "4093406",
    weight: 683.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825479d",
    src: "4093362",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f7c",
    dest: "4093366",
    weight: 267.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ad",
    src: "4093398",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f84",
    dest: "4093402",
    weight: 272.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547a9",
    src: "4093390",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f82",
    dest: "4093394",
    weight: 803
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547a5",
    src: "4093382",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f80",
    dest: "4093386",
    weight: 386
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547a7",
    src: "4093386",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f81",
    dest: "4093390",
    weight: 519.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547b1",
    src: "4093406",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f86",
    dest: "4093410",
    weight: 586.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547b3",
    src: "4093410",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f87",
    dest: "4093418",
    weight: 633.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547b5",
    src: "4093418",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f88",
    dest: "4093422",
    weight: 330
    },
    {
    _id: "5fc15f453b1b763994eb7265",
    dest: "4229502",
    weight: 658.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547b8",
    src: "4093422",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f89",
    dest: "4093426",
    weight: 574.9
    },
    {
    _id: "5fc15f453b1b763994eb71c5",
    dest: "4091594",
    weight: 1397.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547bb",
    src: "4093426",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8a",
    dest: "4093430",
    weight: 313.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547bf",
    src: "4093434",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8c",
    dest: "4158914",
    weight: 290
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547bd",
    src: "4093430",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8b",
    dest: "4093434",
    weight: 676.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547c3",
    src: "4093442",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8e",
    dest: "4093446",
    weight: 824
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547c5",
    src: "4093446",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8f",
    dest: "4093450",
    weight: 431.7
    },
    {
    _id: "5fc15f453b1b763994eb77ac",
    dest: "4220638",
    weight: 1057.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547c1",
    src: "4158914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f8d",
    dest: "4093442",
    weight: 465
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ca",
    src: "4093458",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f91",
    dest: "4093462",
    weight: 219.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547c8",
    src: "4093450",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f90",
    dest: "4093458",
    weight: 476.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547cc",
    src: "4093462",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f92",
    dest: "4093466",
    weight: 367.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547d0",
    src: "4093470",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f94",
    dest: "4093474",
    weight: 242.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ce",
    src: "4093466",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f93",
    dest: "4093470",
    weight: 300.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547d2",
    src: "4093474",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f95",
    dest: "4093478",
    weight: 724.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547d4",
    src: "4093478",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f96",
    dest: "4093482",
    weight: 622.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547d6",
    src: "4093482",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f97",
    dest: "4093486",
    weight: 537.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547d8",
    src: "4093486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f98",
    dest: "4093490",
    weight: 523
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547da",
    src: "4093490",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f99",
    dest: "4093494",
    weight: 472
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547de",
    src: "4093498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9b",
    dest: "4093502",
    weight: 291.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547dc",
    src: "4093494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9a",
    dest: "4093498",
    weight: 308.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547e0",
    src: "4093502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9c",
    dest: "4093506",
    weight: 623.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547e8",
    src: "4093094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa0",
    dest: "4093098",
    weight: 391.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547e2",
    src: "4093506",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9d",
    dest: "4093086",
    weight: 356.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547e4",
    src: "4093086",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9e",
    dest: "4093090",
    weight: 168.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547e6",
    src: "4093090",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6f9f",
    dest: "4093094",
    weight: 193.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ea",
    src: "4093098",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa1",
    dest: "4093102",
    weight: 204.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ef",
    src: "4093106",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa3",
    dest: "4092190",
    weight: 384.6
    },
    {
    _id: "5fc15f453b1b763994eb73ad",
    dest: "4093118",
    weight: 497.9
    },
    {
    _id: "5fc15f453b1b763994eb76b8",
    dest: "4209534",
    weight: 177.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ec",
    src: "4093102",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa2",
    dest: "4093106",
    weight: 183.5
    },
    {
    _id: "5fc15f453b1b763994eb7058",
    dest: "4091946",
    weight: 263.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547f3",
    src: "4092190",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa4",
    dest: "4092194",
    weight: 438
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547f5",
    src: "4092194",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa5",
    dest: "4092198",
    weight: 172.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547f7",
    src: "4092198",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa6",
    dest: "4092202",
    weight: 740.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547f9",
    src: "4092202",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa7",
    dest: "4092206",
    weight: 242.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547fd",
    src: "4092210",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa9",
    dest: "4092214",
    weight: 318.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547fb",
    src: "4092206",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fa8",
    dest: "4092210",
    weight: 192.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082547ff",
    src: "4092214",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6faa",
    dest: "4115826",
    weight: 414.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254801",
    src: "4094822",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fac",
    dest: "4094826",
    weight: 288.9
    },
    {
    _id: "5fc15f453b1b763994eb7003",
    dest: "4091310",
    weight: 412.6
    },
    {
    _id: "5fc15f453b1b763994eb70af",
    dest: "4091210",
    weight: 449.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254809",
    src: "4094830",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fae",
    dest: "4094838",
    weight: 364.6
    },
    {
    _id: "5fc15f453b1b763994eb7880",
    dest: "4220576",
    weight: 391.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254805",
    src: "4094826",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fad",
    dest: "4094830",
    weight: 704.5
    },
    {
    _id: "5fc15f453b1b763994eb7080",
    dest: "4091810",
    weight: 356.7
    },
    {
    _id: "5fc15f453b1b763994eb7948",
    dest: "4092174",
    weight: 160.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825480c",
    src: "4094838",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6faf",
    dest: "4094842",
    weight: 325.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825480e",
    src: "4094842",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb0",
    dest: "4091222",
    weight: 283.9
    },
    {
    _id: "5fc15f453b1b763994eb720d",
    dest: "4094850",
    weight: 730.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254811",
    src: "4091222",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb1",
    dest: "4091134",
    weight: 180.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825481b",
    src: "4094374",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb5",
    dest: "4094378",
    weight: 266.4
    },
    {
    _id: "5fc15f453b1b763994eb7017",
    dest: "4196156",
    weight: 160.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254817",
    src: "4091298",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb3",
    dest: "4094370",
    weight: 383.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825481e",
    src: "4094378",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb6",
    dest: "4094382",
    weight: 241.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254813",
    src: "4091134",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb2",
    dest: "4091298",
    weight: 211.6
    },
    {
    _id: "5fc15f453b1b763994eb742d",
    dest: "4094566",
    weight: 392.5
    },
    {
    _id: "5fc15f453b1b763994eb74a9",
    dest: "4094370",
    weight: 594.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254820",
    src: "4094382",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb7",
    dest: "4091302",
    weight: 205.6
    },
    {
    _id: "5fc15f453b1b763994eb70e3",
    dest: "4094386",
    weight: 160
    },
    {
    _id: "5fc15f453b1b763994eb760f",
    dest: "4220674",
    weight: 172.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254824",
    src: "4091302",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb8",
    dest: "4091306",
    weight: 232.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254819",
    src: "4094370",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb4",
    dest: "4094374",
    weight: 412.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254826",
    src: "4091306",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fb9",
    dest: "4094542",
    weight: 388.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254828",
    src: "4094542",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fba",
    dest: "4094550",
    weight: 309.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825482a",
    src: "4094550",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fbb",
    dest: "4091770",
    weight: 206.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825482e",
    src: "4094554",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fbd",
    dest: "4094558",
    weight: 175.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254830",
    src: "4094558",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fbe",
    dest: "4094562",
    weight: 447.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825482c",
    src: "4091770",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fbc",
    dest: "4094554",
    weight: 264.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254838",
    src: "4091170",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc1",
    dest: "4091174",
    weight: 121.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825483a",
    src: "4091174",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc2",
    dest: "4094966",
    weight: 168.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254832",
    src: "4094562",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fbf",
    dest: "4091366",
    weight: 383.2
    },
    {
    _id: "5fc15f453b1b763994eb7021",
    dest: "4091166",
    weight: 549.9
    },
    {
    _id: "5fc15f453b1b763994eb710b",
    dest: "4094566",
    weight: 404.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254836",
    src: "4091366",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc0",
    dest: "4091170",
    weight: 296.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825483c",
    src: "4094966",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc3",
    dest: "4094970",
    weight: 167.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825483e",
    src: "4094970",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc4",
    dest: "4094978",
    weight: 287.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254840",
    src: "4094978",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc5",
    dest: "4094982",
    weight: 272.1
    },
    {
    _id: "5fc15f453b1b763994eb7440",
    dest: "4092166",
    weight: 509.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254843",
    src: "4094982",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc6",
    dest: "4094822",
    weight: 242
    },
    {
    _id: "5fc15f453b1b763994eb7725",
    dest: "4091318",
    weight: 1113.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254848",
    src: "4093518",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fca",
    dest: "4093522",
    weight: 203.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825484a",
    src: "4093522",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fcb",
    dest: "4093526",
    weight: 206.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254846",
    src: "4093514",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fc9",
    dest: "4093518",
    weight: 424.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825484c",
    src: "4093526",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fcc",
    dest: "4093530",
    weight: 200.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825484e",
    src: "4093530",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fcd",
    dest: "4093534",
    weight: 155.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254850",
    src: "4093534",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fce",
    dest: "4093542",
    weight: 377
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254855",
    src: "4093550",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd0",
    dest: "4093554",
    weight: 201
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254852",
    src: "4093542",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fcf",
    dest: "4093550",
    weight: 470.8
    },
    {
    _id: "5fc15f453b1b763994eb766b",
    dest: "4175886",
    weight: 351.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254857",
    src: "4093554",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd1",
    dest: "4093558",
    weight: 248.9
    },
    {
    _id: "5fc15f453b1b763994eb75e5",
    dest: "4094786",
    weight: 524.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825485a",
    src: "4093558",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd2",
    dest: "4091434",
    weight: 619.2
    },
    {
    _id: "5fc15f453b1b763994eb7195",
    dest: "4091722",
    weight: 525
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254866",
    src: "4093574",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd6",
    dest: "4093578",
    weight: 216.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825486a",
    src: "4093582",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd8",
    dest: "4186426",
    weight: 280.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254868",
    src: "4093578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd7",
    dest: "4093582",
    weight: 351.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254864",
    src: "4093566",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd5",
    dest: "4093574",
    weight: 217.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254860",
    src: "4093562",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd4",
    dest: "4093566",
    weight: 207
    },
    {
    _id: "5fc15f453b1b763994eb751b",
    dest: "4091530",
    weight: 314.9
    },
    {
    _id: "5fc15f453b1b763994eb7596",
    dest: "4136914",
    weight: 249.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825485d",
    src: "4091434",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd3",
    dest: "4093562",
    weight: 518.7
    },
    {
    _id: "5fc15f453b1b763994eb7742",
    dest: "4091438",
    weight: 420.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825486c",
    src: "4186426",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fd9",
    dest: "4093590",
    weight: 110.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825486e",
    src: "4093590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fda",
    dest: "4093598",
    weight: 417.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254870",
    src: "4093598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fdb",
    dest: "4093602",
    weight: 264.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254872",
    src: "4093602",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fdc",
    dest: "4093606",
    weight: 288.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254877",
    src: "4093610",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fde",
    dest: "4093614",
    weight: 175.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825487d",
    src: "4093622",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe1",
    dest: "4093626",
    weight: 323.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254874",
    src: "4093606",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fdd",
    dest: "4093610",
    weight: 389.8
    },
    {
    _id: "5fc15f453b1b763994eb767a",
    dest: "4191592",
    weight: 695.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825487f",
    src: "4093626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe2",
    dest: "4093634",
    weight: 515
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825487b",
    src: "4093618",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe0",
    dest: "4093622",
    weight: 679.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254879",
    src: "4093614",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fdf",
    dest: "4093618",
    weight: 220.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254883",
    src: "4093638",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe4",
    dest: "4093642",
    weight: 251.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254887",
    src: "4092670",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe6",
    dest: "4092666",
    weight: 146.6
    },
    {
    _id: "5fc15f453b1b763994eb7401",
    dest: "4092678",
    weight: 663.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254893",
    src: "4091522",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6feb",
    dest: "4093658",
    weight: 360.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254881",
    src: "4093634",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe3",
    dest: "4093638",
    weight: 287.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254891",
    src: "4093654",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fea",
    dest: "4091522",
    weight: 170.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825488d",
    src: "4093646",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe8",
    dest: "4093650",
    weight: 212.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254885",
    src: "4093642",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe5",
    dest: "4092670",
    weight: 431.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825488f",
    src: "4093650",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe9",
    dest: "4093654",
    weight: 321.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254895",
    src: "4093658",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fec",
    dest: "4093662",
    weight: 305
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825488a",
    src: "4092666",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fe7",
    dest: "4093646",
    weight: 504.2
    },
    {
    _id: "5fc15f453b1b763994eb7400",
    dest: "4092670",
    weight: 146.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825489b",
    src: "4093682",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fef",
    dest: "4091454",
    weight: 197.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254897",
    src: "4093662",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fed",
    dest: "4093678",
    weight: 685.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254899",
    src: "4093678",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fee",
    dest: "4093682",
    weight: 271.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825489f",
    src: "4091462",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff1",
    dest: "4093686",
    weight: 328.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825489d",
    src: "4091454",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff0",
    dest: "4091462",
    weight: 273.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548a1",
    src: "4093686",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff2",
    dest: "4093690",
    weight: 206.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548a3",
    src: "4093690",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff3",
    dest: "4093702",
    weight: 463
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548a5",
    src: "4093702",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff4",
    dest: "4186428",
    weight: 127.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548a7",
    src: "4186428",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff5",
    dest: "4093710",
    weight: 249.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548a9",
    src: "4093710",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff6",
    dest: "4093718",
    weight: 456.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ad",
    src: "4093722",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff8",
    dest: "4093726",
    weight: 315.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548af",
    src: "4093726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff9",
    dest: "4091438",
    weight: 647.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ab",
    src: "4093718",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ff7",
    dest: "4093722",
    weight: 239.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548b1",
    src: "4091438",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ffa",
    dest: "4093730",
    weight: 896.3
    },
    {
    _id: "5fc15f453b1b763994eb7586",
    dest: "4094750",
    weight: 711.1
    },
    {
    _id: "5fc15f453b1b763994eb7624",
    dest: "4091722",
    weight: 246.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548be",
    src: "4093750",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6fff",
    dest: "4093754",
    weight: 394.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548bc",
    src: "4093742",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ffe",
    dest: "4093750",
    weight: 188
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548b7",
    src: "4093734",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ffc",
    dest: "4093738",
    weight: 546.3
    },
    {
    _id: "5fc15f453b1b763994eb75b5",
    dest: "4094618",
    weight: 664.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548b5",
    src: "4093730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ffb",
    dest: "4093734",
    weight: 209.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ba",
    src: "4093738",
    edges: [
    {
    _id: "5fc15f453b1b763994eb6ffd",
    dest: "4093742",
    weight: 316.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548c0",
    src: "4093754",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7000",
    dest: "4093762",
    weight: 337.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548c2",
    src: "4093762",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7001",
    dest: "4115826",
    weight: 651.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548c4",
    src: "4091310",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7004",
    dest: "4091314",
    weight: 202.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548c6",
    src: "4091314",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7005",
    dest: "4191472",
    weight: 336.4
    },
    {
    _id: "5fc15f453b1b763994eb71b4",
    dest: "4093250",
    weight: 390.8
    },
    {
    _id: "5fc15f453b1b763994eb765a",
    dest: "4191526",
    weight: 236.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ca",
    src: "4094354",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7007",
    dest: "4094358",
    weight: 307.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548cc",
    src: "4094358",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7008",
    dest: "4091166",
    weight: 369.2
    },
    {
    _id: "5fc15f453b1b763994eb7015",
    dest: "4094370",
    weight: 519.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548cf",
    src: "4091166",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7009",
    dest: "4091170",
    weight: 222.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548d9",
    src: "4093262",
    edges: [
    {
    _id: "5fc15f453b1b763994eb702b",
    dest: "4093826",
    weight: 196.1
    },
    {
    _id: "5fc15f453b1b763994eb73b8",
    dest: "4093266",
    weight: 154.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548d3",
    src: "4196158",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7019",
    dest: "4091266",
    weight: 405.7
    },
    {
    _id: "5fc15f453b1b763994eb771b",
    dest: "4091254",
    weight: 705
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548d6",
    src: "4093254",
    edges: [
    {
    _id: "5fc15f453b1b763994eb702a",
    dest: "4093262",
    weight: 425.6
    },
    {
    _id: "5fc15f453b1b763994eb7061",
    dest: "4091158",
    weight: 534.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548d1",
    src: "4196156",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7018",
    dest: "4196158",
    weight: 95.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548dc",
    src: "4093826",
    edges: [
    {
    _id: "5fc15f453b1b763994eb702c",
    dest: "4164070",
    weight: 190.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548e0",
    src: "4164074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb702e",
    dest: "4191482",
    weight: 805.2
    },
    {
    _id: "5fc15f453b1b763994eb715c",
    dest: "4093286",
    weight: 1382.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548de",
    src: "4164070",
    edges: [
    {
    _id: "5fc15f453b1b763994eb702d",
    dest: "4164074",
    weight: 137
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548e3",
    src: "4091646",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7033",
    dest: "4091658",
    weight: 332.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548e7",
    src: "4091662",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7035",
    dest: "4091666",
    weight: 270.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548eb",
    src: "4091670",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7037",
    dest: "4091674",
    weight: 284.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548e9",
    src: "4091666",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7036",
    dest: "4091670",
    weight: 310.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ed",
    src: "4091674",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7038",
    dest: "4091678",
    weight: 294.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548e5",
    src: "4091658",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7034",
    dest: "4091662",
    weight: 222
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ef",
    src: "4091678",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7039",
    dest: "4188892",
    weight: 334.7
    },
    {
    _id: "5fc15f453b1b763994eb7966",
    dest: "4175856",
    weight: 331.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548f2",
    src: "4188888",
    edges: [
    {
    _id: "5fc15f453b1b763994eb703c",
    dest: "4188890",
    weight: 214.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548f4",
    src: "4090734",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7040",
    dest: "4093842",
    weight: 210.6
    },
    {
    _id: "5fc15f453b1b763994eb7337",
    dest: "4229572",
    weight: 227.1
    },
    {
    _id: "5fc15f453b1b763994eb78b3",
    dest: "4093766",
    weight: 532.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548f8",
    src: "4093842",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7041",
    dest: "4093766",
    weight: 322.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548fa",
    src: "4093766",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7042",
    dest: "4195938",
    weight: 306.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548ff",
    src: "4093774",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7044",
    dest: "4093798",
    weight: 234.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082548fc",
    src: "4195938",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7043",
    dest: "4093774",
    weight: 270.5
    },
    {
    _id: "5fc15f453b1b763994eb7993",
    dest: "4220596",
    weight: 661.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254901",
    src: "4093798",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7045",
    dest: "4093802",
    weight: 219.2
    },
    {
    _id: "5fc15f453b1b763994eb7173",
    dest: "4094890",
    weight: 365.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254908",
    src: "4093814",
    edges: [
    {
    _id: "5fc15f453b1b763994eb704e",
    dest: "4093818",
    weight: 150.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254906",
    src: "4093806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7047",
    dest: "4191506",
    weight: 460.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254904",
    src: "4093802",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7046",
    dest: "4093806",
    weight: 177.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825490a",
    src: "4093818",
    edges: [
    {
    _id: "5fc15f453b1b763994eb704f",
    dest: "4093822",
    weight: 160.1
    },
    {
    _id: "5fc15f453b1b763994eb7181",
    dest: "4191522",
    weight: 782.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825490d",
    src: "4093822",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7050",
    dest: "4093230",
    weight: 228.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825490f",
    src: "4093230",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7051",
    dest: "4093234",
    weight: 266.2
    },
    {
    _id: "5fc15f453b1b763994eb7079",
    dest: "4091318",
    weight: 274.9
    },
    {
    _id: "5fc15f453b1b763994eb79d1",
    dest: "4091502",
    weight: 669.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254913",
    src: "4093234",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7052",
    dest: "4093242",
    weight: 153.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825491b",
    src: "4115390",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7056",
    dest: "4175632",
    weight: 232.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254915",
    src: "4093242",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7053",
    dest: "4091138",
    weight: 462.2
    },
    {
    _id: "5fc15f453b1b763994eb707b",
    dest: "4091502",
    weight: 250.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254918",
    src: "4091138",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7054",
    dest: "4093246",
    weight: 513.1
    },
    {
    _id: "5fc15f453b1b763994eb7430",
    dest: "4191526",
    weight: 391.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825491d",
    src: "4175632",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7057",
    dest: "4093102",
    weight: 208.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254921",
    src: "4091930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705a",
    dest: "4091950",
    weight: 244.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825491f",
    src: "4091946",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7059",
    dest: "4091930",
    weight: 274.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254923",
    src: "4091950",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705b",
    dest: "4091814",
    weight: 372.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254925",
    src: "4091814",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705c",
    dest: "4091466",
    weight: 230.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254927",
    src: "4091466",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705d",
    dest: "4091186",
    weight: 206.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254929",
    src: "4091186",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705e",
    dest: "4220576",
    weight: 320.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254936",
    src: "4091378",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7065",
    dest: "4091326",
    weight: 669.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825492d",
    src: "4091194",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7060",
    dest: "4093254",
    weight: 296
    },
    {
    _id: "5fc15f453b1b763994eb7882",
    dest: "4094354",
    weight: 287.8
    },
    {
    _id: "5fc15f453b1b763994eb78dd",
    dest: "4091138",
    weight: 435.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825492b",
    src: "4220576",
    edges: [
    {
    _id: "5fc15f453b1b763994eb705f",
    dest: "4091194",
    weight: 220.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254933",
    src: "4093862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7064",
    dest: "4091378",
    weight: 428.5
    },
    {
    _id: "5fc15f453b1b763994eb70bd",
    dest: "4093866",
    weight: 263.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254931",
    src: "4091330",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7063",
    dest: "4093862",
    weight: 438.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254938",
    src: "4091326",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7066",
    dest: "4091322",
    weight: 300.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825493a",
    src: "4091322",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7067",
    dest: "4091386",
    weight: 301.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825493c",
    src: "4091386",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7068",
    dest: "4191482",
    weight: 854.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825493e",
    src: "4093214",
    edges: [
    {
    _id: "5fc15f453b1b763994eb706a",
    dest: "4093218",
    weight: 147.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825494a",
    src: "4091822",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7074",
    dest: "4091826",
    weight: 390.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254940",
    src: "4093218",
    edges: [
    {
    _id: "5fc15f453b1b763994eb706b",
    dest: "4091258",
    weight: 169.6
    },
    {
    _id: "5fc15f453b1b763994eb73d7",
    dest: "4093222",
    weight: 300.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825494c",
    src: "4091826",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7075",
    dest: "4093138",
    weight: 280.5
    },
    {
    _id: "5fc15f453b1b763994eb73b4",
    dest: "4093006",
    weight: 10031.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254945",
    src: "4093274",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7071",
    dest: "4093282",
    weight: 148.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254947",
    src: "4093282",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7072",
    dest: "4191516",
    weight: 287.7
    },
    {
    _id: "5fc15f453b1b763994eb73bd",
    dest: "4093286",
    weight: 778
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825494f",
    src: "4093138",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7076",
    dest: "4091142",
    weight: 468.8
    },
    {
    _id: "5fc15f453b1b763994eb7237",
    dest: "4191522",
    weight: 497.9
    },
    {
    _id: "5fc15f453b1b763994eb7997",
    dest: "4188890",
    weight: 5228.4
    },
    {
    _id: "5fc15f453b1b763994eb79a7",
    dest: "4229586",
    weight: 8693
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254943",
    src: "4129054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb706e",
    dest: "4091246",
    weight: 365.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254954",
    src: "4091318",
    edges: [
    {
    _id: "5fc15f453b1b763994eb707a",
    dest: "4093242",
    weight: 194.2
    },
    {
    _id: "5fc15f453b1b763994eb7726",
    dest: "4094822",
    weight: 1251.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254959",
    src: "4091506",
    edges: [
    {
    _id: "5fc15f453b1b763994eb707d",
    dest: "4094982",
    weight: 283.4
    },
    {
    _id: "5fc15f453b1b763994eb78fe",
    dest: "4092166",
    weight: 521.2
    },
    {
    _id: "5fc15f453b1b763994eb79d3",
    dest: "4092186",
    weight: 1201.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254957",
    src: "4091502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb707c",
    dest: "4091506",
    weight: 281.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825495d",
    src: "4091810",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7081",
    dest: "4091954",
    weight: 191.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825495f",
    src: "4091954",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7082",
    dest: "4091934",
    weight: 168.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254963",
    src: "4142878",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7084",
    dest: "4142886",
    weight: 83.6
    },
    {
    _id: "5fc15f453b1b763994eb7435",
    dest: "4191468",
    weight: 316.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254961",
    src: "4091934",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7083",
    dest: "4115390",
    weight: 786.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254969",
    src: "4091350",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7089",
    dest: "4091210",
    weight: 284.2
    },
    {
    _id: "5fc15f453b1b763994eb7946",
    dest: "4251500",
    weight: 146.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825496c",
    src: "4091210",
    edges: [
    {
    _id: "5fc15f453b1b763994eb708a",
    dest: "4091214",
    weight: 266.1
    },
    {
    _id: "5fc15f453b1b763994eb770a",
    dest: "4223958",
    weight: 250.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254966",
    src: "4142886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7085",
    dest: "4191468",
    weight: 232.8
    },
    {
    _id: "5fc15f453b1b763994eb7433",
    dest: "4142874",
    weight: 501
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825496f",
    src: "4091214",
    edges: [
    {
    _id: "5fc15f453b1b763994eb708b",
    dest: "4191460",
    weight: 342.6
    },
    {
    _id: "5fc15f453b1b763994eb70b1",
    dest: "4191538",
    weight: 627.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254983",
    src: "4093978",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70b9",
    dest: "4093846",
    weight: 205.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254978",
    src: "4142874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7092",
    dest: "4142882",
    weight: 210.8
    },
    {
    _id: "5fc15f453b1b763994eb7434",
    dest: "4142878",
    weight: 379.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254981",
    src: "4091634",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70b5",
    dest: "4142874",
    weight: 325
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825497d",
    src: "4091626",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70b3",
    dest: "4091630",
    weight: 205.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254976",
    src: "4129302",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7091",
    dest: "4142874",
    weight: 208.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254972",
    src: "4091774",
    edges: [
    {
    _id: "5fc15f453b1b763994eb708f",
    dest: "4091778",
    weight: 140.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825497f",
    src: "4091630",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70b4",
    dest: "4091634",
    weight: 197.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825497b",
    src: "4142882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7093",
    dest: "4142878",
    weight: 168.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254974",
    src: "4091778",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7090",
    dest: "4129302",
    weight: 209.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254985",
    src: "4093846",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ba",
    dest: "4093850",
    weight: 271.8
    },
    {
    _id: "5fc15f453b1b763994eb79a6",
    dest: "4093138",
    weight: 662.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254992",
    src: "4093874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c0",
    dest: "4093882",
    weight: 287.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254994",
    src: "4093882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c1",
    dest: "4093886",
    weight: 200.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825498f",
    src: "4093870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70bf",
    dest: "4093874",
    weight: 294.2
    },
    {
    _id: "5fc15f453b1b763994eb71d9",
    dest: "4094342",
    weight: 222.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254998",
    src: "4093890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c3",
    dest: "4093894",
    weight: 503.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825498d",
    src: "4093866",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70be",
    dest: "4093870",
    weight: 219
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254988",
    src: "4093850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70bb",
    dest: "4093854",
    weight: 146.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825498a",
    src: "4093854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70bc",
    dest: "4093862",
    weight: 377.2
    },
    {
    _id: "5fc15f453b1b763994eb7290",
    dest: "4093138",
    weight: 244
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd4908254996",
    src: "4093886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c2",
    dest: "4093890",
    weight: 155.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825499a",
    src: "4093894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c4",
    dest: "4093898",
    weight: 391.7
    },
    {
    _id: "5fc15f453b1b763994eb765d",
    dest: "4171434",
    weight: 12957.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825499d",
    src: "4093898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c5",
    dest: "4093902",
    weight: 262.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd490825499f",
    src: "4093902",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c6",
    dest: "4093906",
    weight: 306.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549a3",
    src: "4093910",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c8",
    dest: "4093914",
    weight: 222.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549a1",
    src: "4093906",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c7",
    dest: "4093910",
    weight: 274
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549a5",
    src: "4093914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70c9",
    dest: "4091542",
    weight: 215.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549a9",
    src: "4093918",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70cb",
    dest: "4093922",
    weight: 786.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549ab",
    src: "4093922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70cc",
    dest: "4093926",
    weight: 139.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549ad",
    src: "4093926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70cd",
    dest: "4093930",
    weight: 292.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17b641115fd49082549a7",
    src: "4091542",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ca",
    dest: "4093918",
    weight: 222.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549b3",
    src: "4093938",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d0",
    dest: "4093942",
    weight: 187.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549be",
    src: "4093962",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d5",
    dest: "4093966",
    weight: 123.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549b7",
    src: "4093946",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d2",
    dest: "4093950",
    weight: 359.1
    },
    {
    _id: "5fc15f453b1b763994eb7660",
    dest: "4191470",
    weight: 2490.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549b1",
    src: "4093934",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70cf",
    dest: "4093938",
    weight: 191.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549af",
    src: "4093930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ce",
    dest: "4093934",
    weight: 331.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549b5",
    src: "4093942",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d1",
    dest: "4093946",
    weight: 140.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549c2",
    src: "4093970",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d7",
    dest: "4091850",
    weight: 450.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549c0",
    src: "4093966",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d6",
    dest: "4093970",
    weight: 189.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549bc",
    src: "4093958",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d4",
    dest: "4093962",
    weight: 148.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549ba",
    src: "4093950",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d3",
    dest: "4093958",
    weight: 145.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549d4",
    src: "4094410",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70e8",
    dest: "4094414",
    weight: 203.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549d6",
    src: "4094414",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70e9",
    dest: "4094422",
    weight: 559.6
    },
    {
    _id: "5fc15f453b1b763994eb792b",
    dest: "4195928",
    weight: 648.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549cf",
    src: "4094394",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70e5",
    dest: "4094398",
    weight: 149.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549d1",
    src: "4094402",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70e7",
    dest: "4094410",
    weight: 407.2
    },
    {
    _id: "5fc15f453b1b763994eb798a",
    dest: "4094882",
    weight: 355.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549c9",
    src: "4209556",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70da",
    dest: "4093246",
    weight: 1065.4
    },
    {
    _id: "5fc15f453b1b763994eb71e9",
    dest: "4191470",
    weight: 578.2
    },
    {
    _id: "5fc15f453b1b763994eb72b1",
    dest: "4191554",
    weight: 3346.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549db",
    src: "4094426",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70eb",
    dest: "4094430",
    weight: 324.7
    },
    {
    _id: "5fc15f453b1b763994eb7616",
    dest: "4220592",
    weight: 748.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549c4",
    src: "4091850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d8",
    dest: "4093974",
    weight: 243.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549cd",
    src: "4094386",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70e4",
    dest: "4094394",
    weight: 332.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549c6",
    src: "4093974",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70d9",
    dest: "4209556",
    weight: 252.7
    },
    {
    _id: "5fc15f453b1b763994eb78fa",
    dest: "4191470",
    weight: 830.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549d9",
    src: "4094422",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ea",
    dest: "4094426",
    weight: 238
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549e0",
    src: "4094434",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ed",
    dest: "4094606",
    weight: 1192.3
    },
    {
    _id: "5fc15f453b1b763994eb7846",
    dest: "4094442",
    weight: 1010.2
    },
    {
    _id: "5fc15f453b1b763994eb7930",
    dest: "4220768",
    weight: 1159.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549de",
    src: "4094430",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ec",
    dest: "4094434",
    weight: 235.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549e4",
    src: "4094606",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ee",
    dest: "4094442",
    weight: 379.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549e8",
    src: "4094446",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f0",
    dest: "4094454",
    weight: 266.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549ec",
    src: "4094458",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f2",
    dest: "4094462",
    weight: 491.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549e6",
    src: "4094442",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ef",
    dest: "4094446",
    weight: 428
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549f0",
    src: "4094466",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f4",
    dest: "4092082",
    weight: 329.7
    },
    {
    _id: "5fc15f453b1b763994eb77ce",
    dest: "4092086",
    weight: 385.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549ee",
    src: "4094462",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f3",
    dest: "4094466",
    weight: 405.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549f3",
    src: "4092082",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f5",
    dest: "4094470",
    weight: 413
    },
    {
    _id: "5fc15f453b1b763994eb71b5",
    dest: "4092086",
    weight: 514
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549ea",
    src: "4094454",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f1",
    dest: "4094458",
    weight: 193.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549f6",
    src: "4094470",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f6",
    dest: "4094474",
    weight: 231
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549f8",
    src: "4094474",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f7",
    dest: "4094478",
    weight: 643.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549fa",
    src: "4094478",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f8",
    dest: "4094482",
    weight: 202.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549fc",
    src: "4094482",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70f9",
    dest: "4094486",
    weight: 259.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a07",
    src: "4094494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70fd",
    dest: "4094498",
    weight: 903.4
    },
    {
    _id: "5fc15f453b1b763994eb790c",
    dest: "4220592",
    weight: 1008.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a0c",
    src: "4094502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70ff",
    dest: "4094510",
    weight: 287
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a04",
    src: "4220768",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70fc",
    dest: "4094494",
    weight: 584.3
    },
    {
    _id: "5fc15f453b1b763994eb7800",
    dest: "4220590",
    weight: 324.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a00",
    src: "4094490",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70fb",
    dest: "4220768",
    weight: 475.4
    },
    {
    _id: "5fc15f453b1b763994eb74c5",
    dest: "4094494",
    weight: 480.5
    },
    {
    _id: "5fc15f453b1b763994eb77b7",
    dest: "4220642",
    weight: 983.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a0a",
    src: "4094498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70fe",
    dest: "4094502",
    weight: 269.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd49082549fe",
    src: "4094486",
    edges: [
    {
    _id: "5fc15f453b1b763994eb70fa",
    dest: "4094490",
    weight: 338.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a0e",
    src: "4094510",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7100",
    dest: "4094518",
    weight: 403.8
    },
    {
    _id: "5fc15f453b1b763994eb781c",
    dest: "4195928",
    weight: 177.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a11",
    src: "4094518",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7101",
    dest: "4094522",
    weight: 246.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a13",
    src: "4094522",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7102",
    dest: "4094526",
    weight: 394.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a15",
    src: "4094526",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7103",
    dest: "4094534",
    weight: 213
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a17",
    src: "4094534",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7104",
    dest: "4094538",
    weight: 255.1
    },
    {
    _id: "5fc15f453b1b763994eb722c",
    dest: "4094950",
    weight: 523.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a1a",
    src: "4094566",
    edges: [
    {
    _id: "5fc15f453b1b763994eb710c",
    dest: "4094570",
    weight: 458.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a1c",
    src: "4094570",
    edges: [
    {
    _id: "5fc15f453b1b763994eb710d",
    dest: "4091138",
    weight: 470.5
    },
    {
    _id: "5fc15f453b1b763994eb7891",
    dest: "4091502",
    weight: 258.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a1f",
    src: "4093982",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7113",
    dest: "4093986",
    weight: 292.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a23",
    src: "4093994",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7115",
    dest: "4093998",
    weight: 235.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a21",
    src: "4093986",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7114",
    dest: "4093994",
    weight: 235.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a25",
    src: "4093998",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7116",
    dest: "4094002",
    weight: 375.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a27",
    src: "4094002",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7117",
    dest: "4094006",
    weight: 280.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a2c",
    src: "4094014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7119",
    dest: "4094018",
    weight: 351.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a29",
    src: "4094006",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7118",
    dest: "4094014",
    weight: 346.2
    },
    {
    _id: "5fc15f453b1b763994eb7734",
    dest: "4220608",
    weight: 149.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a2e",
    src: "4094018",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711a",
    dest: "4094026",
    weight: 321.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a35",
    src: "4094034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711d",
    dest: "4094038",
    weight: 373.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a30",
    src: "4094026",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711b",
    dest: "4094030",
    weight: 306.9
    },
    {
    _id: "5fc15f453b1b763994eb774b",
    dest: "4220660",
    weight: 225.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a33",
    src: "4094030",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711c",
    dest: "4094034",
    weight: 249
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a39",
    src: "4094042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711f",
    dest: "4094046",
    weight: 276.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a37",
    src: "4094038",
    edges: [
    {
    _id: "5fc15f453b1b763994eb711e",
    dest: "4094042",
    weight: 301.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a3b",
    src: "4094046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7120",
    dest: "4094050",
    weight: 281.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a3d",
    src: "4094050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7121",
    dest: "4094054",
    weight: 536
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a3f",
    src: "4094054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7122",
    dest: "4094058",
    weight: 199.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a41",
    src: "4094058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7123",
    dest: "4094066",
    weight: 305.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a43",
    src: "4094066",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7124",
    dest: "4094070",
    weight: 323.9
    },
    {
    _id: "5fc15f453b1b763994eb75c5",
    dest: "4094670",
    weight: 219.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a46",
    src: "4094070",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7125",
    dest: "4094074",
    weight: 221.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a4a",
    src: "4094078",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7127",
    dest: "4094082",
    weight: 791.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a48",
    src: "4094074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7126",
    dest: "4094078",
    weight: 200.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a4e",
    src: "4094086",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7129",
    dest: "4094090",
    weight: 311.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a4c",
    src: "4094082",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7128",
    dest: "4094086",
    weight: 299.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a50",
    src: "4094090",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712a",
    dest: "4094094",
    weight: 234.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a52",
    src: "4094094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712b",
    dest: "4094098",
    weight: 397.2
    },
    {
    _id: "5fc15f453b1b763994eb7765",
    dest: "4220618",
    weight: 445
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a55",
    src: "4094098",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712c",
    dest: "4094102",
    weight: 264.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a57",
    src: "4094102",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712d",
    dest: "4094106",
    weight: 286.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a5b",
    src: "4094110",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712f",
    dest: "4094114",
    weight: 296.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a59",
    src: "4094106",
    edges: [
    {
    _id: "5fc15f453b1b763994eb712e",
    dest: "4094110",
    weight: 402.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a5f",
    src: "4094122",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7131",
    dest: "4094126",
    weight: 254.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a61",
    src: "4094126",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7132",
    dest: "4094130",
    weight: 312.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a63",
    src: "4094130",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7133",
    dest: "4092390",
    weight: 235
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a5d",
    src: "4094114",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7130",
    dest: "4094122",
    weight: 409
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a65",
    src: "4092390",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7134",
    dest: "4092394",
    weight: 258.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a67",
    src: "4092394",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7135",
    dest: "4092398",
    weight: 250
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a69",
    src: "4092398",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7136",
    dest: "4092402",
    weight: 325.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a6b",
    src: "4092402",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7137",
    dest: "4092406",
    weight: 555.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a6d",
    src: "4092406",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7138",
    dest: "4094134",
    weight: 313.3
    },
    {
    _id: "5fc15f453b1b763994eb72cc",
    dest: "4158894",
    weight: 205.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a78",
    src: "4094150",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713d",
    dest: "4094154",
    weight: 251.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a72",
    src: "4094138",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713a",
    dest: "4094142",
    weight: 258.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a76",
    src: "4094146",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713c",
    dest: "4094150",
    weight: 250.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a70",
    src: "4094134",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7139",
    dest: "4094138",
    weight: 220.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a74",
    src: "4094142",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713b",
    dest: "4094146",
    weight: 382.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a7a",
    src: "4094154",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713e",
    dest: "4094158",
    weight: 398
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a7c",
    src: "4094158",
    edges: [
    {
    _id: "5fc15f453b1b763994eb713f",
    dest: "4094162",
    weight: 768.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a7e",
    src: "4094162",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7140",
    dest: "4094166",
    weight: 268.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a80",
    src: "4094166",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7141",
    dest: "4094170",
    weight: 242
    },
    {
    _id: "5fc15f453b1b763994eb77a0",
    dest: "4178026",
    weight: 1084.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a83",
    src: "4094170",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7142",
    dest: "4094174",
    weight: 142.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a87",
    src: "4094178",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7144",
    dest: "4094186",
    weight: 211.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a85",
    src: "4094174",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7143",
    dest: "4094178",
    weight: 340.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a8b",
    src: "4094190",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7146",
    dest: "4094194",
    weight: 246.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a8d",
    src: "4094194",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7147",
    dest: "4094198",
    weight: 282.6
    },
    {
    _id: "5fc15f453b1b763994eb75d8",
    dest: "4094730",
    weight: 321
    },
    {
    _id: "5fc15f453b1b763994eb7640",
    dest: "4175862",
    weight: 474.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a89",
    src: "4094186",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7145",
    dest: "4094190",
    weight: 552.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a91",
    src: "4094198",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7148",
    dest: "4094202",
    weight: 301.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a95",
    src: "4094206",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714a",
    dest: "4094210",
    weight: 220.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a93",
    src: "4094202",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7149",
    dest: "4094206",
    weight: 331.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aa7",
    src: "4094242",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7152",
    dest: "4094246",
    weight: 331.9
    },
    {
    _id: "5fc15f453b1b763994eb7751",
    dest: "4220610",
    weight: 590.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aa2",
    src: "4094234",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7150",
    dest: "4094238",
    weight: 194.9
    },
    {
    _id: "5fc15f453b1b763994eb758d",
    dest: "4136918",
    weight: 195.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aa0",
    src: "4094230",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714f",
    dest: "4094234",
    weight: 254.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a9b",
    src: "4094218",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714d",
    dest: "4094226",
    weight: 311
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a9d",
    src: "4094226",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714e",
    dest: "4094230",
    weight: 207
    },
    {
    _id: "5fc15f453b1b763994eb773c",
    dest: "4129310",
    weight: 314.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a99",
    src: "4094214",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714c",
    dest: "4094218",
    weight: 388.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aa5",
    src: "4094238",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7151",
    dest: "4094242",
    weight: 242.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254a97",
    src: "4094210",
    edges: [
    {
    _id: "5fc15f453b1b763994eb714b",
    dest: "4094214",
    weight: 336.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aaa",
    src: "4094246",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7153",
    dest: "4094250",
    weight: 293.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aac",
    src: "4094250",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7154",
    dest: "4094254",
    weight: 254.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aae",
    src: "4094254",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7155",
    dest: "4092214",
    weight: 422.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ab0",
    src: "4093286",
    edges: [
    {
    _id: "5fc15f453b1b763994eb715d",
    dest: "4093290",
    weight: 353.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ab2",
    src: "4093290",
    edges: [
    {
    _id: "5fc15f453b1b763994eb715e",
    dest: "4093294",
    weight: 425.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ab4",
    src: "4093294",
    edges: [
    {
    _id: "5fc15f453b1b763994eb715f",
    dest: "4093298",
    weight: 188.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ab8",
    src: "4093302",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7161",
    dest: "4186624",
    weight: 136.4
    },
    {
    _id: "5fc15f453b1b763994eb73c2",
    dest: "4093306",
    weight: 213.6
    },
    {
    _id: "5fc15f453b1b763994eb77ee",
    dest: "4093190",
    weight: 113.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ab6",
    src: "4093298",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7160",
    dest: "4093302",
    weight: 323.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254abe",
    src: "4091150",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7163",
    dest: "4091154",
    weight: 283.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254abc",
    src: "4186624",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7162",
    dest: "4091150",
    weight: 177.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ac0",
    src: "4091154",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7164",
    dest: "4175848",
    weight: 193.5
    },
    {
    _id: "5fc15f453b1b763994eb7858",
    dest: "4093166",
    weight: 334.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ac7",
    src: "4094914",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7167",
    dest: "4091362",
    weight: 204.4
    },
    {
    _id: "5fc15f453b1b763994eb721c",
    dest: "4094918",
    weight: 257.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ac5",
    src: "4094906",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7166",
    dest: "4094914",
    weight: 180.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aca",
    src: "4091362",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7168",
    dest: "4177136",
    weight: 233.8
    },
    {
    _id: "5fc15f453b1b763994eb746f",
    dest: "4094986",
    weight: 465.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254acf",
    src: "4094986",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716a",
    dest: "4094990",
    weight: 564.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ad3",
    src: "4094994",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716c",
    dest: "4095002",
    weight: 570.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ad1",
    src: "4094990",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716b",
    dest: "4094994",
    weight: 471.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254acd",
    src: "4177136",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7169",
    dest: "4094986",
    weight: 231.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ac3",
    src: "4175848",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7165",
    dest: "4094906",
    weight: 259.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ad5",
    src: "4095002",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716d",
    dest: "4095006",
    weight: 340.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ad7",
    src: "4095006",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716e",
    dest: "4095010",
    weight: 280.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ae4",
    src: "4094898",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7176",
    dest: "4093178",
    weight: 366
    },
    {
    _id: "5fc15f453b1b763994eb7219",
    dest: "4175848",
    weight: 261.5
    },
    {
    _id: "5fc15f453b1b763994eb786f",
    dest: "4093174",
    weight: 226.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ae0",
    src: "4094890",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7174",
    dest: "4094894",
    weight: 209.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aea",
    src: "4093182",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7178",
    dest: "4093186",
    weight: 194.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254adb",
    src: "4095014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7170",
    dest: "4093794",
    weight: 265.4
    },
    {
    _id: "5fc15f453b1b763994eb7962",
    dest: "4091666",
    weight: 581.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ad9",
    src: "4095010",
    edges: [
    {
    _id: "5fc15f453b1b763994eb716f",
    dest: "4095014",
    weight: 369.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ade",
    src: "4093794",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7171",
    dest: "4093774",
    weight: 205
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ae2",
    src: "4094894",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7175",
    dest: "4094898",
    weight: 347
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ae8",
    src: "4093178",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7177",
    dest: "4093182",
    weight: 255.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aec",
    src: "4093186",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7179",
    dest: "4093190",
    weight: 295.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aee",
    src: "4093190",
    edges: [
    {
    _id: "5fc15f453b1b763994eb717a",
    dest: "4093198",
    weight: 237.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254afb",
    src: "4091838",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7191",
    dest: "4094594",
    weight: 567.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254af4",
    src: "4093206",
    edges: [
    {
    _id: "5fc15f453b1b763994eb717d",
    dest: "4093210",
    weight: 391.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254afd",
    src: "4094594",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7192",
    dest: "4094598",
    weight: 208.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254af0",
    src: "4093198",
    edges: [
    {
    _id: "5fc15f453b1b763994eb717b",
    dest: "4093202",
    weight: 211
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254af9",
    src: "4091714",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7190",
    dest: "4091838",
    weight: 506.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254af6",
    src: "4093210",
    edges: [
    {
    _id: "5fc15f453b1b763994eb717e",
    dest: "4191516",
    weight: 528.6
    },
    {
    _id: "5fc15f453b1b763994eb73d5",
    dest: "4093214",
    weight: 726.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254aff",
    src: "4094598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7193",
    dest: "4094602",
    weight: 198.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254af2",
    src: "4093202",
    edges: [
    {
    _id: "5fc15f453b1b763994eb717c",
    dest: "4093206",
    weight: 388.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b01",
    src: "4094602",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7194",
    dest: "4093558",
    weight: 435.9
    },
    {
    _id: "5fc15f453b1b763994eb75b3",
    dest: "4093730",
    weight: 495.7
    },
    {
    _id: "5fc15f453b1b763994eb7621",
    dest: "4175854",
    weight: 723.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b05",
    src: "4091722",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7196",
    dest: "4094646",
    weight: 363.7
    },
    {
    _id: "5fc15f453b1b763994eb7625",
    dest: "4094750",
    weight: 464.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b08",
    src: "4094646",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7197",
    dest: "4094650",
    weight: 374.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b0a",
    src: "4094650",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7198",
    dest: "4091226",
    weight: 817.3
    },
    {
    _id: "5fc15f453b1b763994eb75bd",
    dest: "4094654",
    weight: 200.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b13",
    src: "4091782",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719c",
    dest: "4091746",
    weight: 1256.3
    },
    {
    _id: "5fc15f453b1b763994eb7633",
    dest: "4129278",
    weight: 1768.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b16",
    src: "4091746",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719d",
    dest: "4091738",
    weight: 1183.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b0d",
    src: "4091226",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7199",
    dest: "4091230",
    weight: 659.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b18",
    src: "4091738",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719e",
    dest: "4091790",
    weight: 365.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b1a",
    src: "4091790",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719f",
    dest: "4091734",
    weight: 735.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b11",
    src: "4091730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719b",
    dest: "4091782",
    weight: 676.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b0f",
    src: "4091230",
    edges: [
    {
    _id: "5fc15f453b1b763994eb719a",
    dest: "4091730",
    weight: 819.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b1c",
    src: "4091734",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a0",
    dest: "4091794",
    weight: 869.8
    },
    {
    _id: "5fc15f453b1b763994eb7638",
    dest: "4129034",
    weight: 471.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b1f",
    src: "4091794",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a1",
    dest: "4107854",
    weight: 610.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b21",
    src: "4107854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a2",
    dest: "4094742",
    weight: 584.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b2a",
    src: "4094786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a6",
    dest: "4094790",
    weight: 197.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b30",
    src: "4094798",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a9",
    dest: "4091842",
    weight: 182.9
    },
    {
    _id: "5fc15f453b1b763994eb75e9",
    dest: "4094802",
    weight: 328.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b2c",
    src: "4094790",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a7",
    dest: "4094794",
    weight: 292
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b25",
    src: "4094746",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a4",
    dest: "4091726",
    weight: 550.6
    },
    {
    _id: "5fc15f453b1b763994eb75dc",
    dest: "4094750",
    weight: 336.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b28",
    src: "4091726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a5",
    dest: "4094786",
    weight: 927.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b2e",
    src: "4094794",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a8",
    dest: "4094798",
    weight: 283.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b23",
    src: "4094742",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71a3",
    dest: "4094746",
    weight: 480.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b33",
    src: "4091842",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71aa",
    dest: "4091718",
    weight: 527.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b35",
    src: "4091718",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71ab",
    dest: "4191450",
    weight: 496.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b37",
    src: "4091758",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b1",
    dest: "4091182",
    weight: 907.4
    },
    {
    _id: "5fc15f453b1b763994eb7425",
    dest: "4091982",
    weight: 555
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b3c",
    src: "4092086",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b6",
    dest: "4092090",
    weight: 241.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b41",
    src: "4090986",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b8",
    dest: "4090990",
    weight: 141.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b3e",
    src: "4092090",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b7",
    dest: "4090986",
    weight: 482.8
    },
    {
    _id: "5fc15f453b1b763994eb7551",
    dest: "4092094",
    weight: 285.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b45",
    src: "4091002",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71ba",
    dest: "4115362",
    weight: 511.8
    },
    {
    _id: "5fc15f453b1b763994eb72fd",
    dest: "4091006",
    weight: 795.1
    },
    {
    _id: "5fc15f453b1b763994eb780c",
    dest: "4220796",
    weight: 4560.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b49",
    src: "4115362",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71bb",
    dest: "4091562",
    weight: 331.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b43",
    src: "4090990",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b9",
    dest: "4091002",
    weight: 242.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b3a",
    src: "4091182",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71b2",
    dest: "4091310",
    weight: 320.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b4b",
    src: "4091562",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71bc",
    dest: "4091566",
    weight: 773
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b4d",
    src: "4091566",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71bd",
    dest: "4091570",
    weight: 435.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b4f",
    src: "4091570",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71be",
    dest: "4091574",
    weight: 473.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b51",
    src: "4091574",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71bf",
    dest: "4192436",
    weight: 231.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b53",
    src: "4192436",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c0",
    dest: "4091578",
    weight: 309.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b59",
    src: "4091594",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c6",
    dest: "4091586",
    weight: 300.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b5d",
    src: "4192438",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c8",
    dest: "4091598",
    weight: 276.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b5b",
    src: "4091586",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c7",
    dest: "4192438",
    weight: 284.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b57",
    src: "4091590",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c2",
    dest: "4093410",
    weight: 1010.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b55",
    src: "4091578",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c1",
    dest: "4091590",
    weight: 370.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b5f",
    src: "4091598",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71c9",
    dest: "4091602",
    weight: 462
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b61",
    src: "4091602",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71ca",
    dest: "4091606",
    weight: 478
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b63",
    src: "4091606",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71cb",
    dest: "4091610",
    weight: 706.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b65",
    src: "4091610",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71cc",
    dest: "4189688",
    weight: 231.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b69",
    src: "4090978",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71ce",
    dest: "4090982",
    weight: 208.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b67",
    src: "4189688",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71cd",
    dest: "4090978",
    weight: 632.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b6b",
    src: "4090982",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71cf",
    dest: "4092074",
    weight: 779.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b6f",
    src: "4092078",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71d1",
    dest: "4092082",
    weight: 345.5
    },
    {
    _id: "5fc15f453b1b763994eb77b1",
    dest: "4094470",
    weight: 299.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b76",
    src: "4094350",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71dc",
    dest: "4094262",
    weight: 340.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b6d",
    src: "4092074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71d0",
    dest: "4092078",
    weight: 278.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b72",
    src: "4094342",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71da",
    dest: "4094346",
    weight: 238.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b7b",
    src: "4168786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71de",
    dest: "4091642",
    weight: 493
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b74",
    src: "4094346",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71db",
    dest: "4094350",
    weight: 297.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b78",
    src: "4094262",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71dd",
    dest: "4168786",
    weight: 571.7
    },
    {
    _id: "5fc15f453b1b763994eb729c",
    dest: "4094266",
    weight: 529.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b84",
    src: "4168790",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e3",
    dest: "4094318",
    weight: 525.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b82",
    src: "4091638",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e2",
    dest: "4168790",
    weight: 471
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b88",
    src: "4094322",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e5",
    dest: "4094330",
    weight: 317.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b86",
    src: "4094318",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e4",
    dest: "4094322",
    weight: 374.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b8a",
    src: "4094330",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e6",
    dest: "4094334",
    weight: 245.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b7d",
    src: "4091642",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71df",
    dest: "4191448",
    weight: 813.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b7f",
    src: "4191548",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e1",
    dest: "4091638",
    weight: 239.9
    },
    {
    _id: "5fc15f453b1b763994eb72a4",
    dest: "4191550",
    weight: 323.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b8c",
    src: "4094334",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71e7",
    dest: "4093974",
    weight: 298.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b8e",
    src: "4091546",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f1",
    dest: "4091550",
    weight: 233.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b90",
    src: "4091550",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f2",
    dest: "4091554",
    weight: 188.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b94",
    src: "4131726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f4",
    dest: "4129094",
    weight: 401.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b96",
    src: "4129094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f5",
    dest: "4131730",
    weight: 386.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b9e",
    src: "4094926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f9",
    dest: "4094930",
    weight: 261.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b9a",
    src: "4129106",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f7",
    dest: "4129102",
    weight: 195.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b92",
    src: "4091554",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f3",
    dest: "4131726",
    weight: 455.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b9c",
    src: "4129102",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f8",
    dest: "4094926",
    weight: 238.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254b98",
    src: "4131730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71f6",
    dest: "4129106",
    weight: 174.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ba0",
    src: "4094930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71fa",
    dest: "4094934",
    weight: 548.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ba2",
    src: "4094934",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71fb",
    dest: "4094938",
    weight: 211.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ba4",
    src: "4094938",
    edges: [
    {
    _id: "5fc15f453b1b763994eb71fc",
    dest: "4191506",
    weight: 260.4
    },
    {
    _id: "5fc15f453b1b763994eb7228",
    dest: "4094942",
    weight: 391.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ba7",
    src: "4094850",
    edges: [
    {
    _id: "5fc15f453b1b763994eb720e",
    dest: "4094854",
    weight: 354.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bab",
    src: "4094858",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7210",
    dest: "4094862",
    weight: 334.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bb1",
    src: "4094866",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7212",
    dest: "4094870",
    weight: 618.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bb5",
    src: "4094874",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7214",
    dest: "4094882",
    weight: 577.2
    },
    {
    _id: "5fc15f453b1b763994eb7611",
    dest: "4094402",
    weight: 221.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bb3",
    src: "4094870",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7213",
    dest: "4094874",
    weight: 505.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bad",
    src: "4094862",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7211",
    dest: "4094866",
    weight: 434
    },
    {
    _id: "5fc15f453b1b763994eb7541",
    dest: "4136942",
    weight: 303.5
    },
    {
    _id: "5fc15f453b1b763994eb76db",
    dest: "4220678",
    weight: 693.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ba9",
    src: "4094854",
    edges: [
    {
    _id: "5fc15f453b1b763994eb720f",
    dest: "4094858",
    weight: 435.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bb8",
    src: "4094882",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7215",
    dest: "4094886",
    weight: 328.3
    },
    {
    _id: "5fc15f453b1b763994eb79b8",
    dest: "4251518",
    weight: 576.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bbb",
    src: "4094886",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7216",
    dest: "4094890",
    weight: 1137.8
    },
    {
    _id: "5fc15f453b1b763994eb798c",
    dest: "4220578",
    weight: 319.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bbe",
    src: "4094918",
    edges: [
    {
    _id: "5fc15f453b1b763994eb721d",
    dest: "4093150",
    weight: 157.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bc2",
    src: "4093158",
    edges: [
    {
    _id: "5fc15f453b1b763994eb721f",
    dest: "4093162",
    weight: 140.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bc0",
    src: "4093150",
    edges: [
    {
    _id: "5fc15f453b1b763994eb721e",
    dest: "4093158",
    weight: 205.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bc6",
    src: "4093170",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7221",
    dest: "4093174",
    weight: 241.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bc8",
    src: "4093174",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7222",
    dest: "4093166",
    weight: 197.7
    },
    {
    _id: "5fc15f453b1b763994eb73cd",
    dest: "4093178",
    weight: 161.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bcb",
    src: "4093166",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7223",
    dest: "4094922",
    weight: 287.2
    },
    {
    _id: "5fc15f453b1b763994eb7835",
    dest: "4196044",
    weight: 425.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bce",
    src: "4094922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7224",
    dest: "4094926",
    weight: 203.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bc4",
    src: "4093162",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7220",
    dest: "4093170",
    weight: 150
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bd0",
    src: "4094942",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7229",
    dest: "4094946",
    weight: 246
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bd2",
    src: "4094946",
    edges: [
    {
    _id: "5fc15f453b1b763994eb722a",
    dest: "4094526",
    weight: 432.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bd7",
    src: "4094958",
    edges: [
    {
    _id: "5fc15f453b1b763994eb722e",
    dest: "4092146",
    weight: 607.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bd4",
    src: "4094950",
    edges: [
    {
    _id: "5fc15f453b1b763994eb722d",
    dest: "4094958",
    weight: 466.2
    },
    {
    _id: "5fc15f453b1b763994eb75f7",
    dest: "4220676",
    weight: 242.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bd9",
    src: "4092146",
    edges: [
    {
    _id: "5fc15f453b1b763994eb722f",
    dest: "4092150",
    weight: 325
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254be2",
    src: "4092786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb723c",
    dest: "4092790",
    weight: 192.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bdf",
    src: "4092158",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7232",
    dest: "4094966",
    weight: 608.6
    },
    {
    _id: "5fc15f453b1b763994eb7561",
    dest: "4092162",
    weight: 330.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254be4",
    src: "4092790",
    edges: [
    {
    _id: "5fc15f453b1b763994eb723d",
    dest: "4091982",
    weight: 699.2
    },
    {
    _id: "5fc15f453b1b763994eb7363",
    dest: "4164054",
    weight: 224.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bdb",
    src: "4092150",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7230",
    dest: "4092154",
    weight: 594.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bdd",
    src: "4092154",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7231",
    dest: "4092158",
    weight: 234.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254be9",
    src: "4091986",
    edges: [
    {
    _id: "5fc15f453b1b763994eb723f",
    dest: "4091990",
    weight: 144.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254be7",
    src: "4091982",
    edges: [
    {
    _id: "5fc15f453b1b763994eb723e",
    dest: "4091986",
    weight: 216.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254beb",
    src: "4091990",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7240",
    dest: "4091998",
    weight: 324.7
    },
    {
    _id: "5fc15f453b1b763994eb7428",
    dest: "4094830",
    weight: 609.4
    },
    {
    _id: "5fc15f453b1b763994eb78db",
    dest: "4220576",
    weight: 1000.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bf2",
    src: "4092002",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7242",
    dest: "4092006",
    weight: 491.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bef",
    src: "4091998",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7241",
    dest: "4092002",
    weight: 242.1
    },
    {
    _id: "5fc15f453b1b763994eb753c",
    dest: "4136946",
    weight: 816.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bf6",
    src: "4136958",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7244",
    dest: "4092014",
    weight: 553.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bfa",
    src: "4092018",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7246",
    dest: "4092022",
    weight: 321.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bfc",
    src: "4092022",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7247",
    dest: "4092026",
    weight: 326.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bf8",
    src: "4092014",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7245",
    dest: "4092018",
    weight: 507.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bf4",
    src: "4092006",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7243",
    dest: "4136958",
    weight: 358
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254bfe",
    src: "4092026",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7248",
    dest: "4092034",
    weight: 517.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c00",
    src: "4092034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7249",
    dest: "4092038",
    weight: 315.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c02",
    src: "4092038",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724a",
    dest: "4092042",
    weight: 226.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c11",
    src: "4095034",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7251",
    dest: "4095038",
    weight: 174.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c09",
    src: "4095018",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724d",
    dest: "4122546",
    weight: 228.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c0b",
    src: "4122546",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724e",
    dest: "4095022",
    weight: 311.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c04",
    src: "4092042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724b",
    dest: "4092046",
    weight: 288.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c0d",
    src: "4095022",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724f",
    dest: "4095026",
    weight: 272.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c0f",
    src: "4095026",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7250",
    dest: "4095034",
    weight: 234
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c06",
    src: "4092046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb724c",
    dest: "4095018",
    weight: 163.6
    },
    {
    _id: "5fc15f453b1b763994eb7547",
    dest: "4092050",
    weight: 254.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c15",
    src: "4095042",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7253",
    dest: "4095046",
    weight: 204
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c17",
    src: "4095046",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7254",
    dest: "4095050",
    weight: 298.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c13",
    src: "4095038",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7252",
    dest: "4095042",
    weight: 408
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c1b",
    src: "4095054",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7256",
    dest: "4095058",
    weight: 476.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c21",
    src: "4095066",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7259",
    dest: "4095074",
    weight: 244.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c1f",
    src: "4095062",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7258",
    dest: "4095066",
    weight: 538.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c1d",
    src: "4095058",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7257",
    dest: "4095062",
    weight: 342.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c25",
    src: "4095078",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725b",
    dest: "4095082",
    weight: 265.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c23",
    src: "4095074",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725a",
    dest: "4095078",
    weight: 407.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c19",
    src: "4095050",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7255",
    dest: "4095054",
    weight: 288.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c27",
    src: "4095082",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725c",
    dest: "4095086",
    weight: 580.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c29",
    src: "4095086",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725d",
    dest: "4095090",
    weight: 475.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c2b",
    src: "4095090",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725e",
    dest: "4095094",
    weight: 502.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c2d",
    src: "4095094",
    edges: [
    {
    _id: "5fc15f453b1b763994eb725f",
    dest: "4095098",
    weight: 594.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c2f",
    src: "4095098",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7260",
    dest: "4229514",
    weight: 817.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c31",
    src: "4229514",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7261",
    dest: "4095106",
    weight: 287.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c39",
    src: "4229502",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7266",
    dest: "4229506",
    weight: 365.5
    },
    {
    _id: "5fc15f453b1b763994eb77f0",
    dest: "4220792",
    weight: 807
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c35",
    src: "4229494",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7263",
    dest: "4229498",
    weight: 347.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c33",
    src: "4095106",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7262",
    dest: "4229494",
    weight: 249.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c37",
    src: "4229498",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7264",
    dest: "4093418",
    weight: 286.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c3c",
    src: "4229506",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7267",
    dest: "4230876",
    weight: 211
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c41",
    src: "4229518",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7269",
    dest: "4230880",
    weight: 576
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c3e",
    src: "4230876",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7268",
    dest: "4229518",
    weight: 1122.4
    },
    {
    _id: "5fc15f453b1b763994eb799f",
    dest: "4231808",
    weight: 750.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c47",
    src: "4229530",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726c",
    dest: "4229534",
    weight: 527.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c45",
    src: "4230884",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726b",
    dest: "4229530",
    weight: 391.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c43",
    src: "4230880",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726a",
    dest: "4230884",
    weight: 609.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c52",
    src: "4229548",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7271",
    dest: "4091766",
    weight: 247.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c4f",
    src: "4090678",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7270",
    dest: "4229548",
    weight: 414.2
    },
    {
    _id: "5fc15f453b1b763994eb778c",
    dest: "4220632",
    weight: 421.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c4b",
    src: "4229540",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726e",
    dest: "4229544",
    weight: 273.3
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c49",
    src: "4229534",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726d",
    dest: "4229540",
    weight: 266
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c4d",
    src: "4229544",
    edges: [
    {
    _id: "5fc15f453b1b763994eb726f",
    dest: "4090678",
    weight: 350
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c66",
    src: "4090722",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727b",
    dest: "4090726",
    weight: 203.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c54",
    src: "4091766",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7272",
    dest: "4229552",
    weight: 274.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c5e",
    src: "4090702",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7277",
    dest: "4090710",
    weight: 231.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c56",
    src: "4229552",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7273",
    dest: "4229556",
    weight: 308
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c5c",
    src: "4090698",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7276",
    dest: "4090702",
    weight: 310.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c64",
    src: "4229568",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727a",
    dest: "4090722",
    weight: 184
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c60",
    src: "4090710",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7278",
    dest: "4229564",
    weight: 361.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c5a",
    src: "4229560",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7275",
    dest: "4090698",
    weight: 171.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c62",
    src: "4229564",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7279",
    dest: "4229568",
    weight: 212.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c58",
    src: "4229556",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7274",
    dest: "4229560",
    weight: 535.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c6e",
    src: "4092126",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727f",
    dest: "4092130",
    weight: 278.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c6a",
    src: "4090730",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727d",
    dest: "4092122",
    weight: 537.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c68",
    src: "4090726",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727c",
    dest: "4090730",
    weight: 339
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c6c",
    src: "4092122",
    edges: [
    {
    _id: "5fc15f453b1b763994eb727e",
    dest: "4092126",
    weight: 171
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c79",
    src: "4136926",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7284",
    dest: "4136922",
    weight: 593.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c72",
    src: "4092134",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7281",
    dest: "4136934",
    weight: 393.6
    },
    {
    _id: "5fc15f453b1b763994eb755b",
    dest: "4092138",
    weight: 292.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c7b",
    src: "4136922",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7285",
    dest: "4092166",
    weight: 923.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c70",
    src: "4092130",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7280",
    dest: "4092134",
    weight: 384.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c75",
    src: "4136934",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7282",
    dest: "4136930",
    weight: 480
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c77",
    src: "4136930",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7283",
    dest: "4136926",
    weight: 632.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c7d",
    src: "4092166",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7286",
    dest: "4092170",
    weight: 252.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c7f",
    src: "4092170",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7287",
    dest: "4092174",
    weight: 211.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c83",
    src: "4092186",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7289",
    dest: "4093118",
    weight: 478.2
    },
    {
    _id: "5fc15f453b1b763994eb7444",
    dest: "4091214",
    weight: 463.7
    },
    {
    _id: "5fc15f453b1b763994eb7566",
    dest: "4092190",
    weight: 364.9
    },
    {
    _id: "5fc15f453b1b763994eb794a",
    dest: "4091182",
    weight: 747.2
    },
    {
    _id: "5fc15f453b1b763994eb79d4",
    dest: "4251516",
    weight: 2999
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c8b",
    src: "4093122",
    edges: [
    {
    _id: "5fc15f453b1b763994eb728b",
    dest: "4191470",
    weight: 391.4
    },
    {
    _id: "5fc15f453b1b763994eb73af",
    dest: "4093126",
    weight: 289.4
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c81",
    src: "4092174",
    edges: [
    {
    _id: "5fc15f453b1b763994eb7288",
    dest: "4092186",
    weight: 216.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c89",
    src: "4093118",
    edges: [
    {
    _id: "5fc15f453b1b763994eb728a",
    dest: "4093122",
    weight: 267.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c94",
    src: "4091798",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a0",
    dest: "4091806",
    weight: 344.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c8e",
    src: "4094266",
    edges: [
    {
    _id: "5fc15f453b1b763994eb729d",
    dest: "4094270",
    weight: 321.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c90",
    src: "4094270",
    edges: [
    {
    _id: "5fc15f453b1b763994eb729e",
    dest: "4094274",
    weight: 569.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c92",
    src: "4094274",
    edges: [
    {
    _id: "5fc15f453b1b763994eb729f",
    dest: "4091798",
    weight: 608.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c98",
    src: "4091830",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a2",
    dest: "4191448",
    weight: 573
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c96",
    src: "4091806",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a1",
    dest: "4091830",
    weight: 292.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ca9",
    src: "4191554",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72b2",
    dest: "4094294",
    weight: 192.1
    },
    {
    _id: "5fc15f453b1b763994eb7502",
    dest: "4191556",
    weight: 654.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ca7",
    src: "4094314",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ab",
    dest: "4094318",
    weight: 475.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c9a",
    src: "4191550",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a5",
    dest: "4191552",
    weight: 322.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c9c",
    src: "4191552",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a6",
    dest: "4094298",
    weight: 195
    },
    {
    _id: "5fc15f453b1b763994eb7501",
    dest: "4191554",
    weight: 285
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ca1",
    src: "4094302",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a8",
    dest: "4094306",
    weight: 234.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254c9f",
    src: "4094298",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a7",
    dest: "4094302",
    weight: 164.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ca5",
    src: "4094310",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72aa",
    dest: "4094314",
    weight: 343.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ca3",
    src: "4094306",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72a9",
    dest: "4094310",
    weight: 552.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cac",
    src: "4094294",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72b3",
    dest: "4091786",
    weight: 184.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cb3",
    src: "4092218",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72b7",
    dest: "4191452",
    weight: 226.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cb5",
    src: "4175880",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72ba",
    dest: "4158906",
    weight: 288.9
    },
    {
    _id: "5fc15f453b1b763994eb7755",
    dest: "4191542",
    weight: 413.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cae",
    src: "4091786",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72b4",
    dest: "4191470",
    weight: 4147.9
    },
    {
    _id: "5fc15f453b1b763994eb752c",
    dest: "4091798",
    weight: 294.9
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cb1",
    src: "4091834",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72b6",
    dest: "4092218",
    weight: 450.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cbc",
    src: "4092242",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72bd",
    dest: "4092246",
    weight: 194.7
    },
    {
    _id: "5fc15f453b1b763994eb7730",
    dest: "4220666",
    weight: 279.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cba",
    src: "4092238",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72bc",
    dest: "4092242",
    weight: 206.2
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cb8",
    src: "4158906",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72bb",
    dest: "4092238",
    weight: 205.5
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cc1",
    src: "4092250",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72bf",
    dest: "4092254",
    weight: 139
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cbf",
    src: "4092246",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72be",
    dest: "4092250",
    weight: 319.1
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cc3",
    src: "4092254",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72c0",
    dest: "4092262",
    weight: 136.6
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cc5",
    src: "4092262",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72c1",
    dest: "4092266",
    weight: 242.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cc7",
    src: "4092266",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72c2",
    dest: "4092270",
    weight: 226.8
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254cc9",
    src: "4092270",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72c3",
    dest: "4092274",
    weight: 247.7
    }
    ],
    __v: 0
    },
    {
    _id: "5fc17ba81115fd4908254ccb",
    src: "4092274",
    edges: [
    {
    _id: "5fc15f453b1b763994eb72c4",
    dest: "4094122",
    weight: 263.5
    }
    ],
    __v: 0
    }
]
    
let to =
{
    routes: [
    "4001198",
    "4008442"
    ],
    edges: [ ],
    _id: "5fc158391a026554acf0ef1f",
    stop_id: "4094138",
    name: "Eastbound NW 39th Avenue @ NW 10th Street",
    lat: 29.688434,
    long: -82.334464,
    __v: 0
    }
let from = 
{
    routes: [
    "4001238",
    "4001306"
    ],
    edges: [ ],
    _id: "5fc157d41a026554acf0eb25",
    stop_id: "4094986",
    name: "Hunters Run Apartments",
    lat: 29.612001,
    long: -82.359396,
    __v: 0
}
djikstra(from,to,graph);