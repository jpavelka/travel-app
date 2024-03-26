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

const wikiCityState = (c) => {
    const abbrevs = {
        'TX': 'Texas',
        'NM': 'New Mexico',
        'AZ': 'Arizona',
        'CA': 'California',
        'UT': 'Utah',
        'WY': 'Wyoming',
        'MT': 'Montana',
        'AB': 'Alberta',
        'SD': 'South Dakota',
        'NE': 'Nebraska'
    }
    let cSplit = c.split(', ')
    if (Object.keys(abbrevs).includes(cSplit[cSplit.length - 1])) {
        cSplit[cSplit.length - 1] = abbrevs[cSplit[cSplit.length - 1]]
    }
    return cSplit.join(', ')
}

export { scrollToToday, wikiCityState }