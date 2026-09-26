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
      if (g.force) block.appendChild(forceChart(g.force, block.querySelector("video")));
      container.appendChild(block);
    });
  }

  const SVG_NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs, text) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  // Recorded normal force over the 16-frame window; the playhead follows `video`.
  function forceChart(force, video) {
    const W = 640, H = 190, L = 44, R = 22, T = 16, B = 34;
    const n = force.left.length;
    const peak = Math.max(...force.left, ...force.right, 0.5);
    const yMax = Math.ceil(peak * 1.15);
    const x = (i) => L + (i / (n - 1)) * (W - L - R);
    const y = (f) => T + (1 - f / yMax) * (H - T - B);

    const s = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "force-chart", role: "img",
      "aria-label": "Recorded normal force for the left and right sensors" });
    const split = x((n / 2) - 0.5);
    s.appendChild(svg("rect", { x: L, y: T, width: split - L, height: H - T - B, class: "fc-history" }));
    s.appendChild(svg("text", { x: (L + split) / 2, y: T + 13, class: "fc-note" }, "history"));
    s.appendChild(svg("text", { x: (split + W - R) / 2, y: T + 13, class: "fc-note" }, "predicted"));
    [0, yMax / 2, yMax].forEach((v) => {
      s.appendChild(svg("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "fc-grid" }));
      s.appendChild(svg("text", { x: L - 8, y: y(v) + 4, class: "fc-tick", "text-anchor": "end" }, String(+v.toFixed(1))));
    });
    s.appendChild(svg("line", { x1: L, x2: W - R, y1: y(0.5), y2: y(0.5), class: "fc-thresh" }));
    [[0, "0 s"], [(n - 1) / 2, "0.5 s"], [n - 1, "1.0 s"]].forEach(([i, label]) =>
      s.appendChild(svg("text", { x: x(i), y: H - B + 18, class: "fc-tick", "text-anchor": "middle" }, label)));
    s.appendChild(svg("text", { x: 12, y: (T + H - B) / 2, class: "fc-tick", "text-anchor": "middle",
      transform: `rotate(-90 12 ${(T + H - B) / 2})` }, "force (N)"));
    [["left", "fc-left"], ["right", "fc-right"]].forEach(([k, cls]) => {
      const pts = force[k].map((f, i) => `${x(i).toFixed(1)},${y(f).toFixed(1)}`).join(" ");
      s.appendChild(svg("polyline", { points: pts, class: cls }));
    });
    const head = svg("line", { x1: L, x2: L, y1: T, y2: H - B, class: "fc-head" });
    s.appendChild(head);

    if (video) {
      const tick = () => {
        if (video.duration) {
          const px = L + (video.currentTime / video.duration) * (W - L - R);
          head.setAttribute("x1", px);
          head.setAttribute("x2", px);
        }
        if (!video.paused) requestAnimationFrame(tick);
      };
      video.addEventListener("play", () => requestAnimationFrame(tick));
      video.addEventListener("seeked", tick);
    }

    const f = el("figure", "fig plot");
    f.appendChild(s);
    const cap = el("figcaption");
    cap.innerHTML = '<span class="key fc-left-key"></span>left sensor &nbsp; ' +
      '<span class="key fc-right-key"></span>right sensor &nbsp; ' +
      '<span class="key fc-thresh-key"></span>0.5 N contact threshold. Recorded normal force for this window; ' +
      "the vertical line follows the ACTS video.";
    f.appendChild(cap);
    return f;
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
    const robot = document.getElementById("robot-videos");
    data.robot.forEach((r) => robot.appendChild(figure(r.src, r.caption, "", r.aspect)));
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
