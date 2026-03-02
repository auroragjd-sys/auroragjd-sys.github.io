import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Cat,
  ChevronsDown,
  Dog,
  PawPrint,
  PlayCircle,
  ScanLine,
  Send,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";

import dogMonitorShot from "./assets/images/dog-monitor.jpg";
import healthShot from "./assets/images/健康分析.png";
import advisorShot from "./assets/images/健康顾问.png";
import healthAnalysisVideo from "./assets/videos/健康分析.mp4";
import audioRecognitionVideo from "./assets/videos/录音识别声音.mp4";
import emotionRecognitionVideo from "./assets/videos/拍照识别情绪.mp4";
import smartQaVideo from "./assets/videos/智能问答.mp4";
import behaviorRecognitionVideo from "./assets/videos/视频行为.mp4";

type HeroCarouselSlide = {
  phase: string;
  title: string;
  description: string;
  videoSrc: string;
};

type PhoneScene = "hero" | "chapter1" | "chapter2" | "value";

const heroCarouselSlides: [HeroCarouselSlide, ...HeroCarouselSlide[]] = [
  {
    phase: "拍照识别情绪",
    title: "通过面部与体态识别，快速判断宠物当下情绪",
    description:
      "对应视频展示拍照后自动分析耳位、眼神和姿态，帮助你第一时间判断是否需要干预。",
    videoSrc: emotionRecognitionVideo,
  },
  {
    phase: "视频行为识别",
    title: "连续追踪动作轨迹，识别潜在异常行为",
    description:
      "对应视频展示 AI 对走动、抓挠和停留状态的连续识别，方便判断是短时波动还是持续异常。",
    videoSrc: behaviorRecognitionVideo,
  },
  {
    phase: "录音识别声音",
    title: "识别叫声频段变化，提前发现高风险信号",
    description:
      "对应视频展示录音样本自动分类与风险提示，让异常叫声更早被注意到。",
    videoSrc: audioRecognitionVideo,
  },
  {
    phase: "健康分析",
    title: "将多模态结果汇总，形成可读的健康洞察",
    description:
      "对应视频展示评分、趋势和关键指标的联动分析，帮助你快速掌握整体状态。",
    videoSrc: healthAnalysisVideo,
  },
  {
    phase: "智能问答",
    title: "结合历史记录对话问诊，快速得到行动建议",
    description:
      "对应视频展示围绕症状与历史数据的智能问答流程，减少重复描述成本。",
    videoSrc: smartQaVideo,
  },
];

