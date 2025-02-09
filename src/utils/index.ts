const MAX_LENGTH = 12;

export function cropString(value: string, length = 5): string {
  if (value.length < MAX_LENGTH) {
    return value;
  }

  return `${value.slice(0, length)}...${value.slice(-length + 1)}`;
}
