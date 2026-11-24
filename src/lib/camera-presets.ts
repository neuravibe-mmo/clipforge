/**
 * Named camera-move preset library for commerce short-video shots.
 *
 * Why this exists: `Shot.camera` is LLM free text and used to be read-only end-to-end.
 * Curated named moves remove prompt guessing and give every shot a known-good,
 * conflict-free instruction.
 * The library serves three consumers:
 *  1. Script LLM: `cameraPresetGuide()` injects a per-shot-type vocabulary into the
 *     output-format prompt (the old spec was one vague line — the top quality bottleneck).
 *  2. Assets page UI: a per-shot preset picker writes a preset sentence into `Shot.camera`.
 *  3. Motion prompt: the chosen sentence flows through `buildMotionPrompt` unchanged.
 *
 * Every preset sentence MUST pass `hasCameraConflict` (unit-enforced): a hold+move combo
 * needs an explicit sequencing marker, otherwise Seedance produces jerky indecisive motion.
 *
 * Pure data + pure functions, no I/O. Preset names/prompts are bilingual data, not i18n
 * keys (same convention as BUILTIN_STYLE_PACKS / PRESENTER_PRESETS).
 */
import type { Shot } from "@/lib/db/schema";
import { hasCameraConflict } from "@/lib/motion-prompt";

export type CameraPresetCategory =
  | "push_pull"
  | "orbit"
  | "pan_track"
  | "crane"
  | "handheld"
  | "special";

/** UI group labels for the picker (bilingual data, rendered by locale). */
export const CAMERA_PRESET_CATEGORIES: Record<CameraPresetCategory, { zh: string; en: string; vi: string }> = {
  push_pull: { zh: "推拉", en: "Push / Pull", vi: "Đẩy / Kéo máy" },
  orbit: { zh: "环绕", en: "Orbit", vi: "Quay vòng" },
  pan_track: { zh: "平移跟随", en: "Pan / Track", vi: "Lướt ngang / Bám theo" },
  crane: { zh: "升降俯仰", en: "Crane", vi: "Nâng / Hạ góc máy" },
  handheld: { zh: "手持实感", en: "Handheld", vi: "Cầm tay chân thực" },
  special: { zh: "特殊技法", en: "Special", vi: "Kỹ thuật đặc biệt" },
};

