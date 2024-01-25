class LCPImagePreloader {
  constructor() {
    (this.preloaded = new WeakMap()),
      (this.observer = new PerformanceObserver((e) => this.handleEntries(e)));
  }
  handleEntries(e) {
    for (const r of e.getEntries())
      if (
        "largest-contentful-paint" === r.entryType &&
        "IMG" === r.element?.tagName
      ) {
        this.maybePreloadImage(r.element), this.stop();
        break;
      }
  }
  maybePreloadImage(e) {
    !this.preloaded.has(e) &&
      e.currentSrc &&
      (this.preloadImage(e.currentSrc), this.preloaded.set(e, !0));
  }
  preloadImage(e) {
    const r = document.createElement("link");
    (r.rel = "preload"),
      (r.as = "image"),
      (r.href = e),
      (r.crossOrigin = "anonymous"),
      document.head.appendChild(r);

    /* //real code for h2 innerTxt
    let h2 = document.querySelector("h2");
    h2.innerHTML = `${e}<span class="preview"><img src="https://source.unsplash.com/random?-1-preload-me;w=1000" width="1000" height="1000" decoding="eager" fetchpriority="high" alt=""></span>`;
    */

    /*anteprima canvas - just mimick for Codepen*/
    let h2 = document.querySelector("h2");
    let originalImage = document.querySelector("img[fetchpriority='high']");
    if (
      originalImage &&
      originalImage.complete &&
      originalImage.naturalHeight !== 0
    ) {
      let canvas = document.createElement("canvas");
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      let ctx = canvas.getContext("2d");
      ctx.drawImage(originalImage, 0, 0);

      // Converti il canvas
      let clonedImageDataURL = canvas.toDataURL();

      let clonedImage = new Image();
      clonedImage.src = clonedImageDataURL;
      clonedImage.width = originalImage.width;
      clonedImage.height = originalImage.height;
      /*clonedImage.decoding = "async";
      clonedImage.loading = "lazy";
      clonedImage.fetchpriority = "low";*/
      let span = document.createElement("span");
      span.className = "preview";
      span.appendChild(clonedImage);

      h2.innerHTML = `${e}`;
      h2.appendChild(span);
    } else {
      console.error("Non riesco a creare il canvas, manca img originale");
    }

    /*fine anteprima*/
  }
  start() {
    this.observer.observe({ type: "largest-contentful-paint", buffered: !0 });
  }
  stop() {
    this.observer.disconnect();
  }
}
const lcpImagePreloader = new LCPImagePreloader();
lcpImagePreloader.start();
