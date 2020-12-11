import { useState } from 'react';
import axios from 'axios';


import Uploader from './components/Uploader';

const App = () => {
    const [imagesFile, setImagesFile] = useState([]);

    const analyzeImages = () => {
        let formData = new FormData();

        imagesFile.map((imageFile) => formData.append('images_file', imageFile));

        axios({
            method: 'post',
            url: 'http://localhost:5000/analyze-images',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    };

    return (
        <div className="App">
            <Uploader setImagesFile={setImagesFile} />

            <button onClick={() => analyzeImages()}>
                Submit
            </button>
        </div>
    );
}

export default App;
