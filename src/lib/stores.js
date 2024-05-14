import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { getDateData } from "$lib/getTripData";

let whichToShowInit = "map";
if (browser) {
  const ls = localStorage.getItem("tab");
  if (!!ls && ls !== "") {
    whichToShowInit = ls;
  }
}
const whichToShow = writable(whichToShowInit);

let placesTabInit = "map";
if (browser) {
  const ls = localStorage.getItem("placesTab");
  if (!!ls && ls !== "") {
    placesTabInit = ls;
  }
}
const placesTab = writable(placesTabInit);

const dateData = getDateData(new Date());
const dayInd = Math.floor(new Date().getHours() / 24 * dateData.length);
const placesInd = writable(dateData[dayInd].allPlacesInd);
const placesMapType = writable("poi");

placesInd.subscribe(() => {
  placesMapType.update(() => "poi");
  try {
    const placesImgEl = document.getElementById('placeImgsContainer');
    placesImgEl.scrollTop = 0;
    placesImgEl.style.height = `${Math.ceil(window.innerHeight - placesImgEl.getBoundingClientRect().top - window.scrollY)}px`;
  } catch {}
})

const mapShown = writable(whichToShowInit === "map");

const timelineShown = writable(whichToShowInit === "timeline");
const timelineScrollAmt = writable(0);

export { placesInd, whichToShow, mapShown, placesMapType, timelineShown, timelineScrollAmt, placesTab };
