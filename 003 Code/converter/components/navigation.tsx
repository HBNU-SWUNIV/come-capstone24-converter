'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "../styles/navigation.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navigation() {
    const path = usePathname();

    return (
        <div className={styles.container}>
            <ul>
                <li className={path === "/" ? styles.active : ""}>
                    <Link href="/" className={styles.navLink}>
                       
                            <i className="bi bi-house-door-fill"></i> Converter
                        
                    </Link>
                    {path === "/" ? "  " : ""}
                </li>
                {/*<li className={path === "/upload" ? styles.active : ""}>
                    <Link href="/upload" className={styles.navLink}>
                        
                            <i className="bi bi-upload"></i> Upload
                       
                    </Link>
                    {path === "/upload" ? " " : ""}
                </li>*/}
              
            </ul>
        </div>
    );
}