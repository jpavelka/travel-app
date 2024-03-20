<script>
  import LeafletMap from "$lib/LeafletMap.svelte";
  import Weather from "../lib/Weather.svelte";
  import WeatherWarning from "../lib/WeatherWarning.svelte";
  import Places from "../lib/Places.svelte";
  import Timeline from "../lib/Timeline.svelte";
  import { browser } from "$app/environment";
  import { whichToShow, mapShown, timelineShown } from "$lib/stores.js";
  import { scrollToToday } from "$lib/index.js";

  const tabClick = (x) => {
    whichToShow.update(() => x);
    if (browser) {
      localStorage.setItem("tab", x);
    }
  };
</script>

<main>
  {#if browser}
    <div style="display: flex">
      <div
        class={"tab " +
          ($whichToShow === "map" ? "tabSelected" : "tabNotSelected")}
        on:click={() => {
          tabClick("map");
          if (!$mapShown) {
            mapShown.update(() => true);
          }
        }}
      >
        Map
      </div>
      <div
        class={"tab " +
          ($whichToShow === "weather" ? "tabSelected" : "tabNotSelected")}
        on:click={() => tabClick("weather")}
      >
        Weather
      </div>
      <div
        class={"tab " +
          ($whichToShow === "places" ? "tabSelected" : "tabNotSelected")}
        on:click={() => tabClick("places")}
      >
        Places
      </div>
      <div
        class={"tab " +
          ($whichToShow === "timeline" ? "tabSelected" : "tabNotSelected")}
        on:click={() => {
          tabClick("timeline");
          if (!$timelineShown) {
            timelineShown.update(() => true);
            scrollToToday();
          }
        }}
      >
        Timeline
      </div>
      <div style="border-bottom: 1pt solid black; width: 100%"></div>
    </div>
    <WeatherWarning />
    <div style="padding: 5pt">
      {#if $mapShown}
        <div style={`display:${$whichToShow === "map" ? "block" : "none"}`}>
          <LeafletMap />
        </div>
      {/if}
      <div style={`display:${$whichToShow === "weather" ? "block" : "none"}`}>
        <Weather />
      </div>
      <div style={`display:${$whichToShow === "places" ? "block" : "none"}`}>
        <Places />
      </div>
      <div style={`display:${$whichToShow === "timeline" ? "block" : "none"}`}>
        <Timeline />
      </div>
    </div>
  {:else}
    Loading page data...
  {/if}
</main>

<style>
  .tab {
    font-size: 1.4rem;
    padding: 3pt 5pt;
    width: 120px;
    border: 1pt solid black;
    border-top-left-radius: 8px 8px;
    border-top-right-radius: 8px 8px;
    text-align: center;
    cursor: pointer;
  }
  .tabNotSelected {
    background-color: #ddd;
  }
  .tabSelected {
    border-bottom: none;
  }
</style>
