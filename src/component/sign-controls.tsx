import {
	Box,
	Button,
	FileButton,
	Group,
	List,
	SegmentedControl,
	Text,
	Title,
} from "@mantine/core";
import {
	IconDeviceDesktopShare,
	IconFileUpload,
	IconMouse,
	IconScript,
	IconSignature,
} from "@tabler/icons-react";
import styles from "./sign-controls.module.css";
import { Sig } from "./types";
import { useState } from "react";

function SignControls({
	value,
	setValue,
	setFiles,
	pushOperator,
	files,
	pushDocument,
	pushedToggle,
	sigs_b64,
	sigs_handler,
	width,
	docScale,
}: {
	value: string;
	setValue: (payload: string) => void;
	sigs_b64: Sig[];
	sigs_handler: any;
	files: File | null;
	pushDocument: (
		file: File | null,
		width: number,
		docScale: number | undefined
	) => void;
	pushedToggle: () => void;
	pushOperator: () => void;
	setFiles: (payload: File | null) => void;
	width: number;
	docScale: number | undefined;
}) {
	return (
		<Box
			data-file={files !== null}
			className={styles.sign_controls}
		>
			{files && (
				<SegmentedControl
					transitionDuration={500}
					transitionTimingFunction="linear"
					value={value}
					onChange={setValue}
					color="#C94277"
					data={[
						{ value: "mouse", label: <IconMouse /> },
						{ value: "signatures", label: <IconSignature /> },
					]}
				></SegmentedControl>
			)}

			<Text
				// data-file={files != null}
				className={styles.instructions}
			>
				{files
					? "Click anywhere on the document to add a signature field"
					: "Upload a PDF document to get started!"}
			</Text>
			<List
				data-file={files == null}
				className={styles.instructions_list}
				type="ordered"
			>
				<List.Item>
					Click anywhere on the document to add a signature field
				</List.Item>
				<List.Item>Resize signature with its bottom right corner</List.Item>
			</List>
			<Group p="md">
				<FileButton
					onChange={(files) => {
						setFiles(files);
						sigs_handler.setState([]);
					}}
					accept="application/pdf"
				>
					{(props) => (
						<Button
							data-file={files != null}
							radius={"lg"}
							color="#EB5E28"
							autoContrast
							variant="filled"
							rightSection={<IconFileUpload />}
							{...props}
						>
							{files ? "New" : "Select PDF Document"}
						</Button>
					)}
				</FileButton>
				<Button
					data-file={files != null}
					className={styles.button}
					color="#403D39"
					autoContrast
					radius={"lg"}
					onClick={() => {
						sigs_handler.setState([]);
					}}
				>
					{files ? "Clear" : "Clear PDF Document"}
				</Button>
			</Group>
			<Button
				className={styles.button}
				data-file={files != null}
				variant="filled"
				radius={"lg"}
				rightSection={<IconDeviceDesktopShare />}
				onClick={pushOperator}
			>
				Open Operator Window
			</Button>
			<Button
				className={styles.button}
				variant="filled"
				color="red"
				data-file={files != null && sigs_b64.length > 0}
				onClick={() => {
					pushDocument(files, width, docScale);
				}}
				rightSection={<IconScript />}
			>
				Save Document
			</Button>
			<div
				className={[styles.logo, styles["logo-holder"]].join(" ")}
				data-file={files !== null}
			>
				<h3>HRCU</h3>
				<p>PDF Document Signer</p>
			</div>
		</Box>
	);
}

export default SignControls;
