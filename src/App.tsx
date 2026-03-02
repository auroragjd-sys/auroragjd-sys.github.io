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
import { useEffect, useMemo, useRef, useState } from "react";
import videojs from "video.js";
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
import "video.js/dist/video-js.css";
import "./index.css";

import dogMonitorShot from "./assets/images/dog-monitor.jpg";
import healthShot from "./assets/images/健康分析.png";
import advisorShot from "./assets/images/健康顾问.png";
import emotionRecognitionVideo from "./assets/videos/拍照识别情绪.mp4";
import behaviorRecognitionVideo from "./assets/videos/视频行为.mp4";
import audioRecognitionVideo from "./assets/videos/录音识别声音.mp4";
import healthAnalysisVideo from "./assets/videos/健康分析.mp4";
import smartQaVideo from "./assets/videos/智能问答.mp4";

const heroVideoSrc = {
	emotionRecognition: emotionRecognitionVideo,
	behaviorRecognition: behaviorRecognitionVideo,
	audioRecognition: audioRecognitionVideo,
	healthAnalysis: healthAnalysisVideo,
	smartQa: smartQaVideo,
} as const;

type HeroCarouselSlide = {
	phase: string;
	title: string;
	description: string;
	videoSrc: string;
};

type PhoneScene = "hero" | "chapter1" | "chapter2" | "value";

type HeroPhoneRect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

type TimerId = ReturnType<typeof setTimeout>;

const heroCarouselSlides: [HeroCarouselSlide, ...HeroCarouselSlide[]] = [
	{
		phase: "拍照识别情绪",
		title: "通过面部与体态识别，快速判断宠物当下情绪",
		description:
			"对应视频展示拍照后自动分析耳位、眼神和姿态，帮助你第一时间判断是否需要干预。",
		videoSrc: heroVideoSrc.emotionRecognition,
	},
	{
		phase: "视频行为识别",
		title: "连续追踪动作轨迹，识别潜在异常行为",
		description:
			"对应视频展示 AI 对走动、抓挠和停留状态的连续识别，方便判断是短时波动还是持续异常。",
		videoSrc: heroVideoSrc.behaviorRecognition,
	},
	{
		phase: "录音识别声音",
		title: "识别叫声频段变化，提前发现高风险信号",
		description:
			"对应视频展示录音样本自动分类与风险提示，让异常叫声更早被注意到。",
		videoSrc: heroVideoSrc.audioRecognition,
	},
	{
		phase: "健康分析",
		title: "将多模态结果汇总，形成可读的健康洞察",
		description:
			"对应视频展示评分、趋势和关键指标的联动分析，帮助你快速掌握整体状态。",
		videoSrc: heroVideoSrc.healthAnalysis,
	},
	{
		phase: "智能问答",
		title: "结合历史记录对话问诊，快速得到行动建议",
		description:
			"对应视频展示围绕症状与历史数据的智能问答流程，减少重复描述成本。",
		videoSrc: heroVideoSrc.smartQa,
	},
];

const HERO_PHONE_MODAL_HEIGHT_RATIO = 0.92;
const HERO_PHONE_RATIO = 390 / 844;
const HERO_PHONE_TRANSITION_MS = 520;
const HERO_PHONE_START_ROTATE_DEG = -4;

