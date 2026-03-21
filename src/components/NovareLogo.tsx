export default function NovareLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Purple arrow/chevron mark from Novare Talent branding */}
      <path
        d="M8 32L20 8L32 32H24L20 22L16 32H8Z"
        fill="#7C3AED"
      />
      <path
        d="M8 32L20 20L14 32H8Z"
        fill="#6D28D9"
      />
      <path
        d="M32 32L20 20L26 32H32Z"
        fill="#9333EA"
      />
    </svg>
  );
}
