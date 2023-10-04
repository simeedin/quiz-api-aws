const {sendError} = require('../responses/index'); 


const checkQuizBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizName || typeof body.quizName !== 'string') return sendError(400, 'Quizname is required and must be a string')
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}

const checkPostQuestionBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizId || typeof body.quizId !== 'string') return sendError(400, 'Quiz-id is required and must be a string')
            if (!body.question || typeof body.question !== 'string') return sendError(400, 'Question is required and must be a string')
            if (!body.answer || typeof body.answer !== 'string') return sendError(400, 'Answer is required and must be a string')
            
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}

const checkGetQuestionBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizCreator || typeof body.quizCreator !== 'string') return sendError(400, 'Quiz creator is required and must be a string')
            if (!body.quizId || typeof body.quizId !== 'string') return sendError(400, 'Quiz-id is required and must be a string')
            
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}

const checkPostScoreBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizCreator || typeof body.quizCreator !== 'string') return sendError(400, 'Quiz creator is required and must be a string')
            if (!body.quizId || typeof body.quizId !== 'string') return sendError(400, 'Quiz-id is required and must be a string')
            if (!body.score || typeof body.score !== 'string') return sendError(400, 'Score is required and must be a string')
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}

const checkGetScoreBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizCreator || typeof body.quizCreator !== 'string') return sendError(400, 'Quiz creator is required and must be a string')
            if (!body.quizId || typeof body.quizId !== 'string') return sendError(400, 'Quiz-id is required and must be a string')
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}

const checkDeleteBody = {
    before: async (request) => {
        try {
            const body = request.event.body;
            if (!body.quizId || typeof body.quizId !== 'string') return sendError(400, 'Quiz-id is required and must be a string')
            return request.response;
        } catch (error) {
            console.log(error)
            return sendError(400, 'Invalid body')
        }
    }
}



module.exports = {checkQuizBody, checkPostQuestionBody, checkGetQuestionBody, checkPostScoreBody, checkGetScoreBody, checkDeleteBody}