# Upload CSVs through a client and send Twilio SMS in bulk

This repo contains a proof of concept app and is not suitable for immediate use in production environments. It leverages a node/express server that can be run locally to process SMS requests through Twilio and a React.js frontend app that allows end users to upload a single CSV for submission.

## API

1. cd into the api folder

```
cd api
```

2. Install dependencies

```
yarn install
```

3. Update .env variables

```
See .env.example
```

4. Run the server

```
yarn start
```

## Client

1. cd into the client folder

```
cd client
```

2. Install dependencies

```
yarn install
```

4. Run the server

```
yarn start
```

## CSV Format

The client is set up to parse CSVs containing 2 columns, a "to" column with the recipients phone number, and a "body" column with the hardcoded body of the message you wish to send to them:

to | body
--- | --- 
E1.64 format | String

