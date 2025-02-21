import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600)
  if (hours > 0) {
    return `${hours.toString()}h`
  }
  const minutes = Math.floor(time / 60)
  return `${minutes.toString()}h`
}  
