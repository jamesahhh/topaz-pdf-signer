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

function SignControls({
	setFiles,
	pushOperator,
	files,
	pushDocument,
}: {
	files: File | null;
	pushDocument: (file: File | null) => void;
	pushOperator: () => void;
	setFiles: (payload: File | null) => void;
}) {
	return (
		<Box
			data-file={files != null}
			className={styles.sign_controls}
		>
			<Text className={styles.instructions}>
				Upload a PDF document to get started!
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
							radius={"lg"}
							rightSection={<IconFileUpload />}
							{...props}
						>
							{files ? "Upload" : "Upload PDF Document"}
						</Button>
					)}
				</FileButton>
				<Button
					data-file={files != null}
					className={styles.button}
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
				variant="fillled"
				color="red"
				data-file={files == null}
				onClick={() => pushDocument(files)}
				rightSection={<IconScript />}
			>
				Save Document
			</Button>
			<div
				className={[styles.logo, styles["logo-holder"]].join(" ")}
				data-file={files !== null}
			>
				<h3>HRCU</h3>
				<p>Document Signer</p>
			</div>
		</Box>
	);
}

export default SignControls;
