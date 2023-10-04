const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {validateToken} = require('../../middlewares/auth');
const {checkPostQuestionBody} = require('../../middlewares/checkBody');

async function postQuestion(body) {
    const {userName, quizId, question, answer} = body;

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    if (!Item) return sendError(401, 'Quiz not found')

    const longitude = Math.random() * 100;
    const latitude = Math.random() * 100;

    const itemQuestions = Item.questions;


    const newQuestion = {
        question: question,
        answer: answer,
        longitude: longitude.toFixed(5),
        latitude: latitude.toFixed(5)
    }

    itemQuestions.push(newQuestion);
    console.log(itemQuestions);

    await db.update({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `QUIZ#${quizId}`
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET questions = :questions',
        ExpressionAttributeValues: {
            ':questions': itemQuestions
        }

    }).promise()

    return sendResponse(200, {success: true})
}

const handler = middy()
    .use(jsonBodyParser())
    .use(checkPostQuestionBody)
    .use(validateToken)
    .handler(async (event) => {
        try {
            return await postQuestion(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}