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

class TopazError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TOPAZ_ERROR";
	}
}

export default function Home() {
	useEffect(() => {
		var extInstalled = document.documentElement.getAttribute(
			"SigPlusExtLiteExtension-installed"
		);
		if (extInstalled != "true") {
			throw new TopazError("Extension Missing");
		} else {
		}
	});

	return (
		<main className={styles.main}>
			<ClientSideTopaz />
		</main>
	);
}
