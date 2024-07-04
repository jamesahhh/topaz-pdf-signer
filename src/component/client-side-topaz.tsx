"use client";

import {
	ActionIcon,
	Affix,
	Box,
	Button,
	NumberInput,
	NumberInputHandlers,
	ScrollArea,
	Transition,
	rem,
} from "@mantine/core";
import {
	useCounter,
	useDisclosure,
	useElementSize,
	useListState,
} from "@mantine/hooks";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SignControls from "./sign-controls";
import SignatureRnD from "./signature-rnd";
import styles from "./client-side-topaz.module.css";
import { Note, Sig } from "./types";
import { IconArrowUp, IconCircleDashedCheck } from "@tabler/icons-react";
import { DndContext } from "@dnd-kit/core";
import { TextAreaRnd } from "./text-rnd";

function ClientSideTopaz() {
	const [pushed, handlers] = useDisclosure(false);
	const [sigs_b64, sigsHandler] = useListState<Sig>([]);
	const [text_area, textHandler] = useListState<Note>([]);
	const [operator, setOperator] = useState<any>(null);
	const [value, setValue] = useState<string>("mouse");
	var url = useRef<any>();
	const pageRef = useRef<HTMLDivElement>(null);
	const [curr_page, setPage] = useState(1);
	var [gemview, setGemview] = useState<any>(null);
	var [canvas_sign, setCanvas] = useState<any>(null);
	var [global, setGlobal] = useState<any>(null);
	var [capture_sign, setCapture] = useState<any>(null);
	const [files, setFiles] = useState<File | null>(null);
	const [dragging, dragHandler] = useDisclosure(false);
	const { ref, width, height } = useElementSize();

	// Load the PDF.js library from cdn
	pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

	//Loads library from npm package
	// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	// 	"pdfjs-dist/build/pdf.worker.min.mjs",
	// 	import.meta.url
	// ).toString();

	// Loads topaz object from extension wrapper
	useEffect(() => {
		url.current = document.documentElement.getAttribute(
			"SigPlusExtLiteWrapperURL"
		);

		var script = document.createElement("script");
		script.src = url.current;
		script.onload = async () => {
			if (window.Topaz) {
				setGlobal(window.Topaz.Global);
				setGemview(window.Topaz.GemView);
				setCanvas(window.Topaz.Canvas.Sign);
				setCapture(window.Topaz.SignatureCaptureWindow.Sign); // Assuming 'Topaz' is now available on the 'window' object
			}
		};

		document.body.appendChild(script);

		if (global) {
			global.GetDeviceStatus().then((status: Number) => {
				console.log(status);
			});
			global.Connect().then((status: Number) => {
				console.log(
					status == 1 ? "Connected to Topaz" : "Error COnnection to Topaz"
				);
			});
		}
	}, [global]);

	async function pushOperator() {
		setOperator(window.open("/operator", "ctrlOperator"));
		// await gemview.CloseIdleScreen();
		// await gemview.PushCurrentTab();
		handlers.toggle();
	}

	async function handleReturn() {
		await gemview.RevertCurrentTab(1);
		setValue("mouse");
		operator.close();
		await gemview.LoadIdleScreen();
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
			const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
			const pages = doc.getPages();
			const firstPage = pages[0];
			const { width: docw, height: doch } = firstPage.getSize();
			const scale = docw / 1100;
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

			text_area.map(async (note, i) => {
				await firstPage.drawText(note.text, {
					x: (note.x / docScale) * scale,
					y:
						doch -
						(note.y - (3 * scale) / docScale) * scale -
						note.fontSize * scale,
					font: helveticaFont,
					size: note.fontSize * scale,
					color: rgb(0, 0.53, 0.71),
					lineHeight: note.fontSize * scale,
				});
			});
			const docBytes = await doc.save();

			//convert to blob and save
			const blob = new Blob([docBytes]);
			saveAs(blob, files.name);
		}
	}

	function addSigElement(event: any) {
		if (pageRef.current && event.target.dir == "ltr" && 1 && !pushed) {
			const rect = pageRef.current.getBoundingClientRect();
			const x = event.clientX - rect.left * 1; // x position within the element.
			const y = event.clientY - rect.top * 1; // y position within the element.

			// sigsHandler.append({
			// 	b64: "",
			// 	x: x,
			// 	y: y,
			// 	width: 300,
			// 	height: 150,
			// 	scale: 1,
			// });
			sigsHandler.append(new Sig(x, y, 300, 150, 1));
		}
	}

	function addTextAreaElement(event: any) {
		if (pageRef.current && event.target.dir == "ltr" && 1 && !pushed) {
			const rect = pageRef.current.getBoundingClientRect();
			const x = event.clientX - rect.left * 1; // x position within the element.
			const y = event.clientY - rect.top * 1; // y position within the element.
			// textHandler.append({
			// 	x: x,
			// 	y: y,
			// 	width: 100,
			// 	height: 80,
			// 	text: "",
			// 	fontSize: 22,
			// 	lineHeight: 22,
			// });
			textHandler.append(new Note(x, y, 100, 80, "", 22, 22));
		}
	}

	const text_els = text_area.map((text_obj, i) => (
		<TextAreaRnd
			{...{
				pushed,
				text_obj,
				index: i,
				textHandler,
				dragging: dragHandler,
			}}
			key={`textAreaRnd-${i}`}
		/>
	));

	const sig_els = sigs_b64.map((sig, i) => (
		<SignatureRnD
			dragging={dragHandler}
			key={`signatureRnd-${i}`}
			index={i}
			dims={{ width: sig.width, height: sig.height }}
			coords={{ x: sig.x, y: sig.y }}
			pushed={pushed}
			pushedToggle={handlers.toggle}
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
				<div
					className={styles.document}
					ref={ref}
				>
					{files && (
						<Document
							file={files}
							renderMode="canvas"
							onMouseUp={(e) =>
								(!dragging && value === "signatures" && addSigElement(e)) ||
								(!dragging && value === "textarea" && addTextAreaElement(e))
							}
						>
							<div
								ref={pageRef}
								className={styles.canvas_container}
							>
								<Page
									renderTextLayer={false}
									renderAnnotationLayer={false}
									pageNumber={curr_page}
									width={1100}
									// scale={1}
									renderForms={false}
								>
									{text_els.concat(sig_els)}
								</Page>
							</div>
						</Document>
					)}
				</div>
			</Box>
			{!pushed && (
				<SignControls
					value={value}
					setValue={setValue}
					sigs_handler={sigsHandler}
					text_area={text_area}
					text_handler={textHandler}
					docScale={1}
					sigs_b64={sigs_b64}
					pushDocument={pushDocument}
					pushedToggle={handlers.toggle}
					files={files}
					setFiles={setFiles}
					pushOperator={pushOperator}
					width={width}
				/>
			)}
			<ActionIcon
				size={"10em"}
				variant="transparent"
				data-pushed={pushed}
				className={styles.pushed}
				onClick={handleReturn}
			>
				<IconCircleDashedCheck
					color="green"
					size={"auto"}
				/>
			</ActionIcon>
		</Box>
	);
}

export default ClientSideTopaz;
