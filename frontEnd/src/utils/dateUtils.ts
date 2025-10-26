export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (timeString: string): string => {
  // Handle both full datetime and time-only strings
  if (timeString.includes("T")) {
    const date = new Date(timeString);

    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return timeString; // Return as-is if it's already formatted time
};
