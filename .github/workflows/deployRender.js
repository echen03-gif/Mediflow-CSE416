const axios = require('axios');

let apiKey = "rnd_94DcewF0SlGmyJUoN8siOXOLgVna";
let serviceID = "srv-coivlogl5elc73deiio0";

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
       
        let deployRes = await axios.request(initiateDeploy);
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

        let retrieveDeployRes = await axios.request(retrieveDeploy);
        console.log("Success Recieved: " + retrieveDeployRes.status);

        let liveDeployment = false;

        while(!liveDeployment){

            retrieveDeployRes = await axios.request(retrieveDeploy);

            if(retrieveDeployRes.data.status === "live"){

                console.log("Deployment Live");
                
                liveDeployment = true;
            }
            else if(retrieveDeployRes.data.status === "build_in_progress"){

                console.log("Currently Building");

                await new Promise(resolve => setTimeout(resolve, 60000));
            }
            else{

                // Deployment Failed
                console.error("Status: " + retrieveDeployRes.data.status);
                process.exit(1);
            }
        }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


deployAndRetrieve();
