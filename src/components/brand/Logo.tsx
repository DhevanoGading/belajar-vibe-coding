import Image from "next/image"

export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="ANSOS"
      width={32}
      height={32}
      className={className}
    />
  )
}
