const mongoose = require('mongoose');

const Test = require('../../models/Test');
const User = require('../../models/User');

const {getUser, parseStr, calculateScoreAndGrade} = require('./helpers');

module.exports = {
    tests: async () => {
        try{
            const tests = await Test.find();
            return tests.map(test => {
                return {
                    ...test._doc,
                    _id: test.id,
                    creator: getUser.bind(this, test.creator),
                    createdAt: new Date(test.createdAt).toISOString()
                }
            }) 
        } catch(err){
            console.log(err);
        }
    },
    test: async ({_id}, req) => {
        /*if(!req.logged){
            console.log('Unauthenticated');
            return {
                msg: 'Unauthenticated'
            }
        }*/
        try{
            let test = await Test.findById(_id);
            if(!test){
                return {
                    msg: 'Fail'
                }
            }
            test.questions = test.questions.map(question => {
                return {
                    ...question,
                    _id: question.id.toString(),
                    answer: ''
                }
            })
            return {
                ...test._doc,
                questions: test.questions,
                creator: getUser.bind(this, test.creator),
                createdAt: new Date(test.createdAt).toISOString(),
                msg: 'Success'
            }
        } catch(err){
            console.log(err);
        }
    },
    createTest: async (args, req) => {
        if(!req.logged){
            // return everything null with msg unauthenticated
            console.log('You shall not PASS!!!!!!!!!!!!!!');
            return;
        }
        try{
            // parse questions and assign id
            let questions = JSON.parse(parseStr(args.testInput.questions));
            questions = questions.map(question => {
                return {
                    ...question,
                    _id: mongoose.Schema.Types.ObjectId
                }
            });

            // create and save test
            const test = new Test({
                title: args.testInput.title,
                desc: args.testInput.desc,
                questions: questions,
                resources: args.testInput.resources,
                creator: req.userId
            });
            const savedTest = await test.save();
            
            // add test to user
            const user = await User.findById(req.userId);
            user.createdTests.push(savedTest.id);
            await user.save();

            return {
                ...test._doc,
                _id: test.id,
                msg: 'Test created!'
            };
        } catch (err){
            console.log(err);
        }
    },
    rateTest: async (args, req) => {
        if(!req.logged){
            console.log('You must be logged in!');
            return {
                msg: 'Unauthenticated'
            };
        }
        // all I need to save is test id and score...
        // passedTest is user's test and I need test from db for correct answers
        const passedTest = JSON.parse(parseStr(args.test));
        const dbTest = await Test.findById(passedTest._id);
        const score = calculateScoreAndGrade(passedTest.questions, dbTest.questions);
        const user = await User.findById(req.userId);
        user.passedTests.push({
            _id: dbTest.id,
            score: score[0],
            grade: score[1],
            minutes: args.minutes,
            seconds: args.seconds
        });
        await user.save();

        // rate test... and save to db
        return 'Success';
    }
}