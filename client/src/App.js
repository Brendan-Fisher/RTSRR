import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { Button } from "reactstrap";
import React, { Component } from "react";
import Joi from "joi";
import { getStops, Djikstra, Bfs, PolyMaker } from "./API";
import { stopIcon } from "./icons/icons"
import { ResetButton, RunButton, Error, Results, InfoCard, StartIcon, FinishIcon, DPath, BPath, Legend, ComboPath } from './components/components'

// Schema validates if "Run" or "Reset" button should be displayed
const schema = Joi.object().keys({
  start: Joi.string().min(7).max(7).required(),
  end: Joi.string().min(7).max(7).required(),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.handleRunClick = this.handleRunClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleDestClick = this.handleDestClick.bind(this);
    this.state = {
      location: {
        lat: 29.6516,
        long: -82.3248,
      },
      nodes: {
        from: {},
        to: {},
        srcName: "",
        destName: "",
      },
      executed: false,
      collapse: false,
      zoom: 13,
      stops: [],
      noPath: true,
      paths: {
        dPath: [],
        dTime: 0,
        bPath: [],
        bTime: 0,
      },
      dPoly: [],
      bPoly: [],
    };
  }

  // Handler for when the user wants to search for a path 
  handleRunClick(e){
    e.preventDefault()
    this.setState({
      collapse: !this.state.collapse,
      executed: true,
      noPath: false,
    });

    const obj = {
      from: this.state.nodes.from,
      to: this.state.nodes.to,
    };

    // Calls Djikstra's algrithm then sets the dPath, dTime, and dPoly state variables for use later 
    Djikstra(obj).then((result) => {
      if(result.length > 0){
        this.setState({
          paths: {
            ...this.state.paths,
            dPath: result.slice(0, result.length-1),
            dTime: result.slice(result.length-1)
          },
          dPoly: PolyMaker(result),
          noPath: false,
        });
      }
      else {
        this.setState({
          noPath: true,
        })
      }
    });

    // Calls Djikstra's algrithm then sets the bPath, bTime, and bPoly state variables for use later 
    Bfs(obj).then((result) => {
      if(result.length > 0) {
        this.setState({
          paths: {
            ...this.state.paths,
            bPath: result.slice(0, result.length-1),
            bTime: result.slice(result.length-1)
          },
          bPoly: PolyMaker(result),
          noPath: false,
        });
      }
      else {
        this.setState({
          noPath: true
        })
      }
    })
  }

  // Handler for when the user wants to reset the state variables for another search
  handleResetClick(e){
    e.preventDefault()
    this.clearState();
  }

  // Handler for when the user selects a stop as the start of their route
  handleStartClick(stop){
    this.setState({
      nodes: {
        ...this.state.nodes,
        from: stop,
        srcName: stop.name,
      },
    });
  }

  // Handler for when the user selects a stop as the destination of their route
  handleDestClick(stop){
    this.setState({
      nodes: {
        ...this.state.nodes,
        to: stop,
        destName: stop.name,
      },
    });
  }

  // When page loads, get stops from database and attach them to program state
  componentDidMount() {
    getStops().then((stops) => {
      this.setState({
        stops,
      });
    });
  }

  // Validate whether a start and a destination node have been selected
  searchIsValid(){
    const searchPair = {
      start: this.state.nodes.from.stop_id,
      end: this.state.nodes.to.stop_id,
    };
    const result = schema.validate(searchPair);

    return result.error ? false : true;
  };

  // Helper function to clear the state variables when the user clicks "Reset"
  clearState(){
    this.setState({
      nodes: {
        from: {},
        to: {},
        srcName: "",
        destName: "",
      },
      executed: false,
      collapse: false,
      paths: {
        dPath: [],
        dTime: 0,
        bPath: [],
        bTime: 0,
        comboPath: [],
      },
      dPoly: [],
      bPoly: [],
      noPath: true,
    })
  }

  // What is loaded onto page
  render() {
    // Where the map is centered when the page loads
    const position = [this.state.location.lat, this.state.location.long];
    var isExecuted = this.state.executed;
    var pathFound = !this.state.noPath;
    var drawPaths = false;
    let runButton, errorCard, resultCard, BFSpath, Djikpath, Combopath;

    // JSX element that stores the Legend
    let legend = <Legend />

    // Conditional statement that decides if "Run" or "Reset" should be displayed
    if(this.searchIsValid() && !isExecuted){
      runButton = <RunButton onClick={this.handleRunClick} />
    }
    else {
      runButton = <ResetButton validSearch={this.searchIsValid()} onClick={this.handleResetClick} pathFound={pathFound} />
    } 

    // Determines whether "Run" has been clicked and if a path has been found
    if(isExecuted && pathFound) drawPaths = true;
    
    // If the previous statement evaluated true, Create the JSX elements that store the 3 paths to be displayed on the map
    if(drawPaths) {
      if(pathFound){
        Combopath = <ComboPath dPath={this.state.paths.dPath} bPath={this.state.paths.bPath}/>
        BFSpath = <BPath Path={this.state.paths.bPath} bPoly={this.state.bPoly} />
        Djikpath = <DPath Path={this.state.paths.dPath} dPoly={this.state.dPoly} />
      } 
    }

    // Displays either the error card or the result card depending on if a path has been found
    if(isExecuted && !pathFound){
      errorCard = <Error resetButton={runButton}/>
    }
    else if(pathFound){
      resultCard = <Results dTime={this.state.paths.dTime} bTime={this.state.paths.bTime} dLength={this.state.paths.dPath.length} bLength={this.state.paths.bPath.length} />
    }
    
    // JSX elements that store the icons for the beginning and end of the route
    let begIcon = <StartIcon nodes={this.state.nodes} />
    let endIcon = <FinishIcon nodes={this.state.nodes} />

    // JSX element that stores the card with information about how to use the program 
    let infoCard = <InfoCard srcName={this.state.nodes.srcName} destName={this.state.nodes.destName} collapse={this.state.collapse} results={resultCard} runButton={runButton} />;

    /**
     * Whats printed on the page:
     *  MapContainer: Contains the actual map and all objects on it
     *    TileLayer: The images that actually contain the map
     *    
     */ 
    return (
      <div className="map">
        {infoCard}
        <MapContainer
          className="map"
          center={position}
          zoom={this.state.zoom}
          scrollWheelZoom={true}
        >

          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { // Map all of the stops and take care of user choosing a start and a destination stop 
            !this.state.executed ?
              this.state.stops.map((stop) => (
                <Marker
                  key={stop.stop_id}
                  position={[stop.lat, stop.long]}
                  icon={stopIcon}
                >
                  <Popup>
                    <Button
                      onClick={() => this.handleStartClick(stop)}
                      id="source"
                      color="primary"
                      size="sm"
                      block
                    >
                      Set Start
                    </Button>
                    
                    <Button
                      onClick={() => this.handleDestClick(stop)}
                      id="destination"
                      color="primary"
                      size="sm"
                      block
                    >
                      Set Destination
                    </Button>

                    <h6>
                      <em>
                        <b>{stop.name}</b>
                      </em>
                    </h6>

                  </Popup>

                </Marker>
              ))
            :
            console.log("Program is pathfinding")
          }
          { // Draw the Paths or display the error card using the JSX elements loaded earlier
            drawPaths && isExecuted ? 
            [
              begIcon
              ,
              endIcon
              ,
              BFSpath
              ,
              Djikpath
              ,
              legend
              ,
              resultCard
              ,
              Combopath              
            ]
            :
              errorCard
          }
        </MapContainer>
      </div>
    );
  }
}

export default App;
