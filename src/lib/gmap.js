const getSrc = (mode, params) => {
  const s1 = "grqln9-,srv,dkjfjb*^nk,i\\oq,ahaca+q0-";
  const s2 = ">ibu8";
  const kstr = "@Gw]Nx?6Mik_?UZDTB2BnPetGbgJ`ao0DMCeQAs";
  return frwd(s1) + mode + frwd(s2) + frwd(kstr) + '&' + (mode === 'place' ? 'q=' : '') + params;
};

const frwd = (s) => {
  return s
    .split("")
    .map((c, i) => {
      return String.fromCharCode(c.charCodeAt() + (i % 5) + 1);
    })
    .join("");
};

export { getSrc };
