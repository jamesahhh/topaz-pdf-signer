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
	pushedToggle,
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
	pushedToggle: () => void;
	canvas_sign: any;
	capture_sign: any;
	coords: { x: number; y: number };
	dims: { width: number; height: number };
}) {
	const handleSign = async (e: any) => {
		e.stopPropagation();
		if (!pushed) return;
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

				if (
					r >= 230 &&
					r <= 255 &&
					g >= 230 &&
					g <= 255 &&
					b >= 230 &&
					b <= 255
				) {
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
		const b64 = await capture_sign.GetSignatureImage();

		img.src = "data:image/png;base64," + b64;
	};

	const handleMove = (e: any, data: any) => {
		dragging.toggle();
		e.stopPropagation();
		sigsHandler.setItemProp(index, "x", data.x);
		sigsHandler.setItemProp(index, "y", data.y);
	};

	const handleResize = (
		e: any,
		dir: any,
		ref: any,
		delta: any,
		position: any
	) => {
		dragging.toggle();
		e.stopPropagation();
		sigsHandler.setItemProp(index, "x", position.x);
		sigsHandler.setItemProp(index, "y", position.y);
		sigsHandler.setItemProp(index, "width", ref.clientWidth);
		sigsHandler.setItemProp(index, "height", ref.clientHeight);
	};

	const handleStartAction = (e: any) => {
		e.stopPropagation();
		dragging.toggle();
	};

	return (
		<Rnd
			bounds={"parent"}
			position={{ x: x, y: y }}
			size={{ width: width, height: height }}
			enableResizing={{
				bottom: false,
				bottomLeft: false,
				bottomRight: !pushed,
				left: false,
				right: false,
				top: false,
				topLeft: false,
				topRight: false,
			}}
			disableDragging={pushed}
			lockAspectRatio={true}
			resizeHandleComponent={
				pushed
					? undefined
					: {
							bottomRight: <IconResize size={10} />,
					  }
			}
			resizeHandleClasses={{ bottomRight: styles.resizer }}
			onClick={(e: any) => {
				e.stopPropagation();
			}}
			onDragStart={handleStartAction}
			onDragStop={handleMove}
			onResizeStart={handleStartAction}
			onResizeStop={handleResize}
			dragHandleClassName={`dragHandle-${index}`}
		>
			<canvas
				data-pushed={pushed}
				className={`${styles.canvas}  dragHandle-${index}`}
				onClick={handleSign}
			>
				{/* Fallback Content */}
				Your browser does not support the canvas element.
			</canvas>
			<div
				data-pushed={pushed}
				className={`${styles.control_group}`}
			>
				<ActionIcon
					variant="subtle"
					className={`${styles.control}`}
					onClick={(e) => {
						e.stopPropagation();
						sigsHandler.remove(index);
					}}
				>
					<IconTrashX color="red" />
				</ActionIcon>
			</div>
		</Rnd>
	);
}

export default SignatureRnD;
