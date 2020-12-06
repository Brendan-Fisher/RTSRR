
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
        if(this.items.length == 0)
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
    
    var visited = new Set();
    var queue = new Queue();
    var neighbors = new Map();
    var predecessor = new Map();

    setMaps(neighbors, predecessor, graph);

    queue.enqueue(from.stop_id)

    visited.add(from.stop_id);
    
    
    while(!queue.isEmpty())
    {
        var breaker = false;
        let t = queue.front();
        queue.dequeue();

        for(var i = 0; i < neighbors.get(t).neighbors.length; i++)
        {
            
            var source = neighbors.get(t).neighbors[i].dest;
            

            if(!visited.has(source))
            {
                
                visited.add(source);
                
                predecessor.set(source, t);
                if(source === to.stop_id)
                {
                    breaker = true;
                }
                queue.enqueue(source);
            }
            
            if(breaker)
                break;
        }
        
        if(breaker)
            break;
        
        

    }

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
    for (var i = 0; i < path.length; i++) {
        console.log(path[i]);
    }
    return path;
}


console.log(BFS(from, to, graph));