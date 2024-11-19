export function dbTimeForHuman(str) {
  // Check if the string is a valid date
  const date = new Date(str);
  if (isNaN(date)) {
    throw new Error('Invalid date string');
  }

  // Format the date to the desired format (YYYY-MM-DD HH:MM)
  const formattedDate = date.toISOString().replace('T', ' ').substring(0, 16);
  
  return formattedDate;
}
