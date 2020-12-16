import { useState } from 'react';
import axios from 'axios';

import Uploader from './components/Uploader';

const App = () => {
    const treshold = 0.2;
    const initDetection = {
        isLoading: false,
        data: {},
    };

    const [files, setFiles] = useState([]);
    const [imagesFile, setImagesFile] = useState([]);
    const [detection, setDetection] = useState(initDetection);

    const analyzeImages = () => {
        setDetection({
            ...detection,
            isLoading: true,
        });

        let formData = new FormData();

        imagesFile.map((imageFile) => formData.append('images_file', imageFile));

        axios({
            method: 'post',
            url: 'http://localhost:5000/analyze-images?treshold=' + treshold,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((response) => {
                setDetection({
                    isLoading: false,
                    data: response.data.images[0],
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const removeImages = () => { 
        setFiles([]); 
        setImagesFile([]);
        setDetection(initDetection); 
    };

    return (
        <div>
            <div className="flex flex-col justify-center items-center bg-gray-100 p-8 w-screen h-screen">
                <div className="text-center mb-8">
                    <h1 className="font-bold text-lg leading-none">
                        IBM Mask Detector
                    </h1>
                    <span className="font-bold text-xs text-gray-700">v1.0</span>
                </div>
                <div className="shadow rounded overflow-hidden">
                    <Uploader
                        setFiles={setFiles}
                        files={files}
                        setImagesFile={setImagesFile}
                        detection={detection}
                    />

                    <button
                        onClick={
                            detection.isLoading && !Object.keys(detection.data).length
                                ? () => { }
                                : Object.keys(detection.data).length
                                    ? () => removeImages()
                                    : () => analyzeImages()
                        }
                        className={`w-full text-white text-sm font-bold px-4 py-3 focus:outline-none ${detection.isLoading && !Object.keys(detection.data).length
                            ? 'bg-gray-400'
                            : Object.keys(detection.data).length
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {
                            detection.isLoading && !Object.keys(detection.data).length
                                ? 'Loading...'
                                : Object.keys(detection.data).length
                                    ? 'Reset'
                                    : 'Detect Masks'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
