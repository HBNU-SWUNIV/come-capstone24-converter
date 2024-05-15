'use client'
import { useRouter } from "next/navigation";
import buttonStyles from "../styles/button.module.css"; 

import React, { ChangeEvent, useState } from "react";

export default function TableExtract(){
    const router = useRouter();
    return(
        <label
        // className={styles["file-uploader"]}
    >
        <button className={buttonStyles["btn-16"]}onClick={() => router.push('/upload')}>Table Extract</button>
    </label>
    )
}