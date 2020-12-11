const fs = require('fs');
const path = require('path');
const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const VisualRecognitionV4 = require('ibm-watson/visual-recognition/v4');
const { IamAuthenticator } = require('ibm-watson/auth');

const PORT = process.env.PORT || 5000;;
const app = express();

env.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/analyze-images', function (req, res) {
    const form = new multiparty.Form();
    const visualRecognition = new VisualRecognitionV4({
        version: '2020-12-03',
        authenticator: new IamAuthenticator({ apikey: process.env.IBM_SERVICE_API_KEY, }),
        serviceUrl: process.env.IBM_SERVICE_URL,
    });

    form.parse(req, function (_, __, files) {
        let imagesFile = [];

        files['images_file'].map((file) => {
            imagesFile.push({
                data: fs.createReadStream(file.path),
                contentType: 'image/jpeg',
            });

            return false;
        })

        const params = {
            imagesFile: imagesFile,
            collectionIds: [process.env.IBM_COLLECTION_ID],
            features: ['objects'],
            threshold: 0.2,
        };

        visualRecognition.analyze(params)
            .then(response => {
                console.log(JSON.stringify(response.result, null, 2));

                res.json(response.result);
            })
            .catch(err => {
                console.log('error: ', err);

                res.json(err);
            });
    });

});

// Run the built React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, function () {
    console.log(`Server istening on port ${PORT} at ${new Date()}`)
});