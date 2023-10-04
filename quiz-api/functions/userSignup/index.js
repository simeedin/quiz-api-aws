const {sendResponse, sendError} = require('../../responses/index');
const {db} = require('../../services/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const {hashPassword} = require('../../utils');


async function userSignup(body) {
    const {userName, password} = body;
    const pass = await hashPassword(password);

    const {Item} = await db.get({
        TableName: 'quiz-db',
        Key: {
            userName: userName,
            itemId: `ACCOUNT#${userName}`
        }
    }).promise()

    if (Item) return sendError(400, 'Username already taken');

    await db.put({
        TableName: 'quiz-db',
        Item: {
            userName: userName,
            itemId: `ACCOUNT#${userName}`,
            password: pass
        }
    }).promise()

    return sendResponse(200, {success: true})
}

const handler = middy()
    .use(jsonBodyParser())
    .handler(async (event) => {
        try {
            return await userSignup(event.body)
        } catch (error) {
            return sendError(400, error.message)
        }
    })

module.exports = {handler}