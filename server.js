const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressGraphql = require('express-graphql');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.use('/graphql', expressGraphql({
    schema: schema,
    rootValue: resolvers
}));

mongoose.connect(`mongodb+srv://nikolahot:pasteta@mydb-x0kvb.mongodb.net/question-app?retryWrites=true&w=majority`,
{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(res => {
    app.listen(port, (req, res) => {
        console.log(`Server started on port ${port}`);
    });
})
.catch(err => {
    console.log(err);
});