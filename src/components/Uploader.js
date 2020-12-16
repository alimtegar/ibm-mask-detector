import React, { useEffect, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const Uploader = ({ setImagesFile, detection }) => {
    const [files, setFiles] = useState([]);
    const canvasRef = useRef();

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setImagesFile(acceptedFiles);

            setFiles(acceptedFiles.map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map((file) => (
        <img
            key={file.name}
            src={file.preview}
            alt={file.name}
        />
    ));

    const renderDetectionBox = () => {
        console.log(detection.data);

        const ctx = canvasRef.current.getContext('2d');

        ctx.canvas.width = detection.data.dimensions.width;
        ctx.canvas.height = detection.data.dimensions.height;
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        detection.data.objects.collections[0].objects.map((dataItem) => {
            const label = dataItem.object;
            const x = dataItem.location.left;
            const y = dataItem.location.top;
            const w = dataItem.location.width;
            const h = dataItem.location.height;
            let color = 'green';

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);
        });



        // result.data.images.map((image) => {

        // })
    }

    if (Object.keys(detection.data).length) { renderDetectionBox(); }

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container bg-white p-4">
            {!files.length ? (
                <div {...getRootProps({ className: 'dropzone flex flex-col justify-center items-center w-80 h-80 text-center text-gray-500 text-sm border-2 border-dashed border-gray-300 hover:border-green-500 rounded-sm outline-none cursor-pointer' })}>
                    <input {...getInputProps()} />

                    <span className="font-bold mb-1">
                        Upload Image
                    </span>
                    <span className="w-2/3 text-xs">
                        Drag and drop or click this area to upload your image file.
                    </span>
                </div>
            ) : (
                    <aside className="relative flex justify-center items-center bg-gray-500 w-80 overflow-hidden">
                        {thumbs}
                        <canvas
                            ref={canvasRef}
                            className="absolute"
                        // width="100%"
                        // height="100%"
                        />
                    </aside>
                )}
        </section>
    );
}

export default Uploader;