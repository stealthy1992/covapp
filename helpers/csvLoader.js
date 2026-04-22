const fs       = require('fs');
const path     = require('path');
const Papa     = require('papaparse');

function loadCSV(filename) {
  const filePath = path.join(__dirname, '../tests/api', filename);
  const content  = fs.readFileSync(filePath, 'utf8');
  const result   = Papa.parse(content, {
    header:        true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return result.data;
}

function getCountries(data) {
  return [...new Set(data.map(row => row.region_name))];
}

function getStatesByCountry(data, region_name) {
  return data
    .filter(row => row.region_name === region_name)
    .map(row => row.region_province);
}

function getCityByProvince(data, region_province) {
    return data
      .filter(row => row.region_province === region_province)
      .map(row => row.city_name);
  }

function getRowByState(data, state) {
  return data.find(row => row.region_province === state);
}

function getRow(data) {
  return data.map(row => ({
    region_name: row.region_name,
    region_province: row.region_province,
    date:            row.date
  }));
}

module.exports = { loadCSV, getCountries, getStatesByCountry, getRowByState, getCityByProvince, getRow };