<script>
  import LeafletMap from "$lib/LeafletMap.svelte";
  import Weather from "../lib/Weather.svelte";
  import WeatherWarning from "../lib/WeatherWarning.svelte";
  import { tripWeatherData } from "$lib/getTripData";
  $: whichToShow = "map";
  const tabClick = (x) => {
    whichToShow = x;
  };
</script>

<main>
  <div style="display: flex">
    <div
      class={"tab " +
        (whichToShow === "map" ? "tabSelected" : "tabNotSelected")}
      on:click={() => tabClick("map")}
    >
      Map
    </div>
    <div
      class={"tab " +
        (whichToShow === "weather" ? "tabSelected" : "tabNotSelected")}
      on:click={() => tabClick("weather")}
    >
      Weather
    </div>
    <div style="border-bottom: 1pt solid black; width: 100%"></div>
  </div>
  <WeatherWarning />
  {#if whichToShow === "map"}
    <div style="padding: 5pt">
      <LeafletMap />
    </div>
  {:else if whichToShow === "weather"}
    <Weather />
  {/if}
</main>

<style>
  .tab {
    font-size: 1.4rem;
    padding: 4pt;
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
