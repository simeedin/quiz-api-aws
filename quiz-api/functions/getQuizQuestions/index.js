const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {checkGetQuestionBody} = require('../../middlewares/checkBody');


async function getQuizQuestions(body) {
    const {quizCreator, quizId} = body;

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: quizCreator,
            itemId: `QUIZ#${quizId}`
        }
    }).promise()

    if (!Item) return sendError(401, 'Quiz not found')

    const displayQuizQuestions = {
        createdBy: quizCreator,
        quizName: Item.quizName,
        questions: Item.questions
    }

    return sendResponse(200, {success: true, quiz: displayQuizQuestions})
}
const handler = middy()
    .use(jsonBodyParser())
    .use(checkGetQuestionBody)
    .handler(async (event) => {
        try {
            return await getQuizQuestions(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}