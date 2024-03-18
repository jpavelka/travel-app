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

const placesInd = writable(getDateData()[0].dataInd);

export { placesInd, whichToShow };
