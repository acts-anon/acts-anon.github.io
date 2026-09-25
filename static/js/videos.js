// Video manifest. This is the only file you need to edit to add results.
//
// - Put the .mp4 under static/videos/<folder>/ and set `src` to its path.
// - Optional `aspect: "W / H"` if a clip is not 1280x576.
// - `src: null` renders a "coming soon" placeholder with the same layout.
// - Keep filenames free of spaces, usernames, dates of real people, lab names.
//
// Layout of each clip: top row = ground truth, bottom row = ACTS prediction;
// columns = scene, wrist L, wrist R, tactile L, tactile R.

window.ACTS_VIDEOS = {
  tasks: [
    { id: "pusht", name: "PushT" },
    { id: "rope", name: "Rope" },
    { id: "motherboard", name: "Motherboard" },
  ],

  // 5 slots per task.
  shortHorizon: {
    pusht: [
      { src: "static/videos/pusht/pusht_e013_01_short.mp4", caption: "Sample 1" },
      { src: "static/videos/pusht/pusht_e013_02_short.mp4", caption: "Sample 2" },
      { src: "static/videos/pusht/pusht_e013_03_short.mp4", caption: "Sample 3" },
      { src: null, caption: "Sample 4" },
      { src: null, caption: "Sample 5" },
    ],
    rope: [
      { src: null, caption: "Sample 1" },
      { src: null, caption: "Sample 2" },
      { src: null, caption: "Sample 3" },
      { src: null, caption: "Sample 4" },
      { src: null, caption: "Sample 5" },
    ],
    motherboard: [
      { src: null, caption: "Sample 1" },
      { src: null, caption: "Sample 2" },
      { src: null, caption: "Sample 3" },
      { src: null, caption: "Sample 4" },
      { src: null, caption: "Sample 5" },
    ],
  },

  // 2 slots per task.
  longHorizon: {
    pusht: [
      { src: null, caption: "Rollout 1" },
      { src: null, caption: "Rollout 2" },
    ],
    rope: [
      { src: null, caption: "Rollout 1" },
      { src: null, caption: "Rollout 2" },
    ],
    motherboard: [
      { src: "static/videos/motherboard/motherboard_custom_e010_02_long.mp4", caption: "Rollout 1" },
      { src: null, caption: "Rollout 2" },
    ],
  },

  // Each entry is one test window shown for every method, stacked.
  baselines: [
    {
      task: "PushT",
      methods: [
        { name: "ACTS (Ours)", src: null, ours: true },
        { name: "VT-WM-style", src: null },
        { name: "ContactWorld", src: null },
      ],
    },
    {
      task: "Rope",
      methods: [
        { name: "ACTS (Ours)", src: null, ours: true },
        { name: "VT-WM-style", src: null },
        { name: "ContactWorld", src: null },
      ],
    },
    {
      task: "Motherboard",
      methods: [
        { name: "ACTS (Ours)", src: null, ours: true },
        { name: "VT-WM-style", src: null },
        { name: "ContactWorld", src: null },
      ],
    },
  ],

  ablations: [
    {
      title: "Force-aware actions",
      text: "Removing the force-induced offset from the sensor action leaves pose-only conditioning.",
      methods: [
        { name: "ACTS (Ours)", src: null, ours: true },
        { name: "w/o force-aware action", src: null },
      ],
    },
    {
      title: "Number of sampling steps",
      text: "Same robot test window decoded with 2, 10, and 35 flow-matching steps (columns); first column is ground truth.",
      methods: [
        { name: "Rope, robot evaluation episode", src: "static/videos/rope/rope_robot_sample_00_t00279.mp4", aspect: "956 / 942", narrow: true },
      ],
    },
  ],

  failures: [
    {
      src: "static/videos/failure/pusht_e013_13_short.mp4",
      title: "PushT: wrong dynamics",
      caption: "The predicted block motion diverges from the ground truth.",
    },
  ],
};
