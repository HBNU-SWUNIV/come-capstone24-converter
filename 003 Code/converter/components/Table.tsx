'use client'
import { useRouter } from "next/navigation";


import React, { ChangeEvent, useState } from "react";

export default function TableExtract(){
    const router = useRouter();
    return(
        <label
        // className={styles["file-uploader"]}
        style={{ paddingTop: `calc(100% * (${446} / ${720}))` }}
    >
        <button onClick={() => router.push('/upload')}>Table Extract</button>
    </label>
    )
}