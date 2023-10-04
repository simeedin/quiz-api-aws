const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');


async function getQuizzes() {
    const {Items} = await db.scan({
        TableName: 'quiz-db',
        FilterExpression: "contains(#itemId, :itemId)",
        ExpressionAttributeNames: {"#itemId": "itemId"},
        ExpressionAttributeValues: {
            ':itemId': "QUIZ"
        }
    }).promise()

    const quizzes = Items.map((quiz => {
        return {
            quizName: quiz.quizName,
            createdBy: quiz.userName,
            quizId: quiz.itemId
        }
    }))
    console.log(quizzes);
    return sendResponse(200, {success: true, quizzes: quizzes})


}


const handler = middy()
    .handler(async (event) => {
        console.log(event);
        try {
            return await getQuizzes();
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}