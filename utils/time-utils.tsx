function formatUnixTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  function millisecondsToHHMM(milliseconds: number) {
    const ms = Math.abs(milliseconds);
    
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Return the formatted string
    return `${formattedHours}hr ${formattedMinutes}min`;
  }
  
  export {formatUnixTimestamp, millisecondsToHHMM}