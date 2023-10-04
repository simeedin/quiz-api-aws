const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const {v4: uuidv4} = require('uuid')
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {validateToken} = require('../../middlewares/auth');
const {checkQuizBody} = require('../../middlewares/checkBody');


async function postQuiz(body) {
    const {userName, quizName} = body
    const itemId = uuidv4();

    await db.put({
        TableName: 'quiz-db',
        Item: {
            userName: userName,
            itemId: `QUIZ#${itemId}`,
            quizName: quizName,
            questions: [],
            highScore: []
        }
    }).promise()

    return sendResponse(200, {success: true, quizId: itemId})
}

const handler = middy()
    .use(jsonBodyParser())
    .use(validateToken)
    .use(checkQuizBody)
    .handler(async (event) => {
        console.log(event);
        try {
            return await postQuiz(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}