type PhonePose = {
  x: number;
  y: number;
  width: number;
  rotate: number;
  opacity: number;
};

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function rectFromDomRect(rect: DOMRect): LayoutRect {
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function lowerCenterRect(
  rect: LayoutRect,
  visibleHeightRatio: number,
): LayoutRect {
  const ratio = clamp(visibleHeightRatio, 0, 1);
  const visibleHeight = rect.height * ratio;

  return {
    x: (window.innerWidth - rect.width) / 2,
    y: window.innerHeight - visibleHeight,
    width: rect.width,
    height: rect.height,
  };
}

function readCssNumber(name: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const value = Number.parseFloat(raw);

  return Number.isFinite(value) ? value : 0;
}

function valueTransitionProgress(rect: LayoutRect) {
  const startTop = window.innerHeight;
  const endTop = (window.innerHeight - rect.height) / 2;

  if (startTop === endTop) {
    return rect.y <= endTop ? 1 : 0;
  }

  return clamp((startTop - rect.y) / (startTop - endTop), 0, 1);
}

function fitRectToViewport(
  rect: LayoutRect,
  minVisibleHeightRatio: number,
): LayoutRect {
  const widthScale = rect.width > 0 ? window.innerWidth / rect.width : 1;
  const heightScale = rect.height > 0 ? window.innerHeight / rect.height : 1;
  const scale = Math.min(1, widthScale, heightScale);
  const width = rect.width * scale;
  const height = rect.height * scale;
  const ratio = clamp(minVisibleHeightRatio, 0, 1);
  const minVisibleHeight = height * ratio;
  const x = clamp(rect.x, 0, Math.max(0, window.innerWidth - width));
  const y = clamp(
    rect.y,
    minVisibleHeight - height,
    window.innerHeight - minVisibleHeight,
  );

  return { x, y, width, height };
}

function HeroPhoneDashboard() {
  return (
    <div className="flex h-full flex-col bg-[#fff9f4] pt-7">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <div className="text-xs text-[#8c6b5d]">下午 2:30</div>
          <div className="text-lg font-bold text-[#3d2c24]">今日健康</div>
        </div>
        <div className="size-8 rounded-full bg-[#ffd6bb]" />
      </div>

      <div className="mx-4 mt-2 rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#8c6b5d]">综合评分</span>
          <span className="rounded-full bg-[#e6f4e2] px-2 py-0.5 text-xs font-bold text-[#4c8b3e]">
            状态良好
          </span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-black text-[#3d2c24]">85</span>
          <span className="mb-1.5 text-sm text-[#8c6b5d]">/ 100</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
          <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#ffcfb5] to-[#ff9362]" />
        </div>
      </div>

      <div className="group mx-4 mt-4 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-soft transition-transform hover:scale-[1.02]">
        <div className="relative aspect-[16/9]">
          <img
            src={dogMonitorShot}
            alt="智能小宠"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
            <div className="size-1.5 animate-pulse rounded-full bg-[#4c8b3e]" />
            <span className="text-[10px] font-bold tracking-wide text-white">LIVE</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-6 pt-12">
            <div className="flex items-end justify-between text-white">
              <div>
                <div className="mb-1 text-[10px] font-medium opacity-90">
                  当前状态
                </div>
                <div className="text-sm font-bold leading-normal">安静休息中</div>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <div className="mb-1 text-[10px] font-medium opacity-90">
                    情绪
                  </div>
                  <div className="text-xs font-bold leading-normal">平稳</div>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-medium opacity-90">
                    活跃度
                  </div>
                  <div className="text-xs font-bold leading-normal">中等</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 flex-1 rounded-t-3xl bg-white p-6 shadow-soft">
        <div className="mb-4 text-sm font-bold text-[#3d2c24]">实时监测记录</div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 size-2 rounded-full bg-[#ff9362]" />
            <div>
              <div className="text-sm font-medium text-[#3d2c24]">
                检测到异常叫声
              </div>
              <div className="text-xs text-[#8c6b5d]">14:20 · 持续 15秒 · 建议关注</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 size-2 rounded-full bg-[#d8efcf]" />
            <div>
              <div className="text-sm font-medium text-[#3d2c24]">进食记录</div>
              <div className="text-xs text-[#8c6b5d]">12:30 · 摄入 45g · 正常</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SharedPhone({
  activeSlide,
  scene,
  onVideoEnded,
}: {
  activeSlide: HeroCarouselSlide;
  scene: PhoneScene;
  onVideoEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scene !== "chapter1") {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    const playback = video.play();

    if (playback) {
      playback.catch(() => {});
    }
  }, [activeSlide.videoSrc, scene]);

  const sceneImage = useMemo(() => {
    switch (scene) {
      case "value":
        return {
          src: advisorShot,
          alt: "健康顾问页面",
        };
      default:
        return {
          src: healthShot,
          alt: "健康分析页面",
        };
    }
  }, [scene]);

  return (
    <div className="shared-phone">
      <div className="shared-phone__notch" />
      {scene === "chapter1" ? (
        <div className="shared-phone__video-layout">
          <div className="shared-phone__video-header">
            <span className="shared-phone__video-header-label">章节 1 演示</span>
            <span className="shared-phone__video-header-chip">
              {activeSlide.phase}
            </span>
          </div>
          <div className="shared-phone__video-frame">
            <video
              ref={videoRef}
              key={activeSlide.videoSrc}
              src={activeSlide.videoSrc}
              className="shared-phone__video"
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={onVideoEnded}
            />
            <div className="shared-phone__video-overlay" aria-hidden="true">
              <span className="shared-phone__video-overlay-dot" />
              <span>正在播放</span>
            </div>
          </div>
        </div>
      ) : scene === "hero" ? (
        <HeroPhoneDashboard />
      ) : (
        <div className="shared-phone__image-layout">
          <img
            src={sceneImage.src}
            alt={sceneImage.alt}
            className="shared-phone__image-screen"
          />
        </div>
      )}
    </div>
  );
}

export function App() {
  const [storyEntry] = useState(0);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [phoneScene, setPhoneScene] = useState<PhoneScene>("hero");
  const heroPhoneAnchorRef = useRef<HTMLDivElement>(null);
  const heroCarouselPhoneAnchorRef = useRef<HTMLDivElement>(null);
  const valuePhoneAnchorRef = useRef<HTMLDivElement>(null);
  const [phonePose, setPhonePose] = useState<PhonePose>({
    x: 0,
    y: 0,
    width: 0,
    rotate: 0,
    opacity: 0,
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("snap-y", "snap-mandatory");
    body.classList.add("snap-y", "snap-mandatory");

    return () => {
      html.classList.remove("snap-y", "snap-mandatory");
      body.classList.remove("snap-y", "snap-mandatory");
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const heroDomRect = heroPhoneAnchorRef.current?.getBoundingClientRect();

      if (
        !heroDomRect ||
        heroDomRect.width <= 0 ||
        heroDomRect.height <= 0
      ) {
        return;
      }

      const storyProgress = clamp(storyEntry, 0, 1);
      const heroRect = rectFromDomRect(heroDomRect);
      const storyVisibleHeightRatio = clamp(
        readCssNumber("--shared-phone-story-visible-height-ratio"),
        0,
        1,
      );
      const storyRect = lowerCenterRect(heroRect, storyVisibleHeightRatio);

      let x = heroRect.x;
      let y = heroRect.y;
      let width = heroRect.width;
      let height = heroRect.height;
      let rotate = readCssNumber("--shared-phone-entry-rotate");

      const heroCarouselDomRect =
        heroCarouselPhoneAnchorRef.current?.getBoundingClientRect();
      const heroCarouselRect = heroCarouselDomRect
        ? rectFromDomRect(heroCarouselDomRect)
        : undefined;
      const carouselProgress = heroCarouselRect
        ? valueTransitionProgress(heroCarouselRect)
        : 0;

      if (heroCarouselRect && carouselProgress > 0) {
        const targetX = heroCarouselRect.x + (heroCarouselRect.width - width) / 2;
        const targetY =
          heroCarouselRect.y + (heroCarouselRect.height - height) / 2;
        x = lerp(x, targetX, carouselProgress);
        y = lerp(y, targetY, carouselProgress);
        rotate = lerp(rotate, 0, carouselProgress);
      }

      if (storyProgress > 0) {
        const targetX = storyRect.x + (storyRect.width - width) / 2;
        const targetY = storyRect.y + (storyRect.height - height) / 2;
        x = lerp(x, targetX, storyProgress);
        y = lerp(y, targetY, storyProgress);
        rotate = lerp(rotate, 0, storyProgress);
      }

      const valueDomRect = valuePhoneAnchorRef.current?.getBoundingClientRect();
      const valueRect = valueDomRect
        ? rectFromDomRect(valueDomRect)
        : undefined;
      const valueProgress = valueRect ? valueTransitionProgress(valueRect) : 0;

      let opacity = 0;

      if (valueRect && valueProgress > 0) {
        const targetX = valueRect.x + (valueRect.width - width) / 2;
        const targetY = valueRect.y + (valueRect.height - height) / 2;
        x = lerp(x, targetX, valueProgress);
        y = lerp(y, targetY, valueProgress);
        rotate = lerp(rotate, 0, valueProgress);
      }

      ({ x, y, width, height } = fitRectToViewport({
        x,
        y,
        width,
        height,
      }, storyVisibleHeightRatio));

      const viewportCenter = window.innerHeight / 2;
      const candidates: { id: string; scene: PhoneScene }[] = [
        { id: "top", scene: "hero" },
        { id: "intro-carousel", scene: "chapter1" },
        { id: "proof", scene: "chapter2" },
        { id: "value", scene: "value" },
      ];
      let closestScene: PhoneScene = "hero";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const candidate of candidates) {
        const element = document.getElementById(candidate.id);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        if (rect.height <= 0) {
          continue;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestScene = candidate.scene;
        }
      }

      setPhoneScene((prev) => (prev === closestScene ? prev : closestScene));

      const visible =
        width > 0 &&
        height > 0 &&
        x < window.innerWidth &&
        x + width > 0 &&
        y < window.innerHeight &&
        y + height > 0;

      opacity = visible ? 1 : 0;

      setPhonePose((prev) => {
        if (
          Math.abs(prev.x - x) < 0.5 &&
          Math.abs(prev.y - y) < 0.5 &&
          Math.abs(prev.width - width) < 0.5 &&
          Math.abs(prev.rotate - rotate) < 0.15 &&
          Math.abs(prev.opacity - opacity) < 0.01
        ) {
          return prev;
        }

        return { x, y, width, rotate, opacity };
      });
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [storyEntry]);

  const scrollHintOpacity = Math.max(0, 1 - storyEntry * 10);
  const scrollHintOffset = Math.min(14, storyEntry * 26);

  const handleVideoEnded = useCallback(() => {
    setHeroCarouselIndex((prev) => (prev + 1) % heroCarouselSlides.length);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-transparent text-[#3d2c24]">
      <Header />
      <div className="pointer-events-none fixed left-[-180px] top-[-130px] size-[390px] rounded-full bg-[#ffd6bb]/90 blur-[100px] animate-blob" />
      <div
        className="pointer-events-none fixed right-[-130px] top-[220px] size-[310px] rounded-full bg-[#ffe8cc]/80 blur-[80px] animate-blob-reverse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-180px] left-[18%] size-[430px] rounded-full bg-[#ffd9cf]/80 blur-[110px] animate-blob"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="pointer-events-none fixed right-[20%] top-[10%] size-[200px] rounded-full bg-[#fff0d4]/70 blur-[70px] animate-blob-reverse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="pointer-events-none fixed left-[30%] bottom-[20%] size-[250px] rounded-full bg-[#fff1f2]/70 blur-[80px] animate-blob"
        style={{ animationDelay: "3s" }}
      />

      <div
        aria-hidden="true"
        className="shared-phone-shell"
        style={{
          width: `${phonePose.width}px`,
          opacity: phonePose.opacity,
          transform: `translate3d(${phonePose.x}px, ${phonePose.y}px, 0) rotate(${phonePose.rotate}deg)`,
        }}
      >
        <div
          className={
            storyEntry < 0.02 ? "animate-[float_6s_ease-in-out_infinite]" : ""
          }
        >
          <SharedPhone
            activeSlide={
              heroCarouselSlides[heroCarouselIndex] ?? heroCarouselSlides[0]
            }
            scene={phoneScene}
            onVideoEnded={handleVideoEnded}
          />
        </div>
      </div>

      <header
        className="relative z-10 flex min-h-screen snap-start snap-always flex-col justify-center"
        id="top"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <a
            href="#main"
            className="sr-only rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3d2c24] focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            跳转到主要内容
          </a>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e6cbb0] bg-gradient-to-r from-white/80 to-[#fff4ea]/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#7b4a2a] shadow-soft backdrop-blur-md animate-[fade-in-up_680ms_ease-out_both]">
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    <Cat className="size-4 text-[#ff8b59]" />
                    <Dog className="size-4 text-[#ff8b59]" />
                  </span>
                  <span>专为猫咪与狗狗家庭设计</span>
                </span>
                <span className="hidden h-3 w-px bg-[#e9cfbf] sm:block" />
                <span className="hidden text-[#9c7564] sm:block">
                  情绪 · 行为 · 声音全方位监测
                </span>
              </div>

              <h1 className="font-rounded-chinese mt-8 animate-[fade-in-up_680ms_ease-out_both] text-balance text-4xl font-black tracking-wider leading-tight text-[#3f261c] drop-shadow-sm [animation-delay:110ms] md:text-5xl lg:text-6xl">
                别让
                <span className="relative mx-1 whitespace-nowrap">
                  <span className="relative z-10">“再观察一下”</span>
                  <span className="absolute bottom-[0.15em] left-0 -z-10 h-[0.35em] w-full -rotate-1 rounded-sm bg-[#ffd6bb] opacity-90" />
                </span>
                <br />
                错过
                <span className="bg-gradient-to-r from-[#ff8b59] to-[#ff5b2e] bg-clip-text text-transparent">
                  最佳救治时机
                </span>
              </h1>
              <p className="mt-8 max-w-2xl animate-[fade-in-up_680ms_ease-out_both] text-lg font-medium leading-8 text-[#5a3928] [animation-delay:220ms] sm:text-xl">
                猫咪躲藏、狗狗频繁舔舐...这些不仅是情绪，更是
                <span className="font-bold text-[#7b4a2a] underline decoration-[#ff8b59]/40 underline-offset-4">
                  求救信号
                </span>
                。
                <br />
                <span className="font-bold text-[#ff8b59]">AI它 APP</span>
                通过音视频多模态分析，
                <span className="font-bold text-[#7b4a2a]">实时解读</span>
                异常行为，让爱不留遗憾。
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#ff8b59] px-7 text-white hover:bg-[#f37543] shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
                >
                  <a href="#cta" className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    预约产品内测
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[#e5cdb8] bg-white/70 px-7 text-[#6b4a3b] hover:bg-[#fff4ea]"
                >
                  <a href="#scenes" className="flex items-center gap-2">
                    <PlayCircle className="size-5" />
                    查看演示页面
                  </a>
                </Button>
              </div>

              <div className="mt-12 flex flex-col gap-4 border-t border-[#ebd8ca] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="group flex items-center gap-2">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#fffcf7] text-[#ff8b59] shadow-soft ring-1 ring-[#ebdccf] transition-transform group-hover:scale-110">
                    <ScanLine className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-[#5a3a29]">
                    多模态识别
                  </span>
                </div>
                <div className="hidden h-8 w-px bg-[#ebd8ca] sm:block" />
                <div className="group flex items-center gap-2">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#fffcf7] text-[#ff8b59] shadow-soft ring-1 ring-[#ebdccf] transition-transform group-hover:scale-110">
                    <AlertCircle className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-[#5a3a29]">
                    异常行为预警
                  </span>
                </div>
                <div className="hidden h-8 w-px bg-[#ebd8ca] sm:block" />
                <div className="group flex items-center gap-2">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#fffcf7] text-[#ff8b59] shadow-soft ring-1 ring-[#ebdccf] transition-transform group-hover:scale-110">
                    <TrendingUp className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-[#5a3a29]">
                    健康趋势追踪
                  </span>
                </div>
                <div className="hidden h-8 w-px bg-[#ebd8ca] sm:block" />
                <div className="group flex items-center gap-2">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#fffcf7] text-[#ff8b59] shadow-soft ring-1 ring-[#ebdccf] transition-transform group-hover:scale-110">
                    <Stethoscope className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-[#5a3a29]">
                    医生辅助决策
                  </span>
                </div>
              </div>
            </div>

            <div
              className="hero-phone-anchor mx-auto"
              ref={heroPhoneAnchorRef}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
          <a
            href="#intro-carousel"
            className="hero-scroll-hint pointer-events-auto inline-flex flex-col items-center gap-1 text-sm font-semibold text-[#734b39]"
            aria-label="向下滚动查看详细内容"
            style={{
              opacity: scrollHintOpacity,
              transform: `translateY(${scrollHintOffset}px)`,
              pointerEvents: scrollHintOpacity < 0.12 ? "none" : "auto",
            }}
          >
            <span className="hero-scroll-hint__mouse" aria-hidden="true">
              <span className="hero-scroll-hint__wheel" />
            </span>
            <span className="hero-scroll-hint__text">向下滚动，继续查看</span>
            <ChevronsDown className="hero-scroll-hint__arrow size-4 text-[#ff8b59]" />
          </a>
        </div>
      </header>

      <main className="relative z-10" id="main">
        <section
          className="min-h-screen snap-start snap-always pt-12 pb-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:pt-6 lg:pb-0"
          id="cta"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:flex lg:flex-1 lg:items-center lg:px-8">
            <Card className="w-full border-[#f0d0b8] bg-gradient-to-br from-[#fffbf7] via-[#fff4eb] to-[#ffe8d6] py-10 shadow-soft-xl lg:py-8">
              <CardHeader className="px-6 text-center">
                <CardTitle className="font-rounded-chinese text-3xl leading-tight text-[#3f261c] md:text-4xl">
                  让 AI它成为你和宠物之间的健康翻译官
                </CardTitle>
                <CardDescription className="mx-auto mt-2 max-w-2xl text-lg text-[#5d4037]">
                  现在预约，优先获取首批内测资格、产品白皮书与商务接入方案。
                </CardDescription>
              </CardHeader>

              <CardContent className="mx-auto w-full max-w-xl px-6 pt-6">
                <form
                  action="mailto:hello@aita.app"
                  method="post"
                  encType="text/plain"
                  className="flex flex-col gap-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1 space-y-2 text-left">
                    <Label htmlFor="contact" className="text-base font-medium text-[#4a2e24]">
                      联系邮箱
                    </Label>
                    <Input
                      id="contact"
                      name="邮箱"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      placeholder="name@example.com"
                      className="h-12 rounded-full border-[#e6ccb3] bg-white px-6 text-base text-[#4d3125] placeholder:text-[#9ca3af] focus-visible:ring-[#ff8b59]"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 shrink-0 rounded-full bg-[#ff8b59] px-8 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:bg-[#f37543] hover:shadow-orange-300 active:scale-95"
                  >
                    <Send className="mr-2 size-5" />
                    获取方案
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <footer className="relative z-10 mt-6 border-t border-[#e9d7ca] bg-white/72 backdrop-blur-sm lg:mt-4">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-4">
              <div className="grid gap-6 border-b border-[#efdfd3] pb-4 md:grid-cols-[1.25fr_1fr_1fr]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9362] to-[#ff7a45] text-white shadow-sm">
                      <PawPrint className="size-5" />
                    </span>
                    <span className="text-lg font-black tracking-wide text-[#43291f]">
                      AI它
                    </span>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-[#5a3928]">
                    为宠物家庭提供多模态健康监测、风险预警与就医协同服务，帮助用户在关键时刻做出更稳妥的照护决策。
                  </p>
                  <p className="text-xs leading-5 text-[#7b5a48]">
                    温馨提示：平台建议仅用于辅助判断，不替代专业兽医的线下诊疗意见。
                  </p>
                </div>

                <div>
                  <h3 className="font-rounded-chinese text-sm font-bold tracking-[0.08em] text-[#7b4a2a] uppercase">
                    产品导航
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-[#5d3d2d]">
                    <a
                      href="#value"
                      className="block transition-colors hover:text-[#3f261c]"
                    >
                      价值主张
                    </a>
                    <a
                      href="#features"
                      className="block transition-colors hover:text-[#3f261c]"
                    >
                      核心功能
                    </a>
                    <a
                      href="#scenes"
                      className="block transition-colors hover:text-[#3f261c]"
                    >
                      场景展示
                    </a>
                    <a
                      href="#audience"
                      className="block transition-colors hover:text-[#3f261c]"
                    >
                      适配人群
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-rounded-chinese text-sm font-bold tracking-[0.08em] text-[#7b4a2a] uppercase">
                    商务与支持
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-[#5d3d2d]">
                    <p>邮箱：hello@aita.app</p>
                    <p>服务时间：工作日 09:00 - 18:00</p>
                    <a
                      href="#cta"
                      className="inline-flex items-center rounded-full border border-[#e6ccb3] bg-white px-4 py-1.5 font-semibold text-[#6a4532] shadow-sm transition-colors hover:bg-[#fff3e8] hover:shadow-md"
                    >
                      申请产品内测
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 text-xs text-[#7b5a48] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} AI它 (AI TA) · All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#top" className="transition-colors hover:text-[#4a2c1f]">
                    返回顶部
                  </a>
                  <a
                    href="mailto:hello@aita.app"
                    className="transition-colors hover:text-[#4a2c1f]"
                  >
                    联系邮箱
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
