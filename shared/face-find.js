/* D250FaceFind: finds the face in a photo, in the browser (pico.js, shared/vendor/pico).
   Load ../shared/vendor/pico/pico.js first, set D250FaceFind.root ("../" below the site root).
   D250FaceFind.find(img) -> Promise of {x, y, size} in the image's own pixels (center and width of the face), or null. */
(function(){
  const F = window.D250FaceFind = {root:"../"};
  let classify = null;
  const load = () => classify || (classify = fetch(F.root + "shared/vendor/pico/facefinder")
    .then(r => { if (!r.ok) throw new Error("facefinder " + r.status); return r.arrayBuffer(); })
    .then(b => pico.unpack_cascade(new Int8Array(b)))
    .catch(e => { classify = null; throw e; }));

  F.find = async function(img){
    if (!window.pico) return null;
    const cls = await load();
    const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
    if (!W || !H) return null;
    const k = Math.min(1, 640 / Math.max(W, H));          // work on a small copy, it is fast and plenty
    const w = Math.max(1, Math.round(W * k)), h = Math.max(1, Math.round(H * k));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d", {willReadFrequently:true}); ctx.drawImage(img, 0, 0, w, h);
    const rgba = ctx.getImageData(0, 0, w, h).data, gray = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) gray[i] = (2 * rgba[4 * i] + 7 * rgba[4 * i + 1] + rgba[4 * i + 2]) / 10;
    const image = {pixels:gray, nrows:h, ncols:w, ldim:w}, short = Math.min(w, h);
    let dets = pico.run_cascade(image, cls, {shiftfactor:.08, minsize:Math.max(20, short * .08), maxsize:short, scalefactor:1.08});
    dets = pico.cluster_detections(dets, .2).filter(d => d[3] > 20);
    if (!dets.length) return null;
    // a portrait has one main face: favor the strongest, then the biggest
    dets.sort((a, b) => b[3] * b[2] - a[3] * a[2]);
    const [r, col, s] = dets[0];
    return {x:col / k, y:r / k, size:s / k};
  };
})();