export interface CameraPreset {
  id: string;
  /** Display name (picker card label) */
  name: { zh: string; en: string; vi: string };
  category: CameraPresetCategory;
  /** The exact camera sentence written into `Shot.camera` / the motion prompt */
  prompt: { zh: string; en: string; vi: string };
  /** Shot types where this move works best — drives LLM guidance + the picker's "recommended" group */
  goodFor: Array<Shot["type"]>;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  // ---- push / pull ----
  {
    id: "crash_push",
    name: { zh: "急速推近", en: "Crash Push-In", vi: "Đẩy nhanh cận cảnh" },
    category: "push_pull",
    prompt: {
      zh: "镜头急速推近主体，冲击力强，开场抓眼",
      en: "camera crashes in fast on the subject, high impact, attention-grabbing opening",
      vi: "Góc máy lao nhanh vào chủ thể, tạo ấn tượng mạnh mở đầu bắt mắt",
    },
    goodFor: ["hook"],
  },
  {
    id: "slow_push",
    name: { zh: "缓慢推近", en: "Slow Push-In", vi: "Đẩy máy chậm" },
    category: "push_pull",
    prompt: {
      zh: "镜头缓慢平稳推近主体，逐渐聚焦细节",
      en: "camera pushes in slowly and steadily, gradually focusing on details",
      vi: "Góc máy đẩy chậm ổn định vào chủ thể, dần tập trung vào chi tiết",
    },
    goodFor: ["pain_point", "demo", "cta"],
  },
  {
    id: "pull_reveal",
    name: { zh: "拉远揭示", en: "Pull-Back Reveal", vi: "Kéo xa toàn cảnh" },
    category: "push_pull",
    prompt: {
      zh: "镜头缓慢拉远，逐渐揭示完整场景与主体全貌",
      en: "camera pulls back slowly, gradually revealing the full scene and subject",
      vi: "Góc máy kéo chậm ra xa, mở rộng toàn bộ bối cảnh và sản phẩm",
    },
    goodFor: ["social_proof", "cta"],
  },
  {
    id: "dolly_zoom",
    name: { zh: "希区柯克变焦", en: "Dolly Zoom", vi: "Biến zoom Dolly" },
    category: "push_pull",
    prompt: {
      zh: "镜头推近的同时背景被拉远压缩，主体大小保持稳定，空间张力强烈",
      en: "dolly zoom: camera moves in while the background compresses away, subject size stays constant, strong spatial tension",
      vi: "Hiệu ứng Dolly Zoom kịch tính, hậu cảnh co giãn trong khi chủ thể giữ nguyên",
    },
    goodFor: ["hook"],
  },
  // ---- orbit ----
  {
    id: "orbit_slow",
    name: { zh: "环绕展示", en: "Slow Orbit", vi: "Xoay vòng quanh" },
    category: "orbit",
    prompt: {
      zh: "镜头围绕主体缓慢环绕半圈，高光沿表面流动，立体感强",
      en: "camera orbits the subject in a slow half circle, highlights sweeping across its surface, strong dimensionality",
      vi: "Góc máy xoay vòng chậm nửa vòng quanh chủ thể, ánh sáng lướt trên bề mặt",
    },
    goodFor: ["product_reveal"],
  },
  {
    id: "lazy_susan",
    name: { zh: "转台展示", en: "Turntable", vi: "Bàn xoay sản phẩm" },
    category: "orbit",
    prompt: {
      zh: "镜头固定，商品如置于旋转展台上缓缓自转，光影随转动流过表面",
      en: "camera stays locked while the product slowly rotates as if on a turntable, light gliding across its surface",
      vi: "Sản phẩm xoay 360 độ trên bàn xoay, góc máy cố định bắt trọn chi tiết",
    },
    goodFor: ["product_reveal"],
  },
  {
    id: "arc_quarter",
    name: { zh: "弧形环移", en: "Arc Move", vi: "Lượn góc phần tư" },
    category: "orbit",
    prompt: {
      zh: "镜头沿弧线绕主体环拍四分之一圈，背景视差自然流动",
      en: "camera arcs a quarter circle around the subject with natural background parallax",
      vi: "Góc máy di chuyển vòng cung 90 độ từ góc nghiêng sang chính diện",
    },
    goodFor: ["product_reveal", "social_proof"],
  },
  // ---- pan / track ----
  {
    id: "lateral_track",
    name: { zh: "横移扫过", en: "Lateral Track", vi: "Lướt máy ngang" },
    category: "pan_track",
    prompt: {
      zh: "镜头缓慢横移扫过画面，展示场景层次",
      en: "camera tracks laterally across the scene, revealing its layers",
      vi: "Góc máy lướt ngang mượt mà qua hàng sản phẩm hoặc các bước thao tác",
    },
    goodFor: ["social_proof"],
  },
  {
    id: "follow_track",
    name: { zh: "跟随镜头", en: "Follow Track", vi: "Bám theo chuyển động" },
    category: "pan_track",
    prompt: {
      zh: "镜头平稳跟随主体动作移动，保持主体居中",
      en: "camera smoothly follows the subject's movement, keeping it centered",
      vi: "Góc máy bám theo chuyển động tay hoặc bước chân, nhịp nhàng tự nhiên",
    },
    goodFor: ["demo", "pain_point"],
  },
  {
    id: "whip_pan",
    name: { zh: "甩镜切换", en: "Whip Pan", vi: "Lia máy nhanh" },
    category: "pan_track",
    prompt: {
      zh: "镜头快速甩动转向主体，动感强烈，节奏利落",
      en: "camera whips around onto the subject, high-energy, snappy pacing",
      vi: "Lia máy cực nhanh chuyển sang cảnh tiếp theo, nhịp điệu dứt khoát",
    },
    goodFor: ["hook"],
  },
  // ---- crane ----
  {
    id: "crane_up",
    name: { zh: "升镜展开", en: "Crane Up", vi: "Nâng máy lên cao" },
    category: "crane",
    prompt: {
      zh: "镜头从低处缓缓升起并微微俯视主体，场景逐渐展开",
      en: "camera cranes up from low, tilting slightly down on the subject as the scene opens up",
      vi: "Góc máy nâng từ dưới lên cao, mở ra không gian toàn cảnh",
    },
    goodFor: ["social_proof"],
  },
  {
    id: "crane_down_close",
    name: { zh: "降镜聚焦", en: "Crane Down", vi: "Hạ máy cận cảnh" },
    category: "crane",
    prompt: {
      zh: "镜头从高处缓缓下降贴近主体，收束到特写",
      en: "camera cranes down from above, closing in on the subject into a tight shot",
      vi: "Góc máy từ trên cao hạ dần xuống cận cảnh sản phẩm",
    },
    goodFor: ["product_reveal"],
  },
  {
    id: "overhead_top",
    name: { zh: "俯拍下降", en: "Top-Down", vi: "Quay thẳng từ trên" },
    category: "crane",
    prompt: {
      zh: "镜头垂直俯拍主体，缓慢下降贴近，桌面构图干净",
      en: "top-down overhead shot descending slowly toward the subject, clean tabletop composition",
      vi: "Góc máy thẳng góc từ trên xuống (Top-down), hạ dần độ cao",
    },
    goodFor: ["demo"],
  },
  // ---- handheld ----
  {
    id: "handheld_real",
    name: { zh: "手持实拍感", en: "Handheld", vi: "Cầm tay thực tế" },
    category: "handheld",
    prompt: {
      zh: "轻微手持晃动感，呼吸般的自然移动，真实 vlog 质感",
      en: "subtle handheld sway, breathing-like natural movement, authentic vlog feel",
      vi: "Góc máy cầm tay rung nhẹ tự nhiên như người dùng thật tự quay",
    },
    goodFor: ["pain_point", "social_proof"],
  },
  {
    id: "pov_walk",
    name: { zh: "第一视角", en: "POV Walk", vi: "Góc nhìn thứ nhất" },
    category: "handheld",
    prompt: {
      zh: "第一人称视角向前走近主体，画面自然微晃，沉浸感强",
      en: "first-person POV walking toward the subject, natural slight sway, immersive",
      vi: "Góc nhìn người dùng (POV), tay cầm sản phẩm trải nghiệm thực tế",
    },
    goodFor: ["hook", "demo"],
  },
  // ---- special ----
  {
    id: "macro_glide",
    name: { zh: "微距滑移", en: "Macro Glide", vi: "Lướt siêu cận (Macro)" },
    category: "special",
    prompt: {
      zh: "微距特写沿商品表面缓慢滑移，材质细节纤毫毕现",
      en: "macro close-up gliding slowly along the product surface, material details razor sharp",
      vi: "Góc quay siêu cận lướt chậm qua kết cấu và chất liệu sản phẩm",
    },
    goodFor: ["product_reveal"],
  },
  {
    id: "hero_rise",
    name: { zh: "英雄仰拍", en: "Hero Shot", vi: "Hất từ dưới lên (Hero)" },
    category: "special",
    prompt: {
      zh: "低角度仰拍主体，镜头缓慢推近，气势感十足",
      en: "low-angle hero shot, camera pushing in slowly, commanding presence",
      vi: "Góc quay chếch thấp hất lên tôn vinh vẻ đẹp sản phẩm nổi bật",
    },
    goodFor: ["product_reveal", "cta"],
  },
  {
    id: "push_then_hold",
    name: { zh: "推近定住", en: "Push Then Hold", vi: "Đẩy tới rồi dừng" },
    category: "special",
    prompt: {
      zh: "镜头先缓慢推近主体，随后固定住画面稳定收尾",
      en: "camera pushes in slowly at first, then settles into a stable held frame to close",
      vi: "Góc máy đẩy nhanh tới gần sản phẩm rồi dừng tĩnh lại",
    },
    goodFor: ["cta"],
  },
  {
    id: "locked_on",
    name: { zh: "锁定跟拍", en: "Locked-On", vi: "Khóa góc bám theo" },
    category: "special",
    prompt: {
      zh: "LOCKED-ON SHOT：镜头如刚性固定在主体上，主体在画面中位置锁定不动，背景随移动流动",
      en: "LOCKED-ON SHOT: camera rigidly mounted to the subject, subject pinned in frame while the background streams past",
      vi: "Khóa chặt vị trí chủ thể ở trung tâm khung hình trong suốt chuyển động",
    },
    goodFor: ["demo", "product_reveal"],
  },
  {
    id: "fpv_dive",
    name: { zh: "FPV 俯冲", en: "FPV Dive", vi: "Góc lượn FPV" },
    category: "special",
    prompt: {
      zh: "FPV 无人机视角向主体快速俯冲贴近，路径流畅带速度感",
      en: "FPV drone dive swooping fast toward the subject, fluid path with real speed",
      vi: "Góc máy FPV lượn nhanh từ xa tiếp cận chính xác sản phẩm",
    },
    goodFor: ["hook"],
  },
  {
    id: "body_orbit",
    name: { zh: "贴身环走", en: "Close Orbit Walk", vi: "Xoay quanh người" },
    category: "handheld",
    prompt: {
      zh: "手持镜头贴近人物缓慢环走半圈，带自然呼吸晃动，背景视差流动",
      en: "handheld camera walks a slow half-circle close around the person, natural breathing sway, background parallax flowing",
      vi: "Góc máy xoay nửa vòng quanh người mẫu đang sử dụng sản phẩm",
    },
    goodFor: ["social_proof", "pain_point"],
  },
  {
    id: "focus_shift",
    name: { zh: "焦点转移", en: "Rack Focus", vi: "Chuyển điểm lấy nét" },
    category: "special",
    prompt: {
      zh: "镜头位置保持不动，焦点从前景缓缓转移到主体，景深变化引导视线",
      en: "camera holds position while focus racks from foreground to the subject, depth guiding the eye",
      vi: "Chuyển tiêu cự mượt mà từ hậu cảnh sang cận cảnh sản phẩm",
    },
    goodFor: ["demo", "pain_point"],
  },
];

