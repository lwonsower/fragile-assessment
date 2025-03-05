// Prompt
// Build a REST API for a todo list app.
// To create notes, an account must be created. Clients should POST /accounts with a username to create an account. The response should include an account ID.
// Clients can then use endpoints to create, read, update, and delete notes. Notes should be stored per account. Note content can be any plain text.
// You should not make a frontend. Use a HTTP client of your choice to make calls.
// You should not use a database. You should store everything in memory.
// You should not worry about authenication.

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
var bodyParser = require('body-parser')
const { validationResult, checkSchema } = require('express-validator');
const handlers = require('./handlers')
const schemas = require('./schemas')
const _ = require('lodash')

app.use(cors());
app.use(express.json());

var jsonParser = bodyParser.json()

// POST new account
app.post("/accounts", checkSchema(schemas.postAccounts), jsonParser, (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(400).send(_.map(errors, 'msg'))
    }
    const response = handlers.addAccount(req.body)
    if (response.error) {
        return res.status(400).send(response.error)
    }
    return res.status(201).send(response)
});

// Post new note to specified account
app.post("/notes/:accountId", checkSchema(schemas.postNotes), jsonParser, (req, res) => {
    const accountId = req.params.accountId;
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(400).send(_.map(errors, 'msg'))
    }

    const response = handlers.addNote(accountId, req.body)
    if (response.error) {
        return res.status(400).send(response.error)
    }
    res.status(201).send(response)
});

// GET all notes from specified accountId
app.get("/notes/:accountId", (req, res) => {
    const accountId = req.params.accountId;
    const response = handlers.getAllNotes(accountId)
    if (response.error) {
        return res.status(400).send(response.error)
    }
    res.status(200).send(response)
});

// PATCH note by noteId
app.patch("/notes/:noteId", checkSchema(schemas.updateNote), jsonParser, (req, res) => {
    const noteId = req.params.noteId;
    const response = handlers.updateNote(noteId, req.body)
    if (response.error) {
        return res.status(400).send(response.error)
    }
    res.status(200).send(response)
});

// DELETE note by noteId
app.delete("/notes/:noteId", (req, res) => {
    const noteId = req.params.noteId;
    const response = handlers.deleteNote(noteId)
    if (response.error) {
        return res.status(400).send(response.error)
    }
    res.status(204).send()
});

app.get('*', (req, res) => {
    res.status(404)
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
