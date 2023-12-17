const axios = require('axios');

async function getEarthquakeData(timeRange) {
  try {
    const url = getTimeRangeUrl(timeRange);
    const response = await axios.get(url);
    const earthquakes = response.data.features || [];

    return earthquakes.map((quake) => {
      const { mag = 'No Data For Now!', place = 'NA', time } = quake.properties;

      if (time && time !== 'NA') {
        const utcTime = new Date(time);
        const philippinesTime = new Date(utcTime.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

        return {
          magnitude: mag,
          place,
          time: formatTime(philippinesTime),
        };
      } else {
        return {
          magnitude: mag,
          place,
          time: 'No Timestamp for Earthquake data.',
        };
      }
    });
  } catch (error) {
    console.error('Error fetching earthquake information:', error);
    throw new Error('Error fetching earthquake information.');
  }
}

function getTimeRangeUrl(timeRange) {
  switch (timeRange) {
    case 'past hour':
    case 'hour':
    case 'last hour':
    case 'now':
      return 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson';
    case 'past day':
    case 'day':
    case 'last day':
      return 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson';
    case 'past month':
    case 'month':
    case 'last month':
      return 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
    default:
      return 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson';
  }
}

function formatTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const displayedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${displayedHours}:${minutes}:${seconds} ${ampm}`;
}

module.exports = { getEarthquakeData };
