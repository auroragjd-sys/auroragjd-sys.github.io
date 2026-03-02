import { PawPrint, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Show header after scrolling down 100px
			if (window.scrollY > 100) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-transform duration-300 ease-out pointer-events-none",
				isVisible ? "translate-y-0" : "-translate-y-[150%]",
			)}
		>
			<div className="w-full max-w-6xl pointer-events-auto">
				<nav className="flex items-center justify-between rounded-full border border-[#ecd7c8]/80 bg-white/60 px-3 py-2 shadow-[0_12px_34px_-24px_rgba(93,53,32,0.45)] backdrop-blur-md sm:px-5">
					<a href="#top" className="group flex items-center gap-2">
						<span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9362] to-[#ff7a45] text-white shadow-sm transition-transform group-hover:scale-105">
							<PawPrint className="size-5" />
						</span>
						<span className="flex flex-col leading-none">
							<strong className="text-base font-black text-[#4a2c1f]">
								AI它
							</strong>
							<small className="text-xs text-[#6d4c34]">智能宠物呵护助手</small>
						</span>
					</a>

					<Button
						asChild
						className="h-9 rounded-full bg-[#ff8b59] px-5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 hover:bg-[#f37543] hover:shadow-orange-200/80 transition-all active:scale-95"
					>
						<a href="#cta" className="flex items-center gap-2">
							<Sparkles className="size-4" />
							预约内测
						</a>
					</Button>
				</nav>
			</div>
		</header>
	);
}
