# Chasing Bucky
A web app that plots all of the photos we take of Charlie and Bucky on Parade.

The repo depends on an interface with [Airtable](https://airtable.com) as the datastore for Bucky data. This is a nicer solution than you might think. In addition to free, serverless storage, I can use the mobile Airtable app to update pictures and Bucky details while we're on the go and visiting the Bucky sites. Every time a detail is updated in the app, this webapp is updated.

If you are forking and deploying your own app, you just need to update the ```config.js``` file with your API keys for both Google Maps and Airtable. 

## Deployed via AWS
I'm deploying the app to Lambda via [Claudia](https://claudiajs.com/) but it's just a node process so you could probably run it anywhere.

`claudia update --handler lambda.handler --deploy-proxy-api --region us-east-2`

## Get Started

`npm install`

`node app.local.js`

Open your browser in ```http://localhost:3000```


