const modes = ["default", "work", "break"] as const;
type Mode = (typeof modes)[number];

const params = (): { mode: Mode } => {
	const paramsString = window.location.search;
	const params = new URLSearchParams(paramsString);
	const paramMode = params.get("mode") || "";
	const validMode = (param: string | undefined): param is Mode => {
		return param !== undefined && modes.includes(param as Mode);
	};
	return {
		mode: validMode(paramMode) ? paramMode : "default",
	};
};

const main = () => {
	const { mode } = params();
	updateBlockText(mode);
	configureTimer(mode);
};

const updateBlockText = (mode: Mode) => {
	const blockElement = document.getElementById("block");
	if (blockElement) blockElement.textContent = mode === "default" ? "" : mode;
};

const configureTimer = (mode: Mode) => {
	const times: Record<Mode, number> = {
		default: 0,
		work: 25 * 60 * 1000,
		break: 5 * 60 * 1000,
	};
	if (times[mode] === 0) return;
	const targetTime = new Date(Date.now() + times[mode]);
	const timerElement = document.getElementById("clock");
	updateTimer({ targetTime, timerElement, mode });
};

const format = (num: number): string => {
	const positiveNumber = num > 0 ? num : 0;
	return positiveNumber.toString().padStart(2, "0");
};

const emojiConfetti = (mode: Mode) => {
	if (mode === "default") return;
	const emojis: Record<Mode, string> = {
		default: "",
		work: "\u{1F62E}\u{200D}\u{1F4A8}", // face exhaling
		break: "\u{1F468}\u{1F3FE}\u{200D}\u{1F4BB}", // man technologist medium dark skin tone
	};
	const emoji = emojis[mode];
	const confettiContainer = document.getElementById("app");
	if (confettiContainer) {
		for (let i = 0; i < 10; i++) {
			const confetti = document.createElement("div");
			confetti.classList.add("confetti");
			confetti.textContent = emoji;
			confetti.style.left = `${Math.random() * 100}%`;
			confetti.style.fontSize = `${Math.random() * 100 + 100}px`;
			confettiContainer.appendChild(confetti);
			setTimeout(() => {
				confetti.remove();
			}, 3400);
		}
	}
};

const updateTimer = ({
	targetTime,
	timerElement,
	mode,
}: {
	targetTime: Date;
	timerElement: HTMLElement | null;
	mode: Mode;
}) => {
	const now = new Date();
	const remainingTime = targetTime.getTime() - now.getTime();
	if (timerElement) {
		const minutes = format(Math.floor(remainingTime / (1000 * 60)));
		const seconds = format(Math.floor((remainingTime % (1000 * 60)) / 1000));
		timerElement.textContent = `${minutes}:${seconds}`;
	}
	if (now < targetTime) {
		setTimeout(updateTimer, 200, { targetTime, timerElement, mode });
	} else {
		emojiConfetti(mode);
		// TODO playSound(mode)
	}
};

main();
