"use client";
import { useEffect } from "react";
import ClientSideTopaz from "../component/client-side-topaz";
import styles from "./page.module.css";
import "@mantine/dropzone/styles.css";
declare global {
	interface Window {
		push: any;
		Topaz: any; // Use 'any' if you don't know the type, or replace 'any' with a more specific type if known
	}
}


export default function Home() {
	useEffect(() => {
		var extInstalled = document.documentElement.getAttribute(
			"SigPlusExtLiteExtension-installed"
		);
		if (extInstalled != "true") {
			throw Error("Extension must be installed");
		} else {
		}
	});

	return (
		<main className={styles.main}>
			<ClientSideTopaz />
		</main>
	);
}
