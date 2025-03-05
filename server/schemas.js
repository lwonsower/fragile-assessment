// Express-validator schemas to validate request bodies 
module.exports = {
    postAccounts: {
        username: { notEmpty: true, errorMessage: 'Username required', },
        password: { notEmpty: true, errorMessage: 'Password required', },
    },
    postNotes: {
        text: { optional: false, errorMessage: 'Note content text required', },
        complete: { optional: true, default: false }
    },
    updateNote: {
        text: { optional: { options: { nullable: true, require: { oneOf: ["complete"] } } }, },
        complete: { optional: { options: { nullable: true, require: { oneOf: ["text"] } } }, },
    }
}
