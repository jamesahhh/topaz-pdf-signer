"use client";
import styles from "./operator.module.css";
import { useEffect, useRef, useState } from "react";
import ClientSideOperator from "../../component/client-side-operator";

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
		var script = document.createElement("script");
		script.src = url.current;
		script.onload = () => {
			if (window.Topaz) {
				setGlobal(window.Topaz.Global);
				setGemview(window.opener.Topaz.GemView);
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
			<ClientSideOperator
				gemview={gemview}
				opener={opener}
			/>
		</main>
	);
}
