import { C } from "../lib/colors.js";

export default function Monogram({ size = 44, color = C.ink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <text
        x="50" y="62"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight="600"
        fontSize="66"
        letterSpacing="-6"
        fill={color}
      >LE</text>
    </svg>
  );
}