function HeroPhoneDashboard() {
	return (
		<div className="flex h-full flex-col bg-pet-dashboard pt-7">
			<div className="flex items-center justify-between px-6 pt-6 pb-2">
				<div>
					<div className="text-xs text-pet-muted">下午 2:30</div>
					<div className="text-lg font-bold text-pet-ink">今日健康</div>
				</div>
				<div className="size-8 rounded-full bg-pet-soft" />
			</div>

			<div className="mx-4 mt-2 rounded-3xl bg-white p-6 shadow-soft">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-pet-muted">综合评分</span>
					<span className="rounded-full bg-pet-positive-bg px-2 py-0.5 text-xs font-bold text-pet-positive">
						状态良好
					</span>
				</div>
				<div className="mt-4 flex items-end gap-2">
					<span className="text-5xl font-black text-pet-ink">85</span>
					<span className="mb-1.5 text-sm text-pet-muted">/ 100</span>
				</div>
				<div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-pet-track">
					<div className="score-progress-fill h-full rounded-full" />
				</div>
			</div>

			<div className="group mx-4 mt-4 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-soft transition-transform hover-scale-soft">
				<div className="relative aspect-16-9">
					<img
						src={dogMonitorShot}
						alt="智能小宠"
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
					<div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-live-chip px-2.5 py-1 backdrop-blur-md">
						<div className="size-1.5 animate-pulse rounded-full bg-pet-positive" />
						<span className="text-2xs font-bold tracking-wide text-white">
							LIVE
						</span>
					</div>
					<div className="absolute inset-x-0 bottom-0 bg-media-overlay px-4 pb-6 pt-12">
						<div className="flex items-end justify-between text-white">
							<div>
								<div className="text-2xs mb-1 font-medium opacity-90">
									当前状态
								</div>
								<div className="text-sm font-bold leading-normal">
									安静休息中
								</div>
							</div>
							<div className="flex gap-4 text-right">
								<div>
									<div className="text-2xs mb-1 font-medium opacity-90">
										情绪
									</div>
									<div className="text-xs font-bold leading-normal">平稳</div>
								</div>
								<div>
									<div className="text-2xs mb-1 font-medium opacity-90">
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
				<div className="mb-4 text-sm font-bold text-pet-ink">实时监测记录</div>
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="mt-1 size-2 rounded-full bg-pet-accent-soft" />
						<div>
							<div className="text-sm font-medium text-pet-ink">
								检测到异常叫声
							</div>
							<div className="text-xs text-pet-muted">
								14:20 · 持续 15秒 · 建议关注
							</div>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="mt-1 size-2 rounded-full bg-pet-positive-soft" />
						<div>
							<div className="text-sm font-medium text-pet-ink">进食记录</div>
							<div className="text-xs text-pet-muted">
								12:30 · 摄入 45g · 正常
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SharedPhoneVideo({ src }: { src: string }) {
	const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
	const hostRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const host = hostRef.current;

		if (!host) {
			return;
		}

		if (!playerRef.current) {
			const videoEl = document.createElement("video-js");
			videoEl.className = "shared-phone__video video-js vjs-big-play-centered";
			host.replaceChildren(videoEl);

			playerRef.current = videojs(videoEl, {
				controls: true,
				preload: "metadata",
				playsinline: true,
			});
		}

		playerRef.current.src({ src, type: "video/mp4" });
	}, [src]);

	useEffect(() => {
		return () => {
			if (playerRef.current) {
				playerRef.current.dispose();
				playerRef.current = null;
			}
		};
	}, []);

	return (
		<div ref={hostRef} data-vjs-player className="shared-phone__video-host" />
	);
}

