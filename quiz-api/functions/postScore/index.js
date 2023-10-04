const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {validateToken} = require('../../middlewares/auth');
const {checkPostScoreBody} = require('../../middlewares/checkBody');

async function postScore(body) {
    const {userName, quizCreator, quizId, score} = body;

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: quizCreator,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    if (!Item) return sendError(401, 'Quiz not found')

    const itemHighScore = Item.highScore;

    const newScore = {
        player: userName,
        score: score
    }
    itemHighScore.push(newScore);

    await db.update({
        TableName: 'quiz-db',
        Key: {
            userName: quizCreator,
            itemId: `QUIZ#${quizId}`
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET highScore = :highScore',
        ExpressionAttributeValues: {
            ':highScore': itemHighScore
        }

    }).promise()

    return sendResponse(200, {success: true})
}

const handler = middy()
    .use(jsonBodyParser())
    .use(validateToken)
    .use(checkPostScoreBody)
    .handler(async (event) => {
        try {
            return await postScore(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}