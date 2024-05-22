import {
	Box,
	Button,
	FileButton,
	Group,
	List,
	Text,
	Title,
} from "@mantine/core";
import {
	IconDeviceDesktopShare,
	IconFileUpload,
	IconScript,
} from "@tabler/icons-react";
import styles from "./sign-controls.module.css";
import { Sig } from "./types";

function SignControls({
	setFiles,
	pushOperator,
	files,
	pushDocument,
	pushedToggle,
	sigs_b64,
	width,
	docScale,
}: {
	sigs_b64: Sig[];
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
				<List.Item>Resize signature with the bottom right corner</List.Item>
				<List.Item>Move/Delete with the Icons on the bottom left</List.Item>
			</List>
			<Group p="md">
				<FileButton
					onChange={setFiles}
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
				Push Form to Signer
			</Button>
			<Button
				className={styles.button}
				variant="filled"
				color="red"
				data-file={files != null && sigs_b64.length > 0}
				onClick={() => {
					pushDocument(files, width, docScale);
					pushedToggle();
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
