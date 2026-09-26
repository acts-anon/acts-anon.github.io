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

  shortHorizon: {
    pusht: [
      { src: "static/videos/short/pusht_e013_01_short.mp4", caption: "Sample 1" },
      { src: "static/videos/short/pusht_e013_02_short.mp4", caption: "Sample 2" },
      { src: "static/videos/short/pusht_e013_03_short.mp4", caption: "Sample 3" },
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
      { src: "static/videos/short/motherboard_e019_02.mp4", caption: "Sample 1" },
      { src: "static/videos/short/motherboard_e019_07.mp4", caption: "Sample 2" },
      { src: "static/videos/short/motherboard_e019_11.mp4", caption: "Sample 3" },
      { src: "static/videos/short/motherboard_e019_14.mp4", caption: "Sample 4" },
      { src: "static/videos/short/motherboard_e019_15.mp4", caption: "Sample 5" },
      { src: "static/videos/short/motherboard_e019_17.mp4", caption: "Sample 6" },
    ],
  },

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
      { src: "static/videos/long/motherboard_custom_e010_02_long.mp4", caption: "Rollout 1" },
      { src: null, caption: "Rollout 2" },
    ],
  },

  // Human-trained model evaluated on robot episodes, no robot fine-tuning.
  robot: [
    {
      src: "static/videos/robot/pusht_robot2_t01047_release.mp4",
      aspect: "1280 / 968",
      caption: "PushT, contact release. Top: robot recording; bottom: ACTS prediction. " +
        "Plots show the tactile-derived normal force and the sensor action fed to the model (shaded = history).",
    },
  ],

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
      text: "Robot test window. First column is ground truth; the other columns are ACTS decoded with 2, 10, and 35 sampling steps.",
      methods: [
        { name: "Rope, robot episode", src: "static/videos/baselines/step_compare_rope_t00279.mp4", aspect: "956 / 942", narrow: true },
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

  // Force-aware action vs. pose-only action on the same test window.
  ablations: [
    {
      title: "PushT, contact onset",
      text: "The right sensor makes contact inside the predicted window.",
      methods: [
        { name: "ACTS (force-aware action)", src: "static/videos/ablation/pusht_e009_full_12.mp4", ours: true },
        { name: "Pose-only action", src: "static/videos/ablation/pusht_e009_noforce_12.mp4" },
      ],
      image: "static/images/force_pusht_onset.png",
      imageCaption: "Recorded normal force for this window (shaded = 8 history frames).",
    },
    {
      title: "Rope, contact onset",
      text: "The right sensor presses into the rope inside the predicted window; compare the right tactile stream.",
      methods: [
        { name: "ACTS (force-aware action)", src: "static/videos/ablation/rope_e009_full_27.mp4", ours: true },
        { name: "Pose-only action", src: "static/videos/ablation/rope_e009_noforce_27.mp4" },
      ],
      image: "static/images/force_rope_onset.png",
      imageCaption: "Recorded normal force for this window (shaded = 8 history frames).",
    },
    {
      title: "PushT, contact release",
      methods: [
        { name: "ACTS (force-aware action)", src: "static/videos/ablation/pusht_e009_full_02.mp4", ours: true },
        { name: "Pose-only action", src: "static/videos/ablation/pusht_e009_noforce_02.mp4" },
      ],
    },
  ],

  failures: [
    {
      src: "static/videos/failure/pusht_e013_13_short.mp4",
      title: "PushT: wrong dynamics",
      caption: "The predicted T position drifts from the ground truth and becomes inconsistent with the tactile view.",
    },
    {
      src: "static/videos/failure/pusht_episode_010_seg02_t00208.mp4",
      aspect: "1326 / 530",
      title: "PushT: wrong dynamics and shape deformation",
      caption: "The predicted T position mismatches the ground truth and the tactile view, and the block deforms.",
    },
    {
      src: "static/videos/failure/motherboard_e019_01.mp4",
      title: "Motherboard: wrong tactile imprint",
      caption: "Both tactile imprints are wrong; the motherboard's complex geometry is hard to predict.",
    },
    {
      src: "static/videos/failure/motherboard_e019_05.mp4",
      title: "Motherboard: tactile and wrist-view errors",
      caption: "Wrong left tactile imprint and a distorted motherboard in the wrist views.",
    },
  ],
};
