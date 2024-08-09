'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "../styles/navigation.module.css";


export default function Navigation() {
    const path = usePathname();

    return (
        <nav className={styles.nav}>
                <div className={path === "/" ? styles.active : ""}>
                    <Link href="/" className={styles.link}>
                            Converter
                    </Link>
                    {path === "/" ? "  " : ""}
                </div>
        </nav>
    );
}




















