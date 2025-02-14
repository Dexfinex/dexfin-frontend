const MAX_LENGTH = 12;

export function cropString(value: string, length = 5): string {
  if (value.length < MAX_LENGTH) {
    return value;
  }

  return `${value.slice(0, length)}...${value.slice(-length + 1)}`;
}

// Utility functions
export function formatAge(dateString: string): string {
  const match = dateString.match(/^(\d+)([ymdhm])/);
  if (!match) return dateString; 

  const [, value, unit] = match;
  const numericValue = parseInt(value);


  const now = new Date();
  let date = new Date(now);

  switch (unit) {
    case 'y':
      date.setFullYear(date.getFullYear() - numericValue);
      break;
    case 'm':
      date.setMonth(date.getMonth() - numericValue);
      break;
    case 'd':
      date.setDate(date.getDate() - numericValue);
      break;
    case 'h':
      date.setHours(date.getHours() - numericValue);
      break;
    case 'm':
      date.setMinutes(date.getMinutes() - numericValue);
      break;
  }

  const diff = now.getTime() - date.getTime();
  
  // Calculate each time unit
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); 
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  // Return the most significant time unit
  if (years >0) return `${years}y`
  if (months > 0 ) return `${months}mth`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'just now';
}

export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}