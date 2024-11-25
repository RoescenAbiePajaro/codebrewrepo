export function dbTimeForHuman(str) {
  // Check if the string is a valid date
  const date = new Date(str);
  if (isNaN(date)) {
    throw new Error('Invalid date string');
  }

  // Set options for formatting the date and time
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: 'Asia/Manila' // Set the time zone to Manila
  };

  // Format the date to the desired format (YYYY-MM-DD HH:MM)
  const formattedDate = date.toLocaleString('en-PH', options).replace(',', '');

  // Reformat the string to YYYY-MM-DD HH:MM
  const [datePart, timePart] = formattedDate.split(' ');
  const [day, month, year] = datePart.split('/');
  const formattedResult = `${year}-${month}-${day} ${timePart}`;

  return formattedResult;
}