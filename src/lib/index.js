import { timelineScrollAmt, timelineShown } from "$lib/stores.js";
import { get } from "svelte/store";

const scrollToToday = (amt) => {
    const el = document.getElementById("timelineDiv");
    if (!amt && get(timelineShown) && !!el && !!get(timelineScrollAmt)) {
        setTimeout(() => {
            el.scrollLeft = get(timelineScrollAmt);
            timelineScrollAmt.update(() => undefined);
        }, 50)
    } else {
        el.scrollLeft = amt;
    }
};

export { scrollToToday }