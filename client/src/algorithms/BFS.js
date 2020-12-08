// Queue class 
class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    enqueue(element) 
    {      
        this.items.push(element); 
    }

    dequeue() 
    { 
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    }

    front() 
    { 
        // returns the Front element of  
        // the queue without removing it. 
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    }
    
    isEmpty() 
    { 
        if(this.items.length === 0)
        {
            return true;
        } 
        else return false; 
    }

}

function setMaps(maps, _predecessor, graph)
{
    for(var i = 0; i < graph.length; i++)
    {
    maps.set(graph[i].src, {neighbors: graph[i].edges});
    _predecessor.set(graph[i].src, -1);
    }
}


export function BFS(from, to, graph){
    // Containers
    var visited = new Set();
    var queue = new Queue();
    var neighbors = new Map();
    var predecessor = new Map();

    // Create maps with stop_id as the key
    setMaps(neighbors, predecessor, graph);

    queue.enqueue(from.stop_id)
    // Queue and add the starting stop_id to the visited array
    visited.add(from.stop_id);

    // Start BFS
    while(!queue.isEmpty())
    {
        var breaker = false;

        // Allow t to take on stop_id of the first one in the queue, and dequeue
        let t = queue.front();
        queue.dequeue();

        for(var i = 0; i < neighbors.get(t).neighbors.length; i++)
        {
            // Make stopID be the stop_id's of t's neighbors
            var stopID = neighbors.get(t).neighbors[i].dest;
        
            // if stopID hasn't been visited
            if(!visited.has(stopID))
            {
                
                visited.add(stopID);
                
                // Add to predecessor map to keep track of route
                predecessor.set(stopID, t);

                // Break for and while loop if stopID equals destination stop_id
                if(stopID === to.stop_id)
                {
                    breaker = true;
                }
                queue.enqueue(stopID);
            }
            
            if(breaker)
                break;
        }
        
        if(breaker)
            break;
    }

    // Create list of stops leading from source stop to destination
    var reversedPath = [];
    var stop_ID = to.stop_id;
    reversedPath.push(stop_ID);
    while (stop_ID !== from.stop_id) {
        stop_ID = predecessor.get(stop_ID);
        if (stop_ID === -1) {
            return [];
        }
        reversedPath.push(stop_ID);
    }
    let path = reversedPath.reverse();
    /*
    for (var i = 0; i < path.length; i++) {
        console.log(path[i]);
    }
    */
    return path;
}
