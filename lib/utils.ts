import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-and-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/\-{2,}/g, "-")
    .replace(/^\-+|\-+$/g, "");
}
export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  "node-handles-selected-style";

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const getNameInitials = (name: string) => {
  if (!name) return null;

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");
};
