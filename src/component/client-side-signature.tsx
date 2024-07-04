import { Box, Button, Container, Group, Stack } from "@mantine/core";
import styles from "./client-side-signature.module.css";
import { useEffect, useState } from "react";
function SignatureStepper({
	capture_sign,
	gemview,
	operator,
	handlers,
	sig_count,
	sigs_b64,
	sigsHandler,
	pushed,
}: {
	pushed: boolean;
	capture_sign: any;
	gemview: any;
	operator: any;
	handlers: any;
	sig_count: number;
	sigs_b64: string[];
	sigsHandler: any;
}) {
	let startX: number, startY: number;
	let isDragging: boolean = false;
	const [drag_target, setTarget] = useState<HTMLCanvasElement>();

	const canvas_els = () => {
		const canvas = [];
		for (let i = 0; i < 2; i++) {
			canvas.push(
				<canvas
					className={styles.canvas}
					onClick={async () => {
						if (pushed) {
							const el = document.getElementById(
								`signaturecanvas-${i}`
							) as HTMLCanvasElement;
							const ctx = el.getContext("2d");
							await capture_sign.StartSign(false, 1, 0, "");
							var img = new Image();
							img.onload = function () {
								ctx?.drawImage(img, 0, 0, el?.width, el?.height); //Set the canvas to contain the signature image
							};
							const b64 = await capture_sign.GetSignatureImage();
							img.src = "data:image/png;base64," + b64;
							sigsHandler.insert(i, b64);
						}
					}}
					onMouseDown={(e) => onMouseDown(e)}
					id={`signaturecanvas-${i}`}
				>
					{/* Fallback Content */}
					Your browser does not support the canvas element.
				</canvas>
			);
			var ele = document.getElementById(
				`signaturecanvas-${i}`
			) as HTMLCanvasElement;
			ele?.addEventListener("mousedown", onMouseDown);
		}
		return canvas;
	};

	const return_button = () => {
		async function onDone() {
			if (capture_sign.IsSigned()) {
				const img = await capture_sign.GetSignatureImage();
				await gemview.StopCaptureGemViewScreen();
				await capture_sign.SignComplete();
			}
			gemview.RevertCurrentTab(1);
			setTimeout(() => operator.close(), 750);
			gemview.LoadIdleScreen();
			handlers.toggle();
		}

		return <Button onClick={onDone}>Done</Button>;
	};

	function onMouseDown(e: any): void {
		console.log(e.target.offsetLeft);
		setTarget(e.target);
		startX = e.clientX - e.target.offsetLeft;
		startY = e.clientY - e.target.offsetTop;
		isDragging = true;
	}

	return (
		<Box
			id="sigs_box"
			className={styles.canvas_container}
			onMouseMove={(e) => {
				if (isDragging && drag_target) {
					const x = e.clientX - startX;
					const y = e.clientY - startY;
					console.log(drag_target);
					// Set the new position of the canvas
					drag_target.style.left = `${x}px`;
					drag_target.style.top = `${y}px`;
				}
			}}
			onMouseUp={(e) => {
				console.log("up");
				isDragging = false;
			}}
		>
			{canvas_els()}
			{/* {return_button()} */}
		</Box>
	);
}

export default SignatureStepper;
