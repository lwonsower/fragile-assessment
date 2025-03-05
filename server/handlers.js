const crypto = require('crypto');
const _ = require('lodash')
let { db } = require('./db')
const fs = require("fs");

// All handlers for TODO list endpoints
module.exports = {
    addAccount: (data) => {
        const accountId = crypto.randomUUID()
        // Check to see if username already exists
        let error
        _.forEach(Object.keys(db.accounts), (accountId) => {
            const existingUsername = db.accounts[accountId].username
            if (existingUsername === data.username) {
                error = `Account with username ${existingUsername} already exists`
            }
        })
        if (error) {
            return { error }
        }
        if (!db.accounts[accountId]) {
            db.accounts[accountId] = data
            fs.writeFile(`db.json`, JSON.stringify(db), err => {
                if (err) {
                    return { error: err }
                }
            })
        } else {
            return { error: `Account with id ${accountId} already exists` }
        }
        return ({
            id: accountId,
            username: data.username,
        })
    },
    addNote: (accountId, data) => {
        let error
        let note
        // Check if account exists
        if (!db.accounts[accountId]) {
            return { error: `Account with id ${accountId} does not exist` }
        }

        const noteId = crypto.randomUUID()
        if (!db.notes[noteId]) {
            note = {
                ...data,
                id: noteId,
                accountId,
                complete: !!data.complete,
            }
            db.notes[noteId] = note
            fs.writeFile(`db.json`, JSON.stringify(db), err => {
                if (err) {
                    return { error: err }
                }
            })
        } else {
            return { error: `Note with id ${noteId} already exists` }
        }
        return error ? ({ error }) : note
    },
    getAllNotes: (accountId) => {
        if (!db.accounts[accountId]) {
            return { error: `Account with id ${accountId} does not exist` }
        }
        const returnedNotes = []
        Object.keys(db.notes).map((noteId) => {
            if (db.notes[noteId].accountId === accountId) {
                returnedNotes.push({ id: noteId, ...db.notes[noteId] })
            }
        })

        return returnedNotes
    },
    updateNote: (noteId, data) => {
        if (!db.notes[noteId]) {
            return { error: `Note with id ${noteId} does not exist` }
        }
        note = {
            ...db.notes[noteId],
            ...data,
        }
        db.notes[noteId] = note
        fs.writeFile(`db.json`, JSON.stringify(db), err => {
            if (err) {
                return { error: err }
            }
        })

        return note
    },
    deleteNote: (noteId) => {
        if (!db.notes[noteId]) {
            return { error: `Note with id ${noteId} does not exist` }
        }
        delete db.notes[noteId]
        return {}
    }
}
