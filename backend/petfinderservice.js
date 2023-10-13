// petfinderService.js
const axios = require('axios');

const { petfinderApiKey, petfinderApiSecret } = require('./config'); // Import your API key

const petfinderApi = axios.create({
  baseURL: 'https://api.petfinder.com/v2/',
  headers: {
    Authorization: `Bearer ${petfinderApiKey}`,
  },
});

// Define functions for fetching data from the Petfinder API
async function searchPets(query) {
  try {
    const response = await petfinderApi.get('/animals', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

//get an acess token from the petfinder api website
async function getAccessToken() {
    try {
      const response = await axios.post(
        'https://api.petfinder.com/v2/oauth2/token',
        `grant_type=client_credentials&client_id=${petfinderApiKey}&client_secret=${petfinderApiSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw error;
    }
  }



module.exports = {
  searchPets,
  getAccessToken
};
