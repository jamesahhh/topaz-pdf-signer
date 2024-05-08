"use client";

import {
	Box,
	Button,
	NumberInput,
	NumberInputHandlers,
	ScrollArea,
} from "@mantine/core";
import { useDisclosure, useElementSize, useListState } from "@mantine/hooks";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState } from "react";
import { Document, Page, Thumbnail, pdfjs } from "react-pdf";
import SignControls from "./sign-controls";
import SignatureRnD from "./signature-rnd";
import styles from "./client-side-topaz.module.css";
import { Sig } from "./types";

function ClientSideTopaz() {
	const [pushed, handlers] = useDisclosure(false);
	const [sigs_b64, sigsHandler] = useListState<Sig>([]);
	const [operator, setOperator] = useState<any>(null);

	let url = useRef<any>();
	const handlersRef = useRef<NumberInputHandlers>(null);
	const pageRef = useRef<HTMLDivElement>(null);
	const [curr_page, setPage] = useState(1);

	let [gemview, setGemview] = useState<any>(null);
	let [canvas_sign, setCanvas] = useState<any>(null);

	let [capture_sign, setCapture] = useState<any>(null);
	const [files, setFiles] = useState<File | null>(null);
	const [dragging, dragHandler] = useDisclosure(false);
	const { ref, width, height } = useElementSize();
	const [docScale, setDocScale] = useState<number | undefined>(1);

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
				setGemview(window.Topaz.GemView);
				setCanvas(window.Topaz.Canvas.Sign);

				setCapture(window.Topaz.SignatureCaptureWindow.Sign); // Assuming 'Topaz' is now available on the 'window' object
			}
		};

		document.body.appendChild(script);
	}, []);

	async function pushOperator() {
		console.log(window);
		setOperator(window.open("/operator", "ctrlOperator"));
		await gemview.CloseIdleScreen();
		await gemview.PushCurrentTab();
		handlers.toggle();
	}

	async function handleReturn() {
		await gemview.RevertCurrentTab(1);
		operator.close();
		gemview.LoadIdleScreen();
		handlers.toggle();
	}

	async function pushDocument(
		files: File | null,
		width: number,
		docScale: number | undefined
	) {
		if (files != null && docScale) {
			const result = await files.arrayBuffer(); //read file to buffer

			const doc = await PDFDocument.load(result);
			const pages = doc.getPages();
			const firstPage = pages[0];
			const { width: docw, height: doch } = firstPage.getSize();
			const scale = docw / width;
			sigs_b64.map(async (sig, i) => {
				const image = await doc.embedPng(sig.b64);

				await firstPage.drawImage(image, {
					x: (sig.x / docScale) * scale,
					y:
						doch - (sig.y / docScale) * scale - (sig.height / docScale) * scale,
					width: (sig.width / docScale) * scale,
					height: (sig.height / docScale) * scale,
				});
			});

			const docBytes = await doc.save();

			//convert to blob and save
			const blob = new Blob([docBytes]);
			saveAs(blob, files.name);
		}
	}

	function addSigElement(event: any, docScale: number | undefined) {
		if (pageRef.current && event.target.dir == "ltr" && docScale) {
			const rect = pageRef.current.getBoundingClientRect();
			const x = event.clientX - rect.left * docScale; // x position within the element.
			const y = event.clientY - rect.top * docScale; // y position within the element.

			console.log(`Click position within element: x: ${x}, y: ${y}`);
			sigsHandler.append({
				b64: "",
				x: x,
				y: y,
				width: 300,
				height: 150,
				scale: docScale,
			});
		}
	}

	const sig_els = sigs_b64.map((sig, i) => (
		<SignatureRnD
			docScale={sig?.scale}
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
		<Box className={styles.topaz_container}>
			<Box
				data-files={files !== null}
				data-pushed={pushed}
				className={styles.topaz_document_container}
			>
				{/* {files && (
				<div className={"preview"}>
				<Document file={files}>
				<Thumbnail
				pageNumber={curr_page}
				scale={0.1}
				/>
				</Document>
				</div>
			)} */}
				<div
					className={styles.document}
					ref={ref}
				>
					{files && (
						<Document
							file={files}
							renderMode="canvas"
						>
							<ScrollArea
								h="100vh"
								w={width}
							>
								<div
									ref={pageRef}
									className="canvas_container"
									onMouseUp={(e) => !dragging && addSigElement(e, docScale)}
								>
									<Page
										renderTextLayer={false}
										renderAnnotationLayer={false}
										pageNumber={curr_page}
										width={width}
										scale={docScale}
										renderForms={false}
									>
										{sig_els}
									</Page>
								</div>
							</ScrollArea>
						</Document>
					)}
				</div>
			</Box>
			{!pushed && (
				<SignControls
					docScale={docScale}
					sigs_b64={sigs_b64}
					pushDocument={pushDocument}
					files={files}
					setFiles={setFiles}
					pushOperator={pushOperator}
					width={width}
				/>
			)}
			<Button
				data-pushed={pushed}
				className={styles.pushed}
				onClick={handleReturn}
			>
				This
			</Button>
			<NumberInput
				className={styles.scale}
				value={docScale}
				step={0.05}
				stepHoldDelay={500}
				stepHoldInterval={100}
				onChange={(value) => {
					setDocScale(Number(value));
				}}
			/>
		</Box>
	);
}

export default ClientSideTopaz;