/** Lookup by preset id (undefined for unknown ids). */
export function getCameraPreset(id: string): CameraPreset | undefined {
  return CAMERA_PRESETS.find((p) => p.id === id);
}

/** True when the text contains CJK characters (language pick mirrors motion-prompt.ts). */
function hasCjk(s: string): boolean {
  return /[一-鿿぀-ヿ가-힯]/.test(s);
}

/**
 * The preset sentence in the script's language: CJK anywhere in the sample text → Chinese
 * (domestic-first default, empty sample included), otherwise English.
 */
export function cameraPresetPrompt(preset: CameraPreset, sampleText: string): string {
  return !sampleText || hasCjk(sampleText) ? preset.prompt.zh : preset.prompt.en;
}

/**
 * Presets recommended for a shot type (goodFor match), preserving library order.
 * Every shot type is covered (unit-enforced); unknown types return an empty list.
 */
export function recommendedPresets(shotType: string): CameraPreset[] {
  return CAMERA_PRESETS.filter((p) => (p.goodFor as string[]).includes(shotType));
}

/**
 * The preset whose sentence exactly equals the given camera text (zh or en), if any.
 * Lets the UI detect "a preset is currently applied" — the gate for offering a Mix overlay.
 */
export function findPresetByPrompt(cameraText: string | undefined): CameraPreset | undefined {
  const text = cameraText?.trim();
  if (!text) return undefined;
  return CAMERA_PRESETS.find((p) => p.prompt.zh === text || p.prompt.en === text);
}

