import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
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
import { getStops, execute } from "./API";

// Error with leaflets default marker icon, had to create own marker icon
var myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
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
      collapse: false,
      zoom: 13,
      stops: [],
      path: [],
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

  // Called when "Run" button is clicked, entry point into backend pathfinding
  runProgram = (event) => {
    event.preventDefault();
    this.setState({
      collapse: !this.state.collapse,
    });
    console.log(this.state.nodes);

    if (this.searchIsValid()) {
      console.log("Searching for quickest path");
    }

    const obj = {
      start: this.state.nodes.src,
      end: this.state.nodes.dest,
    };

    execute(obj).then((result) => {
      this.setState({
        path: result,
      });
    });
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
            Run
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
          {this.state.stops.map((stop) => (
            <Marker
              key={stop.stop_id}
              position={[stop.lat, stop.long]}
              icon={myIcon}
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
                <br></br>
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
          ))}
        </MapContainer>
      </div>
    );
  }
}

export default App;
