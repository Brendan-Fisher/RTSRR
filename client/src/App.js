import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker, Polyline } from "react-leaflet";
import {
  Card,
  CardBody,
  Collapse,
  CardText,
  CardTitle,
  Button,
  CardSubtitle,
} from "reactstrap";
import React, { Component } from "react";
import Joi from "joi";
import { getStops, Djikstra, Bfs } from "./API";
import stop_icon from './icons/stop_icon.svg'
import djikstra_icon from './icons/djikstra.svg'
import bfs_icon from './icons/bfs.svg'
import startPin from './icons/start.svg'
import endPin from './icons/end.svg'

// Custom icons for bus stops, djikstras path, and BFS path
var stopIcon = L.icon({
  iconUrl: stop_icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

var startIcon = L.icon({
  iconUrl: startPin,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
})

var finishIcon = L.icon({
  iconUrl: endPin,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
})

var DIcon = L.icon({
  iconUrl: djikstra_icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

var BIcon = L.icon({
  iconUrl: bfs_icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Schema validates if "Run" button should be clickable
const schema = Joi.object().keys({
  start: Joi.string().min(7).max(7).required(),
  end: Joi.string().min(7).max(7).required(),
});

class App extends Component {
  constructor(props) {
    super(props);
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

  // When page loads, get stops from database and attach them to program state
  componentDidMount() {
    getStops().then((stops) => {
      this.setState({
        stops,
      });
    });
  }

  // Set the start node when stop is selected from map
  setSrc(i) {
    this.setState({
      nodes: {
        ...this.state.nodes,
        from: i,
        srcName: i.name,
      },
    });
  }

  // Set the destination node when stop is selected from map
  setDest(i) {
    this.setState({
      nodes: {
        ...this.state.nodes,
        to: i,
        destName: i.name,
      },
    });
  }

  // Validate whether a start and a destination node have been selected
  searchIsValid = () => {
    const searchPair = {
      start: this.state.nodes.from.stop_id,
      end: this.state.nodes.to.stop_id,
    };
    const result = schema.validate(searchPair);

    return result.error ? false : true;
  };

  DjikstraPolyMaker = (path) => {
    var output = [];
    for(var i = 0; i < path.length-1; i++){
      output.push([path[i].lat, path[i].long]);
    }
    return output;
  }

  // Called when "Run" button is clicked, entry point into backend pathfinding
  runProgram = (event) => {
    event.preventDefault();
    this.setState({
      collapse: !this.state.collapse,
    });

    const obj = {
      from: this.state.nodes.from,
      to: this.state.nodes.to,
    };

    Djikstra(obj).then((result) => {
      this.setState({
        paths: {
          ...this.state.paths,
          dPath: result.slice(0, result.length-1),
          dTime: result.slice(result.length-1)
        },
        executed: !this.state.executed,
        dPoly: this.DjikstraPolyMaker(result)
      });
    });

    /*
    Bfs(obj).then((result) => {
      this.setState({
        paths: {
          ...this.state.paths,
          bPath: result.slice(0, result.length-1),
          bTime: result.slice(result.length-1)
        },
      });
    })
    */
  };


  // What is loaded onto page
  render() {
    // Where the map is centered when the page loads
    const position = [this.state.location.lat, this.state.location.long];
    return (
      <div className="map">
        <Card
          className="program-info"
          body
          inverse
          style={{
            backgroundColor: "#333",
            borderColor: "#333",
            position: "absolute",
          }}
        >
          <CardTitle tag="h4">RTS Route Runner</CardTitle>
          <CardText>
            Select two markers and click "Run" to calculate the quickest route
            between the two points
          </CardText>
          <Button
            color="primary"
            onClick={this.runProgram}
            style={{ marginBottom: "1rem" }}
            disabled={!this.searchIsValid()}
          >
            {
            !this.state.executed ? 
              <h5><u>Run</u></h5>
              :
              <h5><u>Reset</u></h5>
            }
          </Button>
          <Collapse isOpen={this.state.collapse}>
            <Card
              body
              inverse
              style={{
                backgroundColor: "#333",
                borderColor: "white",
                padding: ".25rem",
              }}
            >
              <CardBody style={{ padding: ".25rem" }}>
                <CardTitle tag="h4">Results:</CardTitle>
                <CardSubtitle tag="h5" className="mb-2">
                  Start Location:
                </CardSubtitle>
                <CardText>{this.state.nodes.srcName}</CardText>
                <CardSubtitle tag="h5" className="mb-2" color="0384fc">
                  Destination Location:
                </CardSubtitle>
                <CardText>{this.state.nodes.destName}</CardText>
                <CardSubtitle tag="h5" className="mb-2">
                  Performance:
                </CardSubtitle>
                <CardText>
                  Time for Djikstra's algorithm: <tab></tab> {this.state.paths.dTime} ms
                </CardText>
              </CardBody>
            </Card>
          </Collapse>
        </Card>

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

          {
          !this.state.executed ?
            this.state.stops.map((stop) => (
              <Marker
                key={stop.stop_id}
                position={[stop.lat, stop.long]}
                icon={stopIcon}
              >
                <Popup>
                  <Button
                    onClick={() => this.setSrc(stop)}
                    id="source"
                    color="primary"
                    size="sm"
                    block
                  >
                    Set Start
                  </Button>
                  
                  <Button
                    onClick={() => this.setDest(stop)}
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
            this.state.paths.dPath.map((stop) => (
              [
                <Marker
                  key={stop.stop_id}
                  position={[stop.lat, stop.long]}
                  icon={DIcon}
                >
                  <Popup>
                  <h6>
                    <b>{stop.name}</b>
                  </h6>
                  </Popup>
                </Marker>
                ,
                <Marker position={[this.state.nodes.to.lat, this.state.nodes.to.long]} icon={finishIcon}>
                  <Popup>
                    <h6>
                        <b>{this.state.nodes.to.name}</b>
                    </h6>
                  </Popup>
                </Marker>
                ,
                <Marker position={[this.state.nodes.from.lat, this.state.nodes.from.long]} icon={startIcon}>
                  <Popup>
                    <h6>
                        <b>{this.state.nodes.from.name}</b>
                    </h6>
                  </Popup>
                </Marker>,
                <Polyline color={'black'} positions={this.state.dPoly} />
              ]
            ))
          }
        </MapContainer>
      </div>
    );
  }
}

export default App;
