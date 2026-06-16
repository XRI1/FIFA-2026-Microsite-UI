import { type ImgHTMLAttributes } from "react";

export const FLATICON_ICONS = {
  ac: "/flaticon/ac.png",
  alert: "/flaticon/alert.png",
  "arrow-left": "/flaticon/arrow-left.png",
  "badge-check": "/flaticon/badge-check.png",
  calendar: "/flaticon/calendar.png",
  camera: "/flaticon/camera.png",
  chart: "/flaticon/chart.png",
  check: "/flaticon/check.png",
  clock: "/flaticon/clock.png",
  "combo-gift": "/flaticon/combo-gift.png",
  download: "/flaticon/download.png",
  facebook: "/flaticon/facebook.png",
  football: "/flaticon/football.png",
  fridge: "/flaticon/fridge.png",
  gamepad: "/flaticon/gamepad.png",
  gauge: "/flaticon/gauge.png",
  gift: "/flaticon/gift.png",
  goal: "/flaticon/goal.png",
  heart: "/flaticon/heart.png",
  home: "/flaticon/home.png",
  instagram: "/flaticon/instagram.png",
  lightbulb: "/flaticon/lightbulb.png",
  lock: "/flaticon/lock.png",
  logout: "/flaticon/logout.png",
  map: "/flaticon/map.png",
  medal: "/flaticon/medal.png",
  message: "/flaticon/message.png",
  microwave: "/flaticon/microwave.png",
  palette: "/flaticon/palette.png",
  phone: "/flaticon/phone.png",
  play: "/flaticon/play.png",
  question: "/flaticon/question.png",
  scale: "/flaticon/scale.png",
  scan: "/flaticon/scan.png",
  search: "/flaticon/search.png",
  share: "/flaticon/share.png",
  shield: "/flaticon/shield.png",
  speaker: "/flaticon/speaker.png",
  target: "/flaticon/target.png",
  text: "/flaticon/text.png",
  time: "/flaticon/time.png",
  trophy: "/flaticon/trophy.png",
  tv: "/flaticon/tv.png",
  upload: "/flaticon/upload.png",
  user: "/flaticon/user.png",
  users: "/flaticon/users.png",
  video: "/flaticon/video.png",
  washer: "/flaticon/washer.png",
  zap: "/flaticon/zap.png",
} as const;

export type FlaticonIconName = keyof typeof FLATICON_ICONS;

interface FlaticonIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  name: FlaticonIconName;
  label?: string;
}

export function FlaticonIcon({
  name,
  label = "",
  className = "",
  ...props
}: FlaticonIconProps) {
  return (
    <img
      src={FLATICON_ICONS[name]}
      alt={label}
      aria-hidden={label ? undefined : true}
      className={`flaticon-icon inline-block object-contain ${className}`}
      draggable={false}
      {...props}
    />
  );
}

export function RankMedal({
  rank,
  className = "",
}: {
  rank: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <FlaticonIcon
      name={rank === 1 ? "trophy" : "medal"}
      className={`rank-medal rank-medal-${rank} ${className}`}
    />
  );
}
