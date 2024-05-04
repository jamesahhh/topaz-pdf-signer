"use client";
import { useEffect } from "react";
import ClientSideTopaz from "../component/client-side-topaz";
import styles from "./page.module.css";
import "@mantine/dropzone/styles.css";
import { Title } from "@mantine/core";
declare global {
	interface Window {
		Topaz: any; // Use 'any' if you don't know the type, or replace 'any' with a more specific type if known
	}
}

export default function Home() {
	useEffect(() => {
		if (
			document.documentElement.getAttribute(
				"SigPlusExtLiteExtension-installed"
			) != "true"
		) {
			throw Error("Extension must be installed");
		}
	});

	return (
		<main className={styles.main}>
			<ClientSideTopaz />
		</main>
	);
}