function SharedPhone({
	activeSlide,
	activeSlideIndex,
	onSlideChange,
	slides,
	scene,
}: {
	activeSlide: HeroCarouselSlide;
	activeSlideIndex: number;
	onSlideChange: (nextIndex: number) => void;
	slides: readonly HeroCarouselSlide[];
	scene: PhoneScene;
}) {
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
				<div className="shared-phone__video-content shared-phone__video-content--visible">
					<div className="shared-phone__video-layout">
						<div className="shared-phone__video-header">
							<div className="shared-phone__video-header-copy">
								<span className="shared-phone__video-header-label">
									演示视频
								</span>
								<span className="shared-phone__video-header-title">
									{activeSlide.phase}
								</span>
							</div>
							<span className="shared-phone__video-header-index">
								{activeSlideIndex + 1}/{slides.length}
							</span>
						</div>
						<div className="shared-phone__video-tabs" aria-label="切换演示视频">
							{slides.map((slide, index) => (
								<Button
									key={slide.videoSrc}
									type="button"
									variant={index === activeSlideIndex ? "default" : "outline"}
									size="sm"
									className={`shared-phone__video-tab ${
										index === activeSlideIndex
											? "shared-phone__video-tab--active"
											: "shared-phone__video-tab--idle"
									}`}
									onClick={() => onSlideChange(index)}
									aria-pressed={index === activeSlideIndex}
								>
									{slide.phase}
								</Button>
							))}
						</div>
						<div className="shared-phone__video-frame">
							<SharedPhoneVideo src={activeSlide.videoSrc} />
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
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [isHeroPhoneOpen, setIsHeroPhoneOpen] = useState(false);
	const [isHeroPhoneModalVisible, setIsHeroPhoneModalVisible] = useState(false);
	const [heroPhoneRect, setHeroPhoneRect] = useState<HeroPhoneRect | null>(
		null,
	);
	const [viewport, setViewport] = useState(() => ({
		width: typeof window === "undefined" ? 0 : window.innerWidth,
		height: typeof window === "undefined" ? 0 : window.innerHeight,
	}));
	const heroPhoneButtonRef = useRef<HTMLButtonElement>(null);
	const closeTimerRef = useRef<TimerId | null>(null);
	const phoneScene: PhoneScene = "hero";
	const activeSlide =
		heroCarouselSlides[activeSlideIndex] ?? heroCarouselSlides[0];

	const handleSlideChange = (nextIndex: number) => {
		if (
			nextIndex < 0 ||
			nextIndex >= heroCarouselSlides.length ||
			nextIndex === activeSlideIndex
		) {
			return;
		}

		setActiveSlideIndex(nextIndex);
	};

	const measureHeroPhone = (): HeroPhoneRect | null => {
		const phone = heroPhoneButtonRef.current?.querySelector(".shared-phone");

		if (!(phone instanceof HTMLElement)) {
			return null;
		}

		const rect = phone.getBoundingClientRect();
		const width = phone.offsetWidth;
		const height = phone.offsetHeight;

		return {
			top: rect.top + rect.height / 2 - height / 2,
			left: rect.left + rect.width / 2 - width / 2,
			width,
			height,
		};
	};

	const openHeroPhone = () => {
		const rect = measureHeroPhone();

		if (!rect) {
			return;
		}

		if (closeTimerRef.current !== null) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}

		setHeroPhoneRect(rect);
		setIsHeroPhoneModalVisible(true);
		setIsHeroPhoneOpen(false);

		window.requestAnimationFrame(() => {
			setIsHeroPhoneOpen(true);
		});
	};

	const closeHeroPhone = () => {
		const rect = measureHeroPhone();

		if (rect) {
			setHeroPhoneRect(rect);
		}

		setIsHeroPhoneOpen(false);
	};

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
		const updateViewport = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight,
			});

			if (isHeroPhoneModalVisible) {
				const rect = measureHeroPhone();

				if (rect) {
					setHeroPhoneRect(rect);
				}
			}
		};

		updateViewport();
		window.addEventListener("resize", updateViewport);

		return () => {
			window.removeEventListener("resize", updateViewport);
		};
	}, [isHeroPhoneModalVisible]);

	useEffect(() => {
		if (!isHeroPhoneModalVisible) {
			return;
		}

		const previousOverflow = document.body.style.overflow;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeHeroPhone();
			}
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isHeroPhoneModalVisible]);

	useEffect(() => {
		if (!isHeroPhoneModalVisible || isHeroPhoneOpen) {
			return;
		}

		closeTimerRef.current = setTimeout(() => {
			setIsHeroPhoneModalVisible(false);
			closeTimerRef.current = null;
		}, HERO_PHONE_TRANSITION_MS);

		return () => {
			if (closeTimerRef.current !== null) {
				clearTimeout(closeTimerRef.current);
				closeTimerRef.current = null;
			}
		};
	}, [isHeroPhoneModalVisible, isHeroPhoneOpen]);

	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== null) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	const viewportWidth = viewport.width || 1;
	const viewportHeight = viewport.height || 1;
	const modalHeight = viewportHeight * HERO_PHONE_MODAL_HEIGHT_RATIO;
	const modalWidth = Math.min(
		modalHeight * HERO_PHONE_RATIO,
		viewportWidth * HERO_PHONE_MODAL_HEIGHT_RATIO,
	);

	const sourceRect = heroPhoneRect ?? {
		top: viewportHeight / 2 - modalHeight / 2,
		left: viewportWidth / 2 - modalWidth / 2,
		width: modalWidth,
		height: modalHeight,
	};

	const sourceCenterX = sourceRect.left + sourceRect.width / 2;
	const sourceCenterY = sourceRect.top + sourceRect.height / 2;
	const targetCenterX = viewportWidth / 2;
	const targetCenterY = viewportHeight / 2;
	const offsetX = sourceCenterX - targetCenterX;
	const offsetY = sourceCenterY - targetCenterY;
	const sourceScale = Math.min(
		sourceRect.width / modalWidth,
		sourceRect.height / modalHeight,
	);
	const collapsedScale =
		Number.isFinite(sourceScale) && sourceScale > 0 ? sourceScale : 1;
	const phoneTransform = isHeroPhoneOpen
		? "none"
		: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${collapsedScale}) rotate(${HERO_PHONE_START_ROTATE_DEG}deg)`;

	const scrollHintOpacity = Math.max(0, 1 - storyEntry * 10);
	const scrollHintOffset = Math.min(14, storyEntry * 26);

	return (
		<div className="relative min-h-screen overflow-x-clip bg-transparent text-pet-ink">
			<Header />
			<div className="hero-blob hero-blob--one" />
			<div className="hero-blob hero-blob--two" />
			<div className="hero-blob hero-blob--three" />
			<div className="hero-blob hero-blob--four" />
			<div className="hero-blob hero-blob--five" />

			<header
				className="relative z-10 flex min-h-screen snap-start snap-always flex-col justify-center"
				id="top"
			>
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<a
						href="#main"
						className="sr-only rounded-full bg-white px-4 py-2 text-sm font-semibold text-pet-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
					>
						跳转到主要内容
					</a>

					<div className="hero-layout-grid grid items-center gap-10">
						<div>
							<div className="hero-badge animate-fade-in-up-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-soft backdrop-blur-md sm:text-sm">
								<span className="flex items-center gap-1.5">
									<span className="flex gap-0.5">
										<Cat className="size-4 text-pet-accent" />
										<Dog className="size-4 text-pet-accent" />
									</span>
									<span>专为猫咪与狗狗家庭设计</span>
								</span>
								<span className="hidden h-3 w-px bg-pet-divider sm:block" />
								<span className="hidden text-pet-caption sm:block">
									情绪 · 行为 · 声音全方位监测
								</span>
							</div>

							<h1 className="font-rounded-chinese animate-fade-in-up-soft animate-delay-110 mt-8 text-balance text-4xl font-black leading-tight tracking-wider text-pet-title drop-shadow-sm md:text-5xl lg:text-6xl">
								别让
								<span className="relative mx-1 whitespace-nowrap">
									<span className="relative z-10">“再观察一下”</span>
									<span className="hero-title-highlight" />
								</span>
								<br />
								错过
								<span className="hero-title-gradient">最佳救治时机</span>
							</h1>
							<p className="animate-fade-in-up-soft animate-delay-220 mt-8 max-w-2xl text-lg font-medium leading-8 text-pet-body sm:text-xl">
								猫咪躲藏、狗狗频繁舔舐...这些不仅是情绪，更是
								<span className="font-bold text-pet-brand underline decoration-pet-accent-soft underline-offset-4">
									求救信号
								</span>
								。
								<br />
								<span className="font-bold text-pet-accent">AI它 APP</span>
								通过音视频多模态分析，
								<span className="font-bold text-pet-brand">实时解读</span>
								异常行为，让爱不留遗憾。
							</p>

							<div className="mt-10 flex flex-wrap gap-3">
								<Button
									asChild
									size="lg"
									className="rounded-full bg-pet-accent px-7 text-white transition-all hover:bg-pet-accent-hover shadow-lg shadow-orange-200 hover:shadow-orange-300"
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
									className="rounded-full border-pet-outline bg-pet-frosted px-7 text-pet-neutral-soft hover:bg-pet-soft-bg"
								>
									<a href="#scenes" className="flex items-center gap-2">
										<PlayCircle className="size-5" />
										查看演示页面
									</a>
								</Button>
							</div>

							<div className="mt-12 flex flex-col gap-4 border-t border-pet-line pt-8 sm:flex-row sm:items-center sm:justify-between">
								<div className="group flex items-center gap-2">
									<span className="flex size-10 items-center justify-center rounded-full bg-pet-pill text-pet-accent shadow-soft ring-1 ring-pet-ring transition-transform group-hover:scale-110">
										<ScanLine className="size-5" />
									</span>
									<span className="text-sm font-medium text-pet-body-alt">
										多模态识别
									</span>
								</div>
								<div className="hidden h-8 w-px bg-pet-line sm:block" />
								<div className="group flex items-center gap-2">
									<span className="flex size-10 items-center justify-center rounded-full bg-pet-pill text-pet-accent shadow-soft ring-1 ring-pet-ring transition-transform group-hover:scale-110">
										<AlertCircle className="size-5" />
									</span>
									<span className="text-sm font-medium text-pet-body-alt">
										异常行为预警
									</span>
								</div>
								<div className="hidden h-8 w-px bg-pet-line sm:block" />
								<div className="group flex items-center gap-2">
									<span className="flex size-10 items-center justify-center rounded-full bg-pet-pill text-pet-accent shadow-soft ring-1 ring-pet-ring transition-transform group-hover:scale-110">
										<TrendingUp className="size-5" />
									</span>
									<span className="text-sm font-medium text-pet-body-alt">
										健康趋势追踪
									</span>
								</div>
								<div className="hidden h-8 w-px bg-pet-line sm:block" />
								<div className="group flex items-center gap-2">
									<span className="flex size-10 items-center justify-center rounded-full bg-pet-pill text-pet-accent shadow-soft ring-1 ring-pet-ring transition-transform group-hover:scale-110">
										<Stethoscope className="size-5" />
									</span>
									<span className="text-sm font-medium text-pet-body-alt">
										医生辅助决策
									</span>
								</div>
							</div>
						</div>

						<div
							className={`hero-phone-anchor mx-auto ${
								isHeroPhoneModalVisible
									? "pointer-events-none invisible"
									: "visible"
							}`}
						>
							<button
								ref={heroPhoneButtonRef}
								type="button"
								onClick={openHeroPhone}
								className="group block h-full w-full cursor-pointer"
								aria-label="打开手机演示视频"
								aria-haspopup="dialog"
								aria-expanded={isHeroPhoneModalVisible}
							>
								<div className="hero-phone-tilt transition-transform duration-300 group-hover:scale-[1.02]">
									<div
										className={storyEntry < 0.02 ? "animate-float-soft" : ""}
									>
										<SharedPhone
											activeSlide={activeSlide}
											activeSlideIndex={activeSlideIndex}
											onSlideChange={handleSlideChange}
											slides={heroCarouselSlides}
											scene={phoneScene}
										/>
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>

				<div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
					<a
						href="#intro-carousel"
						className="hero-scroll-hint pointer-events-auto inline-flex flex-col items-center gap-1 text-sm font-semibold text-pet-scroll"
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
						<ChevronsDown className="hero-scroll-hint__arrow size-4 text-pet-accent" />
					</a>
				</div>
			</header>

			<main className="relative z-10" id="main">
				<section
					className="min-h-screen snap-start snap-always pt-12 pb-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:pt-6 lg:pb-0"
					id="cta"
				>
					<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:flex lg:flex-1 lg:items-center lg:px-8">
						<Card className="w-full border-pet-card bg-cta-card-gradient py-10 shadow-soft-xl lg:py-8">
							<CardHeader className="px-6 text-center">
								<CardTitle className="font-rounded-chinese text-3xl leading-tight text-pet-title md:text-4xl">
									让 AI它成为你和宠物之间的健康翻译官
								</CardTitle>
								<CardDescription className="mx-auto mt-2 max-w-2xl text-lg text-pet-copy">
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
										<Label
											htmlFor="contact"
											className="text-base font-medium text-pet-label"
										>
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
											className="h-12 rounded-full border-pet-input bg-white px-6 text-base text-pet-input placeholder:text-pet-placeholder focus-visible:ring-orange-400"
										/>
									</div>
									<Button
										type="submit"
										size="lg"
										className="h-12 shrink-0 rounded-full bg-pet-accent px-8 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:bg-pet-accent-hover hover:shadow-orange-300 active:scale-95"
									>
										<Send className="mr-2 size-5" />
										获取方案
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>

					<footer className="relative z-10 mt-6 border-t border-pet-footer bg-pet-footer-frosted backdrop-blur-sm lg:mt-4">
						<div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-4">
							<div className="footer-grid grid gap-6 border-b border-pet-subtle pb-4">
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<span className="bg-pet-logo-gradient flex size-9 items-center justify-center rounded-full text-white shadow-sm">
											<PawPrint className="size-5" />
										</span>
										<span className="text-lg font-black tracking-wide text-pet-heading">
											AI它
										</span>
									</div>
									<p className="max-w-md text-sm leading-6 text-pet-body">
										为宠物家庭提供多模态健康监测、风险预警与就医协同服务，帮助用户在关键时刻做出更稳妥的照护决策。
									</p>
									<p className="text-xs leading-5 text-pet-note">
										温馨提示：平台建议仅用于辅助判断，不替代专业兽医的线下诊疗意见。
									</p>
								</div>

								<div>
									<h3 className="font-rounded-chinese text-sm font-bold tracking-brand text-pet-brand uppercase">
										产品导航
									</h3>
									<div className="mt-4 space-y-2 text-sm text-pet-nav">
										<a
											href="#value"
											className="block transition-colors hover:text-pet-title"
										>
											价值主张
										</a>
										<a
											href="#features"
											className="block transition-colors hover:text-pet-title"
										>
											核心功能
										</a>
										<a
											href="#scenes"
											className="block transition-colors hover:text-pet-title"
										>
											场景展示
										</a>
										<a
											href="#audience"
											className="block transition-colors hover:text-pet-title"
										>
											适配人群
										</a>
									</div>
								</div>

								<div>
									<h3 className="font-rounded-chinese text-sm font-bold tracking-brand text-pet-brand uppercase">
										商务与支持
									</h3>
									<div className="mt-4 space-y-2 text-sm text-pet-nav">
										<p>邮箱：hello@aita.app</p>
										<p>服务时间：工作日 09:00 - 18:00</p>
										<a
											href="#cta"
											className="inline-flex items-center rounded-full border border-pet-input bg-white px-4 py-1.5 font-semibold text-pet-neutral shadow-sm transition-colors hover:bg-pet-soft-hover hover:shadow-md"
										>
											申请产品内测
										</a>
									</div>
								</div>
							</div>

							<div className="mt-3 flex flex-col gap-3 text-xs text-pet-note sm:flex-row sm:items-center sm:justify-between">
								<p>
									© {new Date().getFullYear()} AI它 (AI TA) · All rights
									reserved.
								</p>
								<div className="flex items-center gap-4">
									<a
										href="#top"
										className="transition-colors hover:text-pet-link"
									>
										返回顶部
									</a>
									<a
										href="mailto:hello@aita.app"
										className="transition-colors hover:text-pet-link"
									>
										联系邮箱
									</a>
								</div>
							</div>
						</div>
					</footer>
				</section>
			</main>

			{isHeroPhoneModalVisible ? (
				<div
					className="fixed inset-0 z-[80]"
					role="dialog"
					aria-modal="true"
					aria-label="手机演示视频播放器"
				>
					<div
						className={`absolute inset-0 transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
							isHeroPhoneOpen
								? "bg-black/45 opacity-100 backdrop-blur-sm"
								: "bg-black/0 opacity-0"
						}`}
						aria-hidden="true"
					/>
					<div
						className="absolute inset-0 flex items-center justify-center px-4 py-4"
						onClick={(event) => {
							if (event.target === event.currentTarget) {
								closeHeroPhone();
							}
						}}
					>
						<div
							className={`pointer-events-auto transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
								isHeroPhoneOpen ? "" : "will-change-transform"
							}`}
							style={{
								width: `${modalWidth}px`,
								transform: phoneTransform,
								transformOrigin: "center center",
							}}
						>
							<SharedPhone
								activeSlide={activeSlide}
								activeSlideIndex={activeSlideIndex}
								onSlideChange={handleSlideChange}
								slides={heroCarouselSlides}
								scene="chapter1"
							/>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default App;
