'use client'


import React, { ChangeEvent, useState } from "react";
export default function FileUploader() {
    //const [imageUrl, setImageUrl] = useState("/images/test.jpg");

    const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;

        if (!fileInput.files) {
            console.warn("no file was chosen");
            return;
        }

        if (!fileInput.files || fileInput.files.length === 0) {
            console.warn("files list is empty");
            return;
        }

        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload_s3/", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("something went wrong, check your console.");
                return;
            }

            const data: { fileUrl: string } = await res.json();
            console.log(data);
            //setImageUrl(data.fileUrl);
        } catch (error) {
            console.error("something went wrong, check your console.");
        }

        e.target.type = "text";
        e.target.type = "file";
    };

    return (
        <label
            // className={styles["file-uploader"]}
            style={{ paddingTop: `calc(100% * (${446} / ${720}))` }}
        >
            <input
                style={{ display: "block" }}
                type="file"
                onChange={onImageFileChange}
            />
        </label>
    );
}

