// Minutes to read at ~230 words per minute, never less than 1.
export const readingTime = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 230));
