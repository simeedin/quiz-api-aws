const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {validateToken} = require('../../middlewares/auth');
const {checkDeleteBody} = require('../../middlewares/checkBody');
async function deleteQuiz(body) {
    const {userName, quizId,} = body;

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    if (!Item) return sendError(401, 'Quiz not found')

    await db.delete({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    return sendResponse(200, {success: true})
}

const handler = middy()
    .use(jsonBodyParser())
    .use(validateToken)
    .use(checkDeleteBody)
    .handler(async (event) => {
        try {
            return await deleteQuiz(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}