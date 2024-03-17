"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import ClientSideTopaz from "../component/client-side-topaz";

declare global {
	interface Window {
		Topaz: any; // Use 'any' if you don't know the type, or replace 'any' with a more specific type if known
	}
}

export default function Home() {
	let url = useRef<any>();
	let [global, setGlobal] = useState<any>(null);
	let [gemview, setGemview] = useState<any>(null);
	let [canvas_sign, setCanvas] = useState<any>(null);
	let [canvas_lcd, setLcd] = useState<any>(null);
	let [capture_sign, setCapture] = useState<any>(null);
	let [opener, setOpener] = useState<any>(null);

	useEffect(() => {
		url.current = document.documentElement.getAttribute(
			"SigPlusExtLiteWrapperURL"
		);
		console.log(url.current);
		var script = document.createElement("script");
		script.src = url.current;
		script.onload = () => {
			if (window.Topaz) {
				setGlobal(window.Topaz.Global);
				setGemview(window.Topaz.GemView);
				setCanvas(window.Topaz.Canvas.Sign);
				setLcd(window.Topaz.Canvas.LCDTablet);
				setCapture(window.Topaz.SignatureCaptureWindow.Sign); // Assuming 'Topaz' is now available on the 'window' object
			}
		};
		if (window.opener) {
			setOpener(window.opener);
		}
		document.body.appendChild(script);
	}, []);
	return (
		<main className={styles.main}>
			<ClientSideTopaz
				opener={opener}
				global={global}
				gemview={gemview}
				canvas_sign={canvas_sign}
				capture_sign={capture_sign}
			/>
		</main>
	);
}
