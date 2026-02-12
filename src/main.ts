import alarmSound from "./assets/alarm.mp3";

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
	const targetTime = getTargetTime(mode);
	unhideTextOnFontLoad();
	updateText(mode);
	configureEscapeHatch(targetTime);
	configureTimer(mode, targetTime);
};

const configureEscapeHatch = (targetTime: Date) => {
	window.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key.toLowerCase() === "c") {
			targetTime.setTime(0);
		}
	});
};

const unhideTextOnFontLoad = () => {
	document.fonts.ready.then(() => {
		const timerInner = document.getElementById("timer-inner");
		if (timerInner) timerInner.style.visibility = "visible";
	});
};

const getTargetTime = (mode: Mode) => {
	const times: Record<Mode, number> = {
		default: 0,
		work: 25 * 60 * 1000,
		break: 5 * 60 * 1000,
	};
	if (times[mode] === 0) return new Date(0);
	return new Date(Date.now() + times[mode]);
};

const updateText = (mode: Mode) => {
	const block = document.getElementById("block");
	const clock = document.getElementById("clock");
	const techlectic = document.getElementById("techlectic");
	const logo = document.getElementById("logo");

	if (mode === "default") {
		if (clock) clock.style.display = "none";
		if (block) block.style.display = "none";
		if (logo) logo.classList.add("visible");
		if (techlectic) techlectic.classList.add("big");
	} else {
		if (block) block.textContent = mode;
	}
};

const configureTimer = (mode: Mode, targetTime: Date) => {
	const timerElement = document.getElementById("clock");
	updateTimer({ targetTime, timerElement, mode });
};

const format = (num: number): string => {
	const positiveNumber = num > 0 ? num : 0;
	return positiveNumber.toString().padStart(2, "0");
};

const emojiConfetti = (mode: Mode) => {
	if (mode === "default") return;
	const emoji = "\u23F2\uFE0F"; // timer emoji
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

const playSound = () => {
	const alarm = new Audio(alarmSound);
	console.log("hi");
	alarm.play();
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
		playSound();
	}
};

main();
