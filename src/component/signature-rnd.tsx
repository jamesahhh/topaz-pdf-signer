`use client`;

import { Rnd } from "react-rnd";
import styles from "./signature-rnd.module.css";
import { ActionIcon, Button, Text } from "@mantine/core";
import {
	IconDragDrop,
	IconGripVertical,
	IconResize,
	IconTrashX,
} from "@tabler/icons-react";
import { useResizeObserver } from "@mantine/hooks";
function SignatureRnD({
	pushed,
	canvas_sign,
	capture_sign,
	coords: { x, y },
	index,
	sigsHandler,
	dims: { width, height },
	dragging,
}: {
	dragging: any;
	sigsHandler: any;
	index: number;
	pushed: boolean;
	canvas_sign: any;
	capture_sign: any;
	coords: { x: number; y: number };
	dims: { width: number; height: number };
}) {
	const handleSign = async (e: any) => {
		e.stopPropagation();
		const el = e.target;
		const ctx = el.getContext("2d");
		await capture_sign.StartSign();
		var img = new Image();

		//on load will remove all pure white pixels, may leave artifacts around signature, not noticeable in print
		img.onload = function () {
			ctx?.drawImage(img, 0, 0, el?.width, el?.height);

			var imgd = ctx.getImageData(0, 0, el.width, el.height),
				pix = imgd.data,
				newColor = { r: 0, g: 0, b: 0, a: 0 };

			for (var i = 0, n = pix.length; i < n; i += 4) {
				var r = pix[i],
					g = pix[i + 1],
					b = pix[i + 2];

				if (r == 255 && g == 255 && b == 255) {
					// Change the white to the new color.
					pix[i] = newColor.r;
					pix[i + 1] = newColor.g;
					pix[i + 2] = newColor.b;
					pix[i + 3] = newColor.a;
				}
			}

			ctx.putImageData(imgd, 0, 0);

			//toDataURL returns b64 png string after re-drawn
			sigsHandler.setItemProp(index, "b64", el.toDataURL());
		};
		await capture_sign.SetPenDetails("#000000", 5);
		console.log(await capture_sign.SetImageDetails(2, 150, 50, true, true, 0));
		const b64 = await capture_sign.GetSignatureImage();

		img.src = "data:image/png;base64," + b64;
	};
	const removePixels = (canvas: HTMLCanvasElement) => {
		const ctx = canvas.getContext("2d");
		if (ctx != null) {
			const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData?.data; // the array of RGBA values

			if (data != null) {
				// Loop over each pixel and set the alpha to 0 for white pixels
				for (let i = 0; i < data.length; i += 4) {
					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];
					// Assuming white is RGB(255, 255, 255), you might need to adjust the tolerance
					if (r === 255 && g === 255 && b === 255) {
						data[i + 3] = 0; // Set alpha to 0 (transparent)
					}
				}
			}
			// Write the modified image data back to the canvas
			ctx.putImageData(imageData, 0, 0);
			console.log("here");
		}
	};
	const handleMove = (e: any, data: any) => {
		console.log(data);
		dragging.toggle();
		e.stopPropagation();
		sigsHandler.setItemProp(index, "x", data.x);
		sigsHandler.setItemProp(index, "y", data.y);
	};
	return (
		<Rnd
			bounds={"parent"}
			position={{ x: x, y: y }}
			size={{ width: width, height: height }}
			enableResizing={{
				bottom: false,
				bottomLeft: false,
				bottomRight: true,
				left: false,
				right: false,
				top: false,
				topLeft: false,
				topRight: false,
			}}
			lockAspectRatio={true}
			resizeHandleComponent={{
				bottomRight: <IconResize />,
			}}
			resizeHandleClasses={{ bottomRight: styles.resizer }}
			onClick={(e: any) => {
				e.stopPropagation();
			}}
			onDragStart={(e: any) => {
				dragging.toggle();
				e.stopPropagation();
			}}
			onDragStop={handleMove}
			onResizeStart={(e: any) => {
				dragging.toggle();
				e.stopPropagation();
			}}
			onResizeStop={(e: any, dir: any, ref: any, delta: any, position: any) => {
				console.log(position);
				dragging.toggle();
				e.stopPropagation();
				sigsHandler.setItemProp(index, "x", position.x + ref.clientWidth / 2);
				sigsHandler.setItemProp(index, "y", position.y + ref.clientHeight / 2);
				sigsHandler.setItemProp(index, "width", ref.clientWidth);
				sigsHandler.setItemProp(index, "height", ref.clientHeight);
			}}
			dragHandleClassName={`dragHandle-${index}`}
		>
			<canvas
				className={styles.canvas}
				onClick={handleSign}
			>
				{/* Fallback Content */}
				Your browser does not support the canvas element.
			</canvas>
			<div className={`${styles.control_group}`}>
				<ActionIcon
					variant="subtle"
					className={`${styles.control}`}
					onClick={(e) => {
						e.stopPropagation();
						sigsHandler.remove(index);
					}}
				>
					<IconTrashX />
				</ActionIcon>
				<ActionIcon
					variant="subtle"
					className={`${styles.control} dragHandle-${index}`}
					onClick={(e) => e.stopPropagation()}
				>
					<IconDragDrop />
				</ActionIcon>
				<Text>{`${x}, ${y}`}</Text>
			</div>
		</Rnd>
	);
}

export default SignatureRnD;
