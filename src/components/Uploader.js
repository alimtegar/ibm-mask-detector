import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
};

const thumb = {
    display: 'inline-flex',
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
};

const Uploader = ({ setImagesFile }) => {
    const [files, setFiles] = useState([]);
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
        <div style={thumb} key={file.name} className="bg-white w-full">
            <div style={thumbInner}>
                <img
                    className="w-full"
                    src={file.preview}
                    style={img}
                    alt="Preview"
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container bg-white p-4">
            {!files.length ? (
                <div {...getRootProps({ className: 'dropzone flex flex-col justify-center h-80 text-center text-gray-500 text-sm border-2 border-dashed border-gray-300 hover:border-green-500 rounded-sm outline-none cursor-pointer' })}>
                    <input {...getInputProps()} />

                    <span className="font-bold mb-1">
                        Upload Image
                    </span>
                    <span className="text-xs">
                        Drag and drop your image file here.
                    </span>

                </div>) : (
                    <aside style={thumbsContainer}>
                        {thumbs}
                    </aside>
                )}
        </section>
    );
}

export default Uploader;