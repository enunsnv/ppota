"use client";

import React, { useState, useEffect } from "react";
import { Gowun_Dodum } from "next/font/google";
import { useTheme } from "next-themes";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const i18n = {
  ko: {
    title: "뽀타",
    subtitle: "ADHD와 몰입을 위한 시각적 60분 타이머",
    start: "시작",
    pause: "일시정지",
    reset: "리셋",
    setTime: "시간 설정 (분)",
    colorTheme: "타이머 색상",
    adArea: "광고 영역 (Google AdSense)",
    aboutTitle: "ADHD와 시각적 타이머 (Visual Timer)",
    aboutDesc:
      'ADHD나 타임 블라인드니스(시간 감각 상실)를 겪는 분들에게는 숫자로 된 시계보다 "색상 면적이 줄어드는 시각적 자극"이 훨씬 직관적입니다. 뽀타는 잔여 시간을 눈에 보이게 만들어 뇌의 몰입 스위치를 켜줍니다.',
    howToTitle: "뽀타 몰입 사용법",
    howToStep1: "1. 무리하지 않고 15분~25분 단위로 타이머를 설정합니다.",
    howToStep2:
      "2. [시작]을 누르고 색상이 0분을 향해 사라지는 것을 보며 집중합니다.",
    howToStep3: "3. 색상이 완전히 사라지면 미련 없이 휴식을 취하세요!",
  },
  en: {
    title: "Potta",
    subtitle: "Visual 60-Min Timer for ADHD & Focus",
    start: "START",
    pause: "PAUSE",
    reset: "RESET",
    setTime: "Set Time (min)",
    colorTheme: "Timer Color",
    adArea: "Advertisement Area",
    aboutTitle: "Visual Timers for ADHD",
    aboutDesc:
      "For people with ADHD or time blindness, a shrinking colored disk is much more intuitive than digital numbers. Potta makes remaining time visible to help switch your brain into focus mode.",
    howToTitle: "How to Use Potta",
    howToStep1: "1. Set a realistic target time (e.g., 15–25 min).",
    howToStep2:
      "2. Press [START] and focus while watching the colored disk shrink toward 0.",
    howToStep3: "3. Take a complete break when the color disappears!",
  },
  ja: {
    title: "ポタ",
    subtitle: "ADHDと集中のための視覚的60分タイマー",
    start: "スタート",
    pause: "一時停止",
    reset: "リセット",
    setTime: "時間設定 (分)",
    colorTheme: "タイマーの色",
    adArea: "広告エリア",
    aboutTitle: "ADHDと視覚的タイマー",
    aboutDesc:
      "ADHDやタイムブラインドネス（時間感覚の喪失）を抱える方には、数字よりも「色の面積が減っていく視覚的刺激」が直感的に伝わります。ポタは残り時間を可視化し、集中スイッチを入れます。",
    howToTitle: "ポタの使い方",
    howToStep1: "1. 無理のない15〜25分単位でタイマーを設定します。",
    howToStep2:
      "2. [スタート] を押し、色が0分に向かって消えていく様子を見ながら集中します。",
    howToStep3: "3. 色が消えたらしっかりと休憩をとりましょう！",
  },
};

const PASTEL_COLORS = [
  { name: "Coral Red", hex: "#FF6B6B" },
  { name: "Peach Orange", hex: "#FFD3B6" },
  { name: "Pastel Mint", hex: "#A8E6CF" },
  { name: "Soft Purple", hex: "#DCE5FF" },
];

