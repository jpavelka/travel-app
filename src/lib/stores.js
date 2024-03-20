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

const dateData = getDateData(new Date());
const dayInd = Math.floor(new Date().getHours() / 24 * dateData.length);
const placesInd = writable(dateData[dayInd].dataInd);
const placesMapType = writable("loc");

placesInd.subscribe(() => {
  placesMapType.update(() => "loc");
})

const mapShown = writable(whichToShowInit === "map");

const timelineShown = writable(whichToShowInit === "timeline");
const timelineScrollAmt = writable(0);

export { placesInd, whichToShow, mapShown, placesMapType, timelineShown, timelineScrollAmt };
