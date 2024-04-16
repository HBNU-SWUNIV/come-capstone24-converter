'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useState } from "react";
import styles from "../styles/navigation.module.css";

export default function Navigation() {
    const path = usePathname();
    // const [count, setCount] = useState(0);

    return (
        <nav className={styles.nav}>
            <ul>
            <li>
                /<Link href="/">Home </Link> {path == "/" ? "＠ " : ""}
            </li>
            <li>
                <Link href="/upload">Upload </Link>
                {path == "/upload" ? " ＠ " : ""}
            </li>
            </ul>
        </nav>
    );
}