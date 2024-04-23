const axios = require('axios');

let apiKey = process.env.API_KEY;
let serviceID = process.env.SERVICE_ID;

const initiateDeploy = {
    method: 'POST',
    url: `https://api.render.com/v1/services/${serviceID}/deploys`,
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
    },
    data: { clearCache: 'do_not_clear' }
};

async function deployAndRetrieve() {
    try {
       
        const deployRes = await axios.request(initiateDeploy);
        console.log("Success Recieved: " + deployRes.status);
        let deployID = deployRes.data.id;

        const retrieveDeploy = {
            method: 'GET',
            url: `https://api.render.com/v1/services/${serviceID}/deploys/${deployID}`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${apiKey}`
            }
        };

        const retrieveDeployRes = await axios.request(retrieveDeploy);
        console.log("Success Recieved: " + retrieveDeployRes.status);

    } catch (error) {
        console.error(error);
    }
}

deployAndRetrieve();
