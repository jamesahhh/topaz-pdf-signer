"use client";

import { Box, Button, Chip, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import styles from "./topaz.module.css";

function ClientSideTopaz({
	global,
	gemview,
	opener,
	canvas_sign,
	capture_sign,
}: {
	opener: any;
	global: any;
	gemview: any;
	canvas_sign: any;
	capture_sign: any;
}) {
	const [pushed, handlers] = useDisclosure(false);
	const [sig_b64, setSig] = useState("");
	const [operator, setOperator] = useState<any>(null);
	const [signed, setSigned] = useState(false);

	return (
		<>
			{signed && (
				<NextImage
					src={`data:image/png;base64,${sig_b64}`}
					alt="Signature Container"
					width={300}
					height={150}
				/>
			)}
			{sig_b64}
			<Chip defaultChecked>Checkers</Chip>

			{!pushed ? (
				<Button
					variant="filled"
					color="red"
					fullWidth
					onClick={async () => {
						setOperator(window.open("/operator"));
						await gemview.CloseIdleScreen();
						await gemview.PushCurrentTab();
						handlers.toggle();
					}}
				>
					Push Tab to Signature Pad
				</Button>
			) : (
				<Container>
					<Box
						className={styles.canvas}
						bg="blue.3"
					>
						<canvas
							className={styles.canvas}
							onClick={async () => {
								const el = document.getElementById(
									"myCanvas"
								) as HTMLCanvasElement;
								const ctx = el.getContext("2d");
								console.log(await capture_sign.StartSign(false, 1, 0, ""));
								var img = new Image();
								img.onload = function () {
									ctx?.drawImage(img, 0, 0, el?.width, el?.height); //Set the canvas to contain the signature image
								};

								img.src =
									"data:image/png;base64," +
									(await capture_sign.GetSignatureImage());
							}}
							id="myCanvas"
							width="300"
							height="150"
						></canvas>
					</Box>
					<Group>
						<Button
							onClick={async () =>
								await capture_sign.StartSign(false, 1, 0, "")
							}
						>
							Sign
						</Button>
						<Button
							onClick={async () => {
								if (capture_sign.IsSigned()) {
									setSig(await capture_sign.GetSignatureImage());
									gemview.StopCaptureGemViewScreen();
									capture_sign.SignComplete();
								}
								await gemview.RevertCurrentTab(1);
								setTimeout(() => operator.close(), 750);
								await gemview.LoadIdleScreen();
								handlers.toggle();
							}}
						>
							Done
						</Button>
					</Group>
				</Container>
			)}
		</>
	);
}

export default ClientSideTopaz;
