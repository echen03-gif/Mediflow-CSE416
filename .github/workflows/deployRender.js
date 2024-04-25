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
        while (!liveDeployment) {

            retrieveDeployRes = await axios.request(retrieveDeploy);

            if (retrieveDeployRes.data.status === "live") {

                console.log("Deployment Live");

                liveDeployment = true;
            }
            else if (retrieveDeployRes.data.status === "build_in_progress") {

                console.log("Currently Building");

                await new Promise(resolve => setTimeout(resolve, 60000));
            }
            else {

                console.error("Status: " + retrieveDeployRes.data.status);
                console.log("Rolling back to recent successful deployment");
                rollbackDeploy();
                process.exit(1);
            }
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

deployAndRetrieve();

async function rollbackDeploy() {

    try {

        const retrieveDeployList = {
            method: 'GET',
            url: `https://api.render.com/v1/services/${serviceID}/deploys?limit=50`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${apiKey}`
            }
        };

        let retrieveDeployListRes = await axios.request(retrieveDeployList);

        let redeployID;
        let findRecentSuccess = -1;

        for (let i = 0; i < retrieveDeployListRes.data.length; i++) {

            if (retrieveDeployListRes.data[i].deploy.status === "deactivated") {
                findRecentSuccess = i;
                redeployID = retrieveDeployListRes.data[i].deploy.id
                break;
            }
        }

        if (findRecentSuccess > 0) {

            const rollbackDeploy = {
                method: 'GET',
                url: `https://api.render.com/v1/services/${serviceID}/rollback`,
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${apiKey}`
                },
                data: {deployId: redeployID}
            };

            let rollbackDeployRes = await axios.request(rollbackDeploy);

            console.log("Rolled Back Deploy to " + rollbackDeployRes.data);

        }
        else {

            console.error("No Successful Deploys Found within the last 50 attempts")
            process.exit(1);
        }
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }


}
