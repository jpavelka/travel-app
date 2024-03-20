<script>
  import { tripData } from "$lib/getTripData.js";
  import { onMount } from "svelte";
  import { timelineScrollAmt } from "$lib/stores.js";
  import { scrollToToday } from "$lib/index.js";
  import dayjs from "dayjs";

  const labelWidth = 105;
  const dayLen = 80;

  const cgColors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];
  let lastEnd = 0;
  let cgData = [];
  let elecData = [];
  let sewerData = [];
  let laundryData = [];
  let showerData = [];
  const dayData = [{ dt: dayjs($tripData[0].date), x: -dayLen / 2 }];
  const blue = "#1f77b4";
  const yellow = "#bcbd22";
  const red = "#d62728";
  const gray = "#7f7f7f";
  let tlScrollAmt = undefined;
  for (const i in $tripData) {
    const td = $tripData[i];
    const lineLen = dayLen * td.nights;
    let nightEnd = 0;
    while (nightEnd < td.nights) {
      const lastDay = dayData[dayData.length - 1];
      dayData.push({ dt: lastDay.dt.add(1, "days"), x: lastDay.x + dayLen });
      if (new Date(lastDay.dt).toDateString() === new Date().toDateString()) {
        const amt = dayData[dayData.length - 1].x - 1.5 * dayLen;
        timelineScrollAmt.update(() => amt);
        tlScrollAmt = amt;
      }
      nightEnd += 1;
    }
    const common = { x1: lastEnd, x2: lastEnd + lineLen, dataInd: i };
    cgData.push({
      ...common,
      ...{ color: cgColors[i % cgColors.length], text: td.campground },
    });
    const elec = td.electric.toLowerCase();
    elecData.push({
      ...common,
      ...{
        color:
          elec === "50a"
            ? blue
            : elec === "30a"
              ? yellow
              : elec === "no"
                ? red
                : gray,
        text: td.electric,
      },
    });
    const sew = td.sewer.toLowerCase();
    sewerData.push({
      ...common,
      ...{
        color: sew === "yes" ? blue : sew === "no" ? red : gray,
        text: td.sewer,
      },
    });
    const laund = td.laundry.toLowerCase();
    laundryData.push({
      ...common,
      ...{
        color: laund === "yes" ? blue : laund === "no" ? red : gray,
        text: td.laundry,
      },
    });
    const shw = td.showers.toLowerCase();
    showerData.push({
      ...common,
      ...{
        color: shw === "yes" ? blue : shw === "no" ? red : gray,
        text: td.showers,
      },
    });
    lastEnd += lineLen;
  }

  onMount(() => {
    scrollToToday();
  });
  const yVals = [20, 80, 140, 200, 260];
  const totalHeight = Math.max(...yVals) + 60;
  const strokeWidth = 20;
  const textYDeflect = 5;
</script>

<div
  style={`height:${totalHeight}px;width=100%;border:1pt solid black;padding:5pt 2pt;display:flex`}
>
  <div>
    <svg height={totalHeight} width={labelWidth} style="">
      <text x={labelWidth - 5} y={yVals[0] + textYDeflect} text-anchor="end"
        >Campground</text
      >
      <text x={labelWidth - 5} y={yVals[1] + textYDeflect} text-anchor="end"
        >Electric</text
      >
      <text x={labelWidth - 5} y={yVals[2] + textYDeflect} text-anchor="end"
        >Sewer</text
      >
      <text x={labelWidth - 5} y={yVals[3] + textYDeflect} text-anchor="end"
        >Laundry</text
      >
      <text x={labelWidth - 5} y={yVals[4] + textYDeflect} text-anchor="end"
        >Showers</text
      >
    </svg>
  </div>
  <div id="timelineDiv" style="overflow-x:auto;overflow-y:hidden;">
    <svg height={totalHeight} width={lastEnd} style="">
      {#each dayData.slice(1) as d}
        <line
          x1={d.x}
          x2={d.x}
          y1={0}
          y2={totalHeight - 40}
          style={"stroke:lightgray;stroke-width:1px"}
        />
        <text x={d.x} y={totalHeight - 25} text-anchor="middle"
          >{d.dt.format("ddd M/D")}</text
        >
      {/each}
      {#each cgData as d}
        <line
          x1={d.x1}
          x2={d.x2}
          y1={yVals[0]}
          y2={yVals[0]}
          style={`stroke:${d.color};stroke-width:${strokeWidth}px`}
        />
        <text
          x={d.x1}
          y={yVals[0] + textYDeflect}
          text-anchor="left"
          style="fill:white"
          >{"\u00A0\u00A0" +
            Array(10)
              .fill(d.text)
              .join(
                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
              )}</text
        >
      {/each}
      {#each elecData as d}
        <line
          x1={d.x1}
          x2={d.x2}
          y1={yVals[1]}
          y2={yVals[1]}
          style={`stroke:${d.color};stroke-width:${strokeWidth}px`}
        />
        <text
          x={d.x1}
          y={yVals[1] + textYDeflect}
          text-anchor="left"
          style="fill:white"
          >{"\u00A0\u00A0" +
            Array(10)
              .fill(d.text)
              .join(
                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
              )}</text
        >
      {/each}
      {#each sewerData as d}
        <line
          x1={d.x1}
          x2={d.x2}
          y1={yVals[2]}
          y2={yVals[2]}
          style={`stroke:${d.color};stroke-width:${strokeWidth}px`}
        />
        <text
          x={d.x1}
          y={yVals[2] + textYDeflect}
          text-anchor="left"
          style="fill:white"
          >{"\u00A0\u00A0" +
            Array(10)
              .fill(d.text)
              .join(
                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
              )}</text
        >
      {/each}
      {#each laundryData as d}
        <line
          x1={d.x1}
          x2={d.x2}
          y1={yVals[3]}
          y2={yVals[3]}
          style={`stroke:${d.color};stroke-width:${strokeWidth}px`}
        />
        <text
          x={d.x1}
          y={yVals[3] + textYDeflect}
          text-anchor="left"
          style="fill:white"
          >{"\u00A0\u00A0" +
            Array(10)
              .fill(d.text)
              .join(
                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
              )}</text
        >
      {/each}
      {#each showerData as d}
        <line
          x1={d.x1}
          x2={d.x2}
          y1={yVals[4]}
          y2={yVals[4]}
          style={`stroke:${d.color};stroke-width:${strokeWidth}px`}
        />
        <text
          x={d.x1}
          y={yVals[4] + textYDeflect}
          text-anchor="left"
          style="fill:white"
          >{"\u00A0\u00A0" +
            Array(10)
              .fill(d.text)
              .join(
                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
              )}</text
        >
      {/each}
    </svg>
  </div>
</div>
<button
  on:click={() => scrollToToday(tlScrollAmt)}
  style="padding:3pt;margin-top:5pt">Scroll to Today</button
>
