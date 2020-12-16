import { useState } from 'react';
import axios from 'axios';

import Uploader from './components/Uploader';

const App = () => {
    const [imagesFile, setImagesFile] = useState([]);
    const treshold = 0.2;

    const analyzeImages = () => {
        let formData = new FormData();

        imagesFile.map((imageFile) => formData.append('images_file', imageFile));

        axios({
            method: 'post',
            url: 'http://localhost:5000/analyze-images?treshold=' + treshold,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <div className="flex flex-col justify-center items-center bg-gray-100 p-8 w-screen h-screen">
                <h1 className="font-bold text-lg mb-8">
                    IBM Mask Detector
                </h1>
                <div className="w-1/3 shadow rounded overflow-hidden">
                    <Uploader setImagesFile={setImagesFile} />

                    <button onClick={() => analyzeImages()} className="bg-green-500 w-full text-white text-sm font-bold px-4 py-3">
                        Detect Masks
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
