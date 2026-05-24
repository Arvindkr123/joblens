export function formatDate(date: Date | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatTime(date: Date | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | null): string {
  if (!date) return "—"
  return `${formatDate(date)} ${formatTime(date)}`
}
