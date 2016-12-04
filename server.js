import express from 'express'
import graphQLHTTP from 'express-graphql'
import DataLoader from 'dataloader'
import fetch from 'node-fetch'

import schema from './schema.js'

const app = express();

function getFollowers(url) {
    console.log(url)
    return fetch(url+'?client_id=f64f7957d1ad23b29a94&client_secret=7f8c1767535a86c48efc2fe34a03558d91f94eb4')
                .then(res => res.json())
}

const userLoader = new DataLoader(urls => Promise.all(urls.map(getFollowers)))

const loaders = {
	user: userLoader
}

app.use(graphQLHTTP({
	schema,
	graphiql: true,
	context: { loaders },
}))

app.listen(7600);