/**
 * Two-move overlay: join two preset sentences into one combined
 * instruction ("A，同时B" / "A, while B"). Returns null when the combination would trip
 * the camera-conflict lint (e.g. a locked-off move over a moving one) — the UI only
 * offers combinations this function accepts. Two moves max by design: once mixed, the
 * text no longer equals any single preset, so the overlay entry point disappears.
 */
export function mixCameraPrompt(a: CameraPreset, b: CameraPreset, sampleText: string): string | null {
  if (a.id === b.id) return null;
  const zh = !sampleText || hasCjk(sampleText);
  const combined = zh ? `${a.prompt.zh}，同时${b.prompt.zh}` : `${a.prompt.en}, while ${b.prompt.en}`;
  return hasCameraConflict(combined) ? null : combined;
}

/** Presets that can overlay onto the given base preset (conflict-lint-safe combinations only). */
export function mixablePresets(base: CameraPreset, sampleText: string): CameraPreset[] {
  return CAMERA_PRESETS.filter((p) => mixCameraPrompt(base, p, sampleText) !== null);
}

/**
 * Shot-type intent labels for the LLM vocabulary block (script-facing, Chinese prompt).
 * framing = shot size + equivalent focal length (the scale at which this beat's key
 * information MUST be readable); mood = the emotional register the move should carry.
 */
const GUIDE_INTENT_LABELS: Array<{ type: Shot["type"]; label: string; framing: string; mood: string }> = [
  { type: "hook", label: "开场钩子", framing: "极致特写~特写（等效85-135mm）", mood: "急切抓人" },
  { type: "pain_point", label: "痛点共鸣", framing: "近景~中景（等效35-50mm）", mood: "代入困扰" },
  { type: "product_reveal", label: "商品展示", framing: "特写~近景（等效85mm）", mood: "惊喜聚焦" },
  { type: "demo", label: "使用演示", framing: "中景切特写（等效50mm）", mood: "专注可信" },
  { type: "social_proof", label: "氛围背书", framing: "全景~中景（等效35mm）", mood: "松弛日常" },
  { type: "cta", label: "收尾转化", framing: "特写定住（等效85mm）", mood: "笃定收束" },
];

/** Max preset examples per shot type in the LLM guide (keeps the prompt block compact). */
const GUIDE_MAX_PER_TYPE = 3;

