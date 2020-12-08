import {
    Card,
    CardBody,
    Collapse,
    CardText,
    CardTitle,
    Button,
    CardSubtitle,
  } from "reactstrap";
  import { Popup, Marker, Polyline } from "react-leaflet";
  import { startIcon, finishIcon, DIcon, BIcon, both} from "../icons/icons"


// JSX object for the "Run" button  
export function RunButton(props) {
  return (
    <Button
    color="primary"
    onClick={props.onClick}
    style={{ marginBottom: "1rem" }}
    >
      <h5><u>Run</u></h5>
    </Button>
  )
}

// JSX object for the "Reset" button
export function ResetButton(props) {
  return (
    <Button
    color={(props.pathFound) ? "success" : "danger"}
    onClick={props.onClick}
    style={{ marginBottom: "1rem" }}
    >
      <h5><u>{(props.validSearch) ? "Reset": "Select Two Stops"}</u></h5>
    </Button>
  )
}

// JSX object for the icon at the end of the path
export function FinishIcon(props){
  return (
  <Marker position={[props.nodes.to.lat, props.nodes.to.long]} icon={finishIcon}>
    <Popup>
      <h6>
        <b>{props.nodes.to.name}</b>
      </h6>
    </Popup>
  </Marker>
  )
}

// JSX object for the icon at the start of the path
export function StartIcon(props) {
    return (
    <Marker position={[props.nodes.from.lat, props.nodes.from.long]} icon={startIcon}>
        <Popup>
            <h6>
                <b>{props.nodes.from.name}</b>
            </h6>
        </Popup>
    </Marker>
    )
    
}

// JSX object for the card that appears when a path cant be found
export function Error(props) {
  return (
    <Card
      id="path-error"
      className="path-error"
      body
      inverse
      style={{
        backgroundColor: "#ffcccc",
        borderColor: "#333",
      }}>
      <CardTitle tag="h1" className="text-danger text-center">No Path Found Between the Two Points</CardTitle> <br></br>
      <CardText tag="h2" className="text-primary text-center">Consider selecting a nearby stop and search again</CardText> <br></br>
      {props.resetButton}
    </Card>
  )
}

// JSX object for the Card that appears when the path is found
export function Results(props) {
  return (
    [
      <Card id="results" className="text-center" style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle tag="h4" className="mb-2" style={{color: "white"}}>
              <u><b>Performance</b></u>
          </CardTitle>
          <br></br>
          <CardSubtitle tag="h6" className="text-danger">DjikStra's Shortest Path:</CardSubtitle>
          <CardText tag="h7" className="text-white">
              Processing time:<tab></tab> {props.dTime} ms <br></br>
              Stops on path: {props.dLength} stops
          </CardText>
          <br></br>
          <CardSubtitle tag="h6" className="text-success">Breadth-First-Search:</CardSubtitle>
          <CardText tag="h7" className="text-white">
              Processing time: <tab></tab> {props.bTime} ms <br></br>
              Stops on path: {props.bLength} stops
          </CardText>
      </Card>
    ]
  )
}

// JSX object for the card that contains the run/reset button and info on how to use the program
export function InfoCard(props) {
  return (
    <Card
    className="text-center"
      id="program-info"
      body
      inverse
      style={{
        backgroundColor: "#D3D3D3",
        borderColor: "#000000",
        position: "absolute",
      }}
    >
      <CardTitle tag="h4" className="text-muted">RTS Route Runner</CardTitle>
      <CardText style={{color: "black"}}>
        Select two markers and click "Run" to calculate the quickest route
        between the two points
      </CardText>
      {props.runButton}
      <Collapse isOpen={props.collapse}>
        <Card
          body
          inverse
          style={{
            backgroundColor: "#D3D3D3",
            border: 0,
            padding: ".25rem",
          }}
        >
          <CardBody className="text-left" style={{ padding: ".25rem" }}>
            <CardTitle tag="h4" className="text-muted">Results:</CardTitle>
            <CardSubtitle tag="h5" className="mb-2 text-primary">
              Start Location:
            </CardSubtitle>
            <CardText className="mb-2 text-primary">{props.srcName}</CardText>
            <br></br>
            <CardSubtitle tag="h5" className="mb-2" style={{color: "black"}}>
              Destination Location:
            </CardSubtitle>
            <CardText style={{color: "black"}}>{props.destName}</CardText>
          </CardBody>
        </Card>
      </Collapse>
    </Card>
  )
}

// Draws the BFS path and all the stops along it
export function BPath(props) {
  return (
    props.Path.map((stop) => (
      [
        <Marker
          position={[stop.lat, stop.long]}
          icon={BIcon}
        >
          <Popup>
          <h6>
            <b>{stop.name}</b>
          </h6>
          </Popup>
        </Marker>
        ,
        <Polyline color={'green'} positions={props.bPoly} />
      ]
    ))
  )
}

// Draws Djikstra's shortest path and all the stops along it
export function DPath(props) {
  return (
    props.Path.map((stop) => (
      [
        <Marker
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
        <Polyline color={'red'} positions={props.dPoly} />
      ]
    ))
  )
}

// Creates and draw the stops that the two paths both travel along
export function ComboPath(props) {
  var output = []
  for(var i = 0; i < props.dPath.length; i++){
      if(props.bPath.find(stop => stop.stop_id === props.dPath[i].stop_id))
      {
          output.push(props.dPath[i])
      }
  }
  
  return (
    output.map((stop) => (
      [
        <Marker
          position={[stop.lat, stop.long]}
          icon={both}
        >
          <Popup>
          <h6>
            <b>{stop.name}</b>
          </h6>
          </Popup>
        </Marker>
      ]
    ))
  )
}

export function Legend() {
  return (
    <Card
      className="text-center"
      id="legend"
      body
      inverse
      style={{
        backgroundColor: "#333",
        borderColor: "#333",
        position: "absolute",
      }}
    >
      <CardTitle tag="h4" className="text-warning"><u><b>Legend</b></u></CardTitle>
      <CardText tag="h5" className="text-success">BFS path</CardText>
      <CardText tag="h5" className="text-danger">Djikstra's path</CardText>
      <CardText tag="h5" className="text-primary">Both paths</CardText>
    </Card>
  )
}
