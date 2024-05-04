"use client";

import { Box, ScrollArea } from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState } from "react";
import { Document, Page, Thumbnail, pdfjs } from "react-pdf";
import SignControls from "./sign-controls";
import SignatureRnD from "./signature-rnd";
import styles from "./client-side-topaz.module.css";
interface Sig {
	b64: string;
	x: number;
	y: number;
	width: number;
	height: number;
	cx: number;
	cy: number;
}

function ClientSideTopaz() {
	const [pushed, handlers] = useDisclosure(false);
	const [sigs_b64, sigsHandler] = useListState<Sig>([]);
	const [operator, setOperator] = useState<any>(null);

	let url = useRef<any>();
	const pageRef = useRef<HTMLDivElement>(null);
	const [curr_page, setPage] = useState(1);
	let [global, setGlobal] = useState<any>(null);
	let [gemview, setGemview] = useState<any>(null);
	let [canvas_sign, setCanvas] = useState<any>(null);
	let [canvas_lcd, setLcd] = useState<any>(null);
	let [capture_sign, setCapture] = useState<any>(null);
	const [files, setFiles] = useState<File | null>(null);
	const [dragging, dragHandler] = useDisclosure(false);

	// Load the PDF.js library from cdn
	pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

	// Loads topaz object from extension wrapper
	useEffect(() => {
		url.current = document.documentElement.getAttribute(
			"SigPlusExtLiteWrapperURL"
		);

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

		document.body.appendChild(script);
	}, []);

	async function pushOperator() {
		setOperator(window.open("/operator", "ctrlOperator"));
		await gemview.CloseIdleScreen();
		await gemview.PushCurrentTab();
		handlers.toggle();
	}

	async function pushDocument(files: File | null) {
		if (files != null) {
			const result = await files.arrayBuffer(); //read file to buffer

			const doc = await PDFDocument.load(result);
			const pages = doc.getPages();
			const firstPage = pages[0];
			const { width, height } = firstPage.getSize();
			console.log(width, height);
			sigs_b64.map(async (sig, i) => {
				const image = await doc.embedPng(sig.b64);

				await firstPage.drawImage(image, {
					x: sig.x / 2,
					y: height - sig.y / 2 - sig.height / 2,
					width: sig.width / 2,
					height: sig.height / 2,
				});
			});

			const docBytes = await doc.save();

			//convert to blob and save
			const blob = new Blob([docBytes]);
			saveAs(blob, files.name);
		}
	}

	function addSigElement(event: any) {
		if (pageRef.current && event.target.dir == "ltr") {
			const rect = pageRef.current.getBoundingClientRect();
			const x = event.clientX - rect.left; // x position within the element.
			const y = event.clientY - rect.top; // y position within the element.

			console.log(`Click position within element: x: ${x}, y: ${y}`);
			sigsHandler.append({
				b64: "",
				x: x,
				y: y,
				width: 300,
				height: 150,
				cx: x + 150 / 2,
				cy: 75,
			});
		}
	}

	const sig_els = sigs_b64.map((sig, i) => (
		<SignatureRnD
			dragging={dragHandler}
			key={`signatureRnd-${i}`}
			index={i}
			dims={{ width: sig.width, height: sig.height }}
			coords={{ x: sig.x, y: sig.y }}
			pushed={pushed}
			sigsHandler={sigsHandler}
			canvas_sign={canvas_sign}
			capture_sign={capture_sign}
		/>
	));

	return (
		<Box
			data-files={files !== null}
			className={styles.topaz_client_container}
		>
			{files && (
				<div className={"preview"}>
					<Document file={files}>
						<Thumbnail
							pageNumber={curr_page}
							scale={0.1}
						/>
					</Document>
				</div>
			)}
			{files && (
				<Document
					file={files}
					renderMode="canvas"
				>
					<ScrollArea h="100vh">
						<div
							ref={pageRef}
							className="canvas_container"
							onMouseUp={(e) => !dragging && addSigElement(e)}
						>
							<Page
								renderTextLayer={false}
								renderAnnotationLayer={false}
								pageNumber={curr_page}
								scale={2}
								renderForms={false}
							>
								{sig_els}
							</Page>
						</div>
					</ScrollArea>
				</Document>
			)}
			<SignControls
				pushDocument={pushDocument}
				files={files}
				setFiles={setFiles}
				pushOperator={pushOperator}
			/>
			{/* <>
				<Button
					className={styles.button}
					data-file={files != null}
					variant="filled"
					// color="red"
					rightSection={<IconDeviceDesktopShare />}
					onClick={pushOperator}
				>
					Push Form to Signer
				</Button>
				<FileButton
					onChange={setFiles}
					accept="application/pdf"
				>
					{(props) => <Button {...props}>Upload</Button>}
				</FileButton>
				<Button
					variant="fillled"
					color="red"
					data-file={files != null}
					onClick={() => pushDocument(files)}
					rightSection={<IconScript />}
				>
					Save Document
				</Button>
			</> */}
		</Box>
	);
}

export default ClientSideTopaz;