/**
 * Camera vocabulary block for the script LLM's output-format prompt. Replaces the old
 * one-line vague spec ("中文镜头运动描述") — the single biggest upstream lever on motion
 * quality: the LLM picks from known-good, conflict-free commerce moves instead of
 * improvising, while staying free to fine-tune wording per scene.
 */
export function cameraPresetGuide(): string {
  const lines = GUIDE_INTENT_LABELS.map(({ type, label, framing, mood }) => {
    const examples = recommendedPresets(type)
      .slice(0, GUIDE_MAX_PER_TYPE)
      .map((p) => p.prompt.zh)
      .join(" ｜ ");
    return `  · ${label}（${framing}，情绪${mood}）：${examples}`;
  });
  return [
    "中文镜头运动描述。优先从下列电商运镜词表中挑选最贴合分镜情绪的一条（可按画面微调用词），每镜保持单一明确的运动方向；不要把「固定镜头」与「环绕/推拉」写进同一句，除非用「先…随后…」表达先后顺序：",
    ...lines,
  ].join("\n");
}


/**
 * Format / localize camera text for the UI based on locale.
 */
export function formatCamera(cameraText: string | undefined, locale: string): string {
  const text = cameraText?.trim();
  if (!text) return "";
  if (locale === "zh") return text;

  // Exact preset match
  const preset = findPresetByPrompt(text);
  if (preset) {
    if (locale === "vi" && preset.prompt.vi) return preset.prompt.vi;
    if (locale === "en" && preset.prompt.en) return preset.prompt.en;
  }

  // Partial match by preset name or Chinese keywords when in Vietnamese
  if (locale === "vi" && /[\u4e00-\u9fff]/.test(text)) {
    for (const p of CAMERA_PRESETS) {
      if (text.includes(p.name.zh)) {
        return p.prompt.vi ? `${p.name.vi}: ${p.prompt.vi}` : p.name.vi;
      }
    }

    return text
      .replace(/镜头急速推近/g, "Đẩy nhanh vào")
      .replace(/急速推近/g, "Đẩy nhanh vào")
      .replace(/镜头缓慢平稳推近/g, "Đẩy chậm ổn định vào")
      .replace(/缓慢平稳推近/g, "Đẩy chậm ổn định vào")
      .replace(/镜头缓慢推近/g, "Đẩy chậm lại gần")
      .replace(/缓慢推近/g, "Đẩy chậm lại gần")
      .replace(/镜头缓慢拉远/g, "Kéo chậm ra xa")
      .replace(/缓慢拉远/g, "Kéo chậm ra xa")
      .replace(/镜头拉远/g, "Kéo ra xa")
      .replace(/拉远揭示/g, "Kéo xa toàn cảnh")
      .replace(/拉远/g, "Kéo ra xa")
      .replace(/希区柯克变焦/g, "Biến zoom Dolly")
      .replace(/围绕主体缓慢环绕/g, "Xoay vòng chậm quanh chủ thể")
      .replace(/缓慢环绕/g, "Xoay vòng chậm")
      .replace(/环绕展示/g, "Quay vòng quanh chủ thể")
      .replace(/环绕/g, "Quay vòng")
      .replace(/转台展示/g, "Xoay trên bàn xoay")
      .replace(/弧形环移/g, "Di chuyển vòng cung")
      .replace(/横移扫过/g, "Lướt máy ngang qua")
      .replace(/跟随镜头/g, "Góc máy bám theo")
      .replace(/甩镜切换/g, "Lia máy nhanh")
      .replace(/升镜展开/g, "Nâng máy lên cao")
      .replace(/降镜聚焦/g, "Hạ máy cận cảnh")
      .replace(/俯拍下降/g, "Hạ từ trên cao xuống")
      .replace(/手持实拍感/g, "Góc máy cầm tay chân thực")
      .replace(/第一视角/g, "Góc nhìn thứ nhất")
      .replace(/微距滑移/g, "Lướt máy siêu cận (Macro)")
      .replace(/英雄仰拍/g, "Góc máy hất từ dưới lên")
      .replace(/固定镜头/g, "Góc máy cố định")
      .replace(/镜头/g, "Góc máy ")
      .replace(/商品主体/g, "chủ thể sản phẩm")
      .replace(/主体/g, "chủ thể")
      .replace(/突出/g, "làm nổi bật ")
      .replace(/，/g, ", ")
      .replace(/。/g, ".");
  }

  if (locale === "en" && /[\u4e00-\u9fff]/.test(text)) {
    for (const p of CAMERA_PRESETS) {
      if (text.includes(p.name.zh)) {
        return p.prompt.en ? `${p.name.en}: ${p.prompt.en}` : p.name.en;
      }
    }
  }

  return text;
}
