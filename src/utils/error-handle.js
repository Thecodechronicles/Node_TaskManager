const handleForError = (error, res) => {
    const obj = {};
    const key = [];
    const message = [];
    // console.log(Object.keys(error.errors));
    if (error.errors) {
        for (var i = 0; i < Object.keys(error.errors).length; i++) {
            key[i] = Object.keys(error.errors)[i];
            message[i] = error.errors[key[i]].properties.message
        }
        for (var i = 0; i < key.length; i++) {
            obj[key[i]] = message[i];
        }
        // console.log('error ', error);
        console.log({ error: error._message, errorFeilds: obj });
        res.status(500).send({ error: error._message, errorFeilds: obj });
    }
    else if (error.name == 'CastError') {
        const obj = {
            [error.path]: {
                Given: '\"' + error.value + '\"' + ' (' + error.reason.valueType + ')',
                Required: error.kind
            }
        };
        console.log({ error: error.message, errorFeilds: obj });
        res.status(500).send({ error: error.message, errorFeilds: obj });
    }
    else {
        console.log('error ', error);
        res.status(500).send({ error: error.message });
    }
}

module.exports = handleForError;