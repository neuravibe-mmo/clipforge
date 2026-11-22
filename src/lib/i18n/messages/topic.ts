import type { NamespaceMessages } from "../config";

// topic 命名空间词条（zh 为原文，en 为翻译）
export const topic: NamespaceMessages = {
  zh: {
    // 页面标题区
    heroBadge: "无需商品 · 一句话成片",
    heroTitle: "一句话主题成片",
    heroSubtitle:
      "输入一句话主题，AI 自动写旁白脚本，并从免费素材库自动配齐画面，下一步「素材」「合成」即可一键产出竖屏短视频。任何主题都能做，不局限于带货。",
    // 未配置 LLM 引导
    llmBannerTitle: "先配置 LLM 才能生成脚本",
    llmBannerDesc: "需要在「设置」里填写用于写脚本的 LLM（baseUrl / API Key / 模型）。",
    llmBannerCta: "点击前往设置 →",
    // 主题输入
    topicLabel: "一句话主题",
    topicPlaceholder: "例如：在家如何泡一杯手冲咖啡",
    tryLabel: "试试：",
    exampleTopic1: "在家如何泡一杯手冲咖啡",
    exampleTopic2: "城市夜景为什么这么治愈",
    exampleTopic3: "三个让早晨更高效的小习惯",
    exampleTopic4: "雨天适合做的五件小事",
    exampleTopic5: "为什么我们总是怀念童年",
    // 旁白风格
    narrationLabel: "旁白风格",
    narration_knowledge_label: "知识科普",
    narration_knowledge_desc: "讲清一个主题，长知识",
    narration_story_label: "情感故事",
    narration_story_desc: "有代入感的叙事，引共鸣",
    narration_lifestyle_label: "生活方式",
    narration_lifestyle_desc: "精致 vlog 旁白，有质感",
    narration_inspiration_label: "励志金句",
    narration_inspiration_desc: "节奏明快，适合点赞收藏",
    narration_travel_label: "旅行风光",
    narration_travel_desc: "目的地 + 风景，想出发",
    // 时长
    durationLabel: "目标时长",
    // 生成按钮
    generatingScript: "AI 正在写脚本…",
    ctaGenerate: "生成脚本",
    // 流程提示
    flowStep1: "1 写脚本",
    flowStep2: "2 自动配画面",
    flowStep3: "3 合成成片",
    // 错误提示
    errorNoLlm: "尚未配置 LLM，请先到「设置」填写 API Key",
    errorGenerateCheckLlm: "脚本生成失败，请检查 LLM 设置",
    errorGenerate: "脚本生成失败",
  },
  en: {
    // 页面标题区
    heroBadge: "No product needed · One sentence to video",
    heroTitle: "One-sentence to video",
    heroSubtitle:
      "Type one topic and AI writes a voiceover script, then auto-fills footage from free stock libraries — just hit Assets and Compose next to render a vertical short in one click. Works for any topic, not just commerce.",
    // 未配置 LLM 引导
    llmBannerTitle: "Set up an LLM to generate scripts",
    llmBannerDesc: "Add the script-writing LLM (base URL / API key / model) in Settings.",
    llmBannerCta: "Go to Settings →",
    // 主题输入
    topicLabel: "Your topic in one sentence",
    topicPlaceholder: "e.g. How to brew a pour-over coffee at home",
    tryLabel: "Try:",
    exampleTopic1: "How to brew a pour-over coffee at home",
    exampleTopic2: "Why city nightscapes feel so soothing",
    exampleTopic3: "Three small habits for a more productive morning",
    exampleTopic4: "Five little things to do on a rainy day",
    exampleTopic5: "Why we always miss our childhood",
    // 旁白风格
    narrationLabel: "Narration style",
    narration_knowledge_label: "Explainer",
    narration_knowledge_desc: "Break down a topic and teach something new",
    narration_story_label: "Emotional story",
    narration_story_desc: "Immersive narrative that strikes a chord",
    narration_lifestyle_label: "Lifestyle",
    narration_lifestyle_desc: "Polished vlog voiceover with a refined feel",
    narration_inspiration_label: "Inspiring quotes",
    narration_inspiration_desc: "Snappy pacing, great for likes and saves",
    narration_travel_label: "Travel & scenery",
    narration_travel_desc: "Destinations and views that make you want to go",
    // 时长
    durationLabel: "Target length",
    // 生成按钮
    generatingScript: "AI is writing the script…",
    ctaGenerate: "Generate script",
    // 流程提示
    flowStep1: "1 Write script",
    flowStep2: "2 Auto-fill footage",
    flowStep3: "3 Render video",
    // 错误提示
    errorNoLlm: "No LLM configured yet — add your API key in Settings first",
    errorGenerateCheckLlm: "Script generation failed. Check your LLM settings",
    errorGenerate: "Script generation failed",
  },
  vi: {
    // Tiêu đề trang
    heroBadge: "Không cần sản phẩm · Tạo video từ một câu",
    heroTitle: "Tạo video từ một câu chủ đề",
    heroSubtitle:
      "Chỉ cần nhập một chủ đề, AI sẽ tự động viết kịch bản lời bình và tìm ghép tư liệu miễn phí phù hợp — chuyển sang bước Tư liệu và Ghép video để xuất video ngắn dạng dọc chỉ với 1 click. Phù hợp mọi chủ đề, không chỉ giới hạn bán hàng.",
    // Cảnh báo LLM
    llmBannerTitle: "Cần cấu hình LLM để tạo kịch bản",
    llmBannerDesc: "Cần cấu hình dịch vụ LLM (URL / API Key / Model) trong mục Cài đặt.",
    llmBannerCta: "Bấm để đến Cài đặt →",
    // Ô nhập chủ đề
    topicLabel: "Chủ đề trong một câu",
    topicPlaceholder: "Ví dụ: Cách tự pha một ly cà phê Pour-over tại nhà",
    tryLabel: "Gợi ý thử:",
    exampleTopic1: "Cách tự pha một ly cà phê Pour-over tại nhà",
    exampleTopic2: "Tại sao ngắm cảnh đêm thành phố lại chữa lành đến vậy",
    exampleTopic3: "Ba thói quen nhỏ giúp buổi sáng tràn đầy năng lượng",
    exampleTopic4: "Năm điều thú vị nên làm vào một ngày mưa",
    exampleTopic5: "Tại sao chúng ta luôn hoài niệm về tuổi thơ",
    // Phong cách lời bình
    narrationLabel: "Phong cách lời bình",
    narration_knowledge_label: "Kiến thức đời sống",
    narration_knowledge_desc: "Giải thích rõ ràng một chủ đề, mở mang kiến thức",
    narration_story_label: "Câu chuyện cảm xúc",
    narration_story_desc: "Lời kể truyền cảm, tạo sự đồng cảm sâu sắc",
    narration_lifestyle_label: "Phong cách sống",
    narration_lifestyle_desc: "Lời bình vlog tinh tế, giàu cảm xúc",
    narration_inspiration_label: "Thông điệp truyền cảm hứng",
    narration_inspiration_desc: "Tiết tấu nhanh gọn, kích thích tương tác và lưu lại",
    narration_travel_label: "Du lịch & Danh lam",
    narration_travel_desc: "Điểm đến tuyệt đẹp khiến người xem muốn xách ba lô lên và đi",
    // Thời lượng
    durationLabel: "Thời lượng mục tiêu",
    // Nút tạo
    generatingScript: "AI đang viết kịch bản…",
    ctaGenerate: "Bắt đầu tạo kịch bản",
    // Các bước
    flowStep1: "1 Viết kịch bản",
    flowStep2: "2 Tự ghép tư liệu",
    flowStep3: "3 Xuất video hoàn chỉnh",
    // Lỗi
    errorNoLlm: "Chưa cấu hình LLM, vui lòng vào Cài đặt để thêm API Key",
    errorGenerateCheckLlm: "Tạo kịch bản thất bại, vui lòng kiểm tra cấu hình LLM",
    errorGenerate: "Tạo kịch bản thất bại",
  },
};
