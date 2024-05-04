const getIcons = (L) => {
  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const goldIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const grayIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const redIconSmall = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [1, -25],
    shadowSize: [30, 30]
  });
  const invisibleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
    shadowSize: [0, 0]
  });
  return {
    blue: blueIcon,
    gold: goldIcon,
    gray: grayIcon,
    green: greenIcon,
    redSmall: redIconSmall,
    invisible: invisibleIcon
  }
}

const addMarkerToMap = ({L, map, d, color, popupText = undefined,  maxZoom = undefined}) => {
    const icons = getIcons(L);

    const opts = { icon: icons[color] };
    const txtMrk = L.marker([d.lat, d.lng], { opacity: 0 });
    
    if (!!d.date && `${d.date}` !== 'Invalid Date') {
      txtMrk.bindTooltip(
        d.date.toLocaleDateString().split("/").slice(0, 2).join("/"),
        { permanent: true, className: "date-label", offset: [1, 0] },
      );
      txtMrk.addTo(map);
    }
    const mrk = L.marker([d.lat, d.lng], opts);
    if (!!popupText) {
      mrk.bindPopup(popupText);
    }
    mrk.addTo(map);

    if (!!maxZoom) {
      map.on('zoomend', function() {
        var currentZoom = map.getZoom();
        if (currentZoom < maxZoom) {
          mrk.setIcon(icons['invisible'])
        } else {
          mrk.setIcon(icons[color])
        }
      })
    }
}

const addLineToMap = ({L, map, fromD, toD, lineColor, popupText = undefined}) => {
  const line = L.polyline(
    [
      [fromD.lat, fromD.lng],
      [toD.lat, toD.lng],
    ],
    { color: lineColor, weight: 8 },
  );
  line.addTo(map);
  if (!!popupText) {
    const clickLine = L.polyline(
      [
        [fromD.lat, fromD.lng],
        [toD.lat, toD.lng],
      ],
      { opacity: 0, weight: 30 },
    );
    clickLine.bindPopup(popupText);
    clickLine.addTo(map);
  }
}

export { addMarkerToMap, addLineToMap }