const axios = require('axios');

async function getFacebookUserId(token) {
  const url = `https://graph.facebook.com/me?access_token=${token}`;
  const response = await axios.get(url);
  return response.data.id;
}

async function turnShield(token, uid, enable = true) {
  const data = `variables={"0":{"is_shielded": ${enable},"session_id":"9b78191c-84fd-4ab6-b0aa-19b39f04a6bc","actor_id":"${uid}","client_mutation_id":"b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"}}&method=post&doc_id=1477043292367183&query_name=IsShieldedSetMutation&strip_defaults=true&strip_nulls=true&locale=en_US&client_country_code=US&fb_api_req_friendly_name=IsShieldedSetMutation&fb_api_caller_class=IsShieldedSetMutation`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `OAuth ${token}` };
  const url = "https://graph.facebook.com/graphql";

  await axios.post(url, data, { headers });
}

module.exports = { getFacebookUserId, turnShield };
