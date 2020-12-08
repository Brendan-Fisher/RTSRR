import stop_icon from './stop_icon.svg'
import djikstra_icon from './djikstra.svg'
import bfs_icon from './bfs.svg'
import startPin from './start.svg'
import endPin from './end.svg'
import both_icon from './both.svg'
import L from "leaflet";

/**
 * Leaflet icons for representing each path and the beginning and end of each path
 */

export var stopIcon = L.icon({
    iconUrl: stop_icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

export var both = L.icon({
    iconUrl: both_icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
})

export var startIcon = L.icon({
    iconUrl: startPin,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
})

export var finishIcon = L.icon({
    iconUrl: endPin,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
})

export var DIcon = L.icon({
    iconUrl: djikstra_icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

export var BIcon = L.icon({
    iconUrl: bfs_icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});