export default function Home() {
  const [lang, setLang] = useState<"ko" | "en" | "ja">("ko");
  const [minutesInput, setMinutesInput] = useState<string>("25");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#FF6B6B");
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = i18n[lang];
  const MAX_SECONDS_DIAL = 60 * 60;

  // 타입 안전성을 위해 Number()로 명시적 변환 후 계산
  const currentLeftSeconds = Number(timeLeft) || 0;
  const currentDialRatio = Math.min(
    1,
    Math.max(0, currentLeftSeconds / MAX_SECONDS_DIAL),
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert(
        "🎉 " +
          (lang === "ko"
            ? "집중 시간이 완료되었습니다!"
            : lang === "ja"
              ? "集中時間が終了しました！"
              : "Time is up!"),
      );
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, lang]);

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setMinutesInput("");
      return;
    }

    const numVal = Number(val);

    if (!isNaN(numVal) && numVal <= 60) {
      setMinutesInput(val);

      if (!isRunning && numVal >= 1) {
        setTimeLeft(numVal * 60);
      }
    }
  };

  const handleTimeInputBlur = () => {
    let numVal = Number(minutesInput);

    if (isNaN(numVal) || numVal < 1) {
      numVal = 25;
    }

    setMinutesInput(String(numVal));
    if (!isRunning) {
      setTimeLeft(numVal * 60);
    }
  };

  const toggleStart = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    const parsedMins = Number(minutesInput) || 25;
    setTimeLeft(parsedMins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getPiePath = (ratio: number) => {
    if (ratio <= 0) return "";
    const cx = 100;
    const cy = 100;
    const r = 82;

    if (ratio >= 0.9999) {
      return `M ${cx} ${cy} M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }

    const angle = ratio * 360;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = cx + r * Math.cos(radians);
    const y = cy + r * Math.sin(radians);
    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y} Z`;
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <main
      className={`${gowunDodum.className} min-h-screen transition-colors duration-300 flex flex-col items-center justify-between p-6 bg-rose-50/40 text-gray-800 dark:bg-gray-950 dark:text-gray-100`}
    >
      {/* 상단 로고 바 */}
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-black tracking-wider text-rose-500">
            Potta.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "ko" | "en" | "ja")}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer outline-none"
          >
            <option value="ko">🇰🇷 KO</option>
            <option value="en">🇺🇸 EN</option>
            <option value="ja">🇯🇵 JA</option>
          </select>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-full bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer text-sm"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* 메인 타이머 바디 */}
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* 아날로그 시계 프레임 */}
        <div className="w-80 h-80 rounded-[44px] bg-white dark:bg-gray-900 p-6 shadow-2xl border-4 border-gray-100/80 dark:border-gray-800 flex items-center justify-center relative">
          <div className="w-full h-full rounded-full bg-gray-50/90 dark:bg-gray-950 relative border-2 border-gray-200/80 dark:border-gray-800 shadow-inner overflow-hidden">
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 200 200"
            >
              {/* 부채꼴 면적 */}
              <path
                d={getPiePath(currentDialRatio)}
                fill={selectedColor}
                className="transition-all duration-300 ease-linear opacity-90"
              />

              {/* 눈금 선 */}
              {[...Array(60)].map((_, i) => {
                const isFiveMin = i % 5 === 0;
                const isQuarter = i % 15 === 0;
                const length = isQuarter ? 8 : isFiveMin ? 6 : 3;
                const strokeWidth = isFiveMin ? 1.5 : 0.8;
                const angle = i * 6;

                return (
                  <line
                    key={i}
                    x1="100"
                    y1={100 - 88}
                    x2="100"
                    y2={100 - 88 + length}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className={
                      isFiveMin
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-300 dark:text-gray-700"
                    }
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}

              {/* 5분 단위 숫자 */}
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                (num, idx) => {
                  const angle = idx * 30 - 90;
                  const rad = angle * (Math.PI / 180);
                  const rNum = 72;
                  const x = 100 + rNum * Math.cos(rad);
                  const y = 100 + rNum * Math.sin(rad);
                  const isQuarter = num % 15 === 0;

                  return (
                    <text
                      key={num}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`font-black select-none ${
                        isQuarter
                          ? "fill-gray-800 dark:fill-gray-100 text-[11px]"
                          : "fill-gray-400 dark:fill-gray-500 text-[8.5px]"
                      }`}
                    >
                      {num}
                    </text>
                  );
                },
              )}

              {/* 중앙 노브 */}
              <circle
                cx="100"
                cy="100"
                r="18"
                className="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="2"
              />
              <circle cx="100" cy="100" r="4" className="fill-rose-500" />
            </svg>
          </div>
        </div>

        {/* 디지털 시간 표시 */}
        <div className="text-5xl font-black tabular-nums tracking-tight my-5 drop-shadow-md text-gray-800 dark:text-gray-100">
          {formatTime(timeLeft)}
        </div>

        {/* 조작 버튼 */}
        <div className="flex gap-3 w-full px-2 mb-6">
          <button
            onClick={toggleStart}
            className="flex-1 py-3.5 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-bold rounded-2xl shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer text-base tracking-wide"
          >
            {isRunning ? t.pause : t.start}
          </button>
          <button
            onClick={handleReset}
            className="py-3.5 px-6 bg-white text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 font-bold rounded-2xl shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer text-base"
          >
            {t.reset}
          </button>
        </div>

        {/* 사용자 커스텀 설정 구역 */}
        <div className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 text-xs font-bold text-gray-800 dark:text-gray-200">
          <div className="flex justify-between items-center">
            <span>{t.setTime}</span>
            <input
              type="number"
              value={minutesInput}
              onChange={handleTimeInputChange}
              onBlur={handleTimeInputBlur}
              min={1}
              max={60}
              className="w-16 px-2 py-1 text-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-extrabold outline-none text-sm text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>{t.colorTheme}</span>
            <div className="flex gap-2.5">
              {PASTEL_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 shadow-xs cursor-pointer hover:scale-125 transition-transform ${
                    selectedColor === c.hex
                      ? "ring-2 ring-gray-400 dark:ring-gray-300"
                      : ""
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="w-full max-w-sm my-4 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-600">
        {t.adArea}
      </div>

      {/* 하단 소개 글 */}
      <div className="w-full max-w-md text-left text-xs space-y-3 my-2 p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100">
            {t.aboutTitle}
          </h3>
          <p className="leading-relaxed opacity-90">{t.aboutDesc}</p>
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100">
            {t.howToTitle}
          </h3>
          <p className="opacity-90">{t.howToStep1}</p>
          <p className="opacity-90">{t.howToStep2}</p>
          <p className="opacity-90">{t.howToStep3}</p>
        </div>
      </div>
    </main>
  );
}
