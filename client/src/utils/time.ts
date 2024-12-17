export function getDateTime(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTimeData(date: Date): [string, string, string] {
  const dateTime = getDateTime(date);
  const dateString: string = (() => {
    const today = new Date();
    const articleDate = new Date(date);
    const timeDiff = today.getTime() - articleDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (dayDiff > 2) {
      return date.toLocaleDateString("ko-KR");
    }
    if (dayDiff === 1) {
      return "어제";
    }
    const hourDiff = today.getHours() - articleDate.getHours();
    if (hourDiff !== 0) {
      return `${hourDiff}시 전`;
    }
    const minuteDiff = today.getMinutes() - articleDate.getMinutes();
    if (minuteDiff !== 0) {
      return `${minuteDiff}분 전`;
    }
    return "지금";
  })();
  const dateTitle = date.toLocaleString();
  return [dateTime, dateString, dateTitle];
}
