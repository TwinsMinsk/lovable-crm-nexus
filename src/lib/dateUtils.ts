
// Utility function to handle date timezone issues
export const fixDateTimezoneIssue = (date: Date | undefined): Date | undefined => {
  if (!date) return undefined;
  
  // Create a new date with the same year, month, day in the local timezone
  const adjustedDate = new Date(date);
  adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  
  return adjustedDate;
};

// Function to format dates consistently
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "-";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};
