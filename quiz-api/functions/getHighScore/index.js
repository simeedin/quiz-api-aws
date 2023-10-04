const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {checkGetScoreBody} = require('../../middlewares/checkBody');

async function getHighScore(body) {
    const {quizCreator, quizId} = body;

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: quizCreator,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    if (!Item) return sendError(401, 'Quiz not found')

    const displayHighScore = {
        createdBy: quizCreator,
        quizName: Item.quizName,
        highScore: Item.highScore
    }

    return sendResponse(200, {success: true, quizHighScore: displayHighScore})
}
const handler = middy()
    .use(jsonBodyParser())
    .use(checkGetScoreBody)
    .handler(async (event) => {
        try {
            return await getHighScore(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}