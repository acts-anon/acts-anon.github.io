// Renders the video sections from window.ACTS_VIDEOS (static/js/videos.js).
(function () {
  "use strict";

  const data = window.ACTS_VIDEOS;
  let playbackRate = 0.5;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.playbackRate = playbackRate;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    },
    { rootMargin: "200px 0px" }
  );

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function videoOrPlaceholder(src, aspect) {
    if (!src) {
      const ph = el("div", "placeholder");
      ph.appendChild(el("span", null, "Video coming soon"));
      return ph;
    }
    const v = el("video");
    v.dataset.src = src;
    if (aspect) v.style.aspectRatio = aspect;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    v.preload = "none";
    v.addEventListener("loadedmetadata", () => { v.playbackRate = playbackRate; });
    observer.observe(v);
    return v;
  }

  function figure(src, caption, extraCls, aspect) {
    const f = el("figure", "clip" + (extraCls ? " " + extraCls : ""));
    f.appendChild(videoOrPlaceholder(src, aspect));
    if (caption) f.appendChild(el("figcaption", null, caption));
    return f;
  }

  function tabs(container, groups, render) {
    const bar = el("div", "tabs");
    bar.setAttribute("role", "tablist");
    const body = el("div", "tab-body");
    const buttons = data.tasks.map((t, i) => {
      const b = el("button", "tab", t.name);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.addEventListener("click", () => select(i));
      bar.appendChild(b);
      return b;
    });
    function select(i) {
      buttons.forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
      body.querySelectorAll("video").forEach((v) => observer.unobserve(v));
      body.replaceChildren(render(groups[data.tasks[i].id] || []));
    }
    container.append(bar, body);
    select(0);
  }

  function slotList(items) {
    const wrap = el("div", "clip-list");
    items.forEach((it) => wrap.appendChild(figure(it.src, it.caption, "", it.aspect)));
    return wrap;
  }

  function comparison(container, groups) {
    groups.forEach((g) => {
      const block = el("div", "compare");
      block.appendChild(el("h3", null, g.task || g.title));
      if (g.text) block.appendChild(el("p", "muted", g.text));
      g.methods.forEach((m) => block.appendChild(figure(m.src, m.name, (m.ours ? "ours" : "") + (m.narrow ? " narrow" : ""), m.aspect)));
      container.appendChild(block);
    });
  }

  function initSpeed() {
    document.querySelectorAll(".speed button").forEach((b) => {
      b.addEventListener("click", () => {
        playbackRate = parseFloat(b.dataset.rate);
        document.querySelectorAll(".speed button").forEach((o) =>
          o.setAttribute("aria-pressed", String(o === b))
        );
        document.querySelectorAll("video").forEach((v) => { v.playbackRate = playbackRate; });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    tabs(document.getElementById("short-videos"), data.shortHorizon, slotList);
    tabs(document.getElementById("long-videos"), data.longHorizon, slotList);
    comparison(document.getElementById("baseline-videos"), data.baselines);
    comparison(document.getElementById("ablation-videos"), data.ablations);
    const fail = document.getElementById("failure-videos");
    data.failures.forEach((f) => {
      const block = el("div", "compare");
      block.appendChild(el("h3", null, f.title));
      block.appendChild(figure(f.src, f.caption, "", f.aspect));
      fail.appendChild(block);
    });
    initSpeed();
  });
})();
