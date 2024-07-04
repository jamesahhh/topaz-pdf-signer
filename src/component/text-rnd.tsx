import {
	Flex,
	Group,
	Menu,
	Text,
	Tooltip,
	rem,
	useMantineTheme,
} from "@mantine/core";
import {
	useCounter,
	useDisclosure,
	useElementSize,
	useFocusWithin,
} from "@mantine/hooks";
import {
	IconArrowsMove,
	IconBackground,
	IconMinus,
	IconPlus,
	IconSquare,
	IconSquareFilled,
	IconTextSize,
	IconTrashX,
} from "@tabler/icons-react";
import { Rnd } from "react-rnd";
import styles from "./text-rnd.module.css";

export function TextAreaRnd({
	pushed,
	text_obj,
	index,
	textHandler,
	dragging,
}: {
	dragging: any;
	pushed: boolean;
	text_obj: any;
	index: number;
	textHandler: any;
}) {
	const { ref: focused_ref, focused } = useFocusWithin({
		onFocus: (event) => {
			console.log(event);
		},
	});
	const { ref, width, height } = useElementSize();
	const [bg, bgToggle] = useDisclosure(true);
	const [fontSize, fontSizeHandler] = useCounter(text_obj.fontSize, {
		min: 1,
		max: 30,
	});
	const theme = useMantineTheme();

	const handleDrag = (e: any) => {
		e.stopPropagation();
		dragging.toggle();
	};

	const handleMove = (e: any, data: any) => {
		dragging.toggle();
		e.stopPropagation();
		textHandler.setItemProp(index, "x", data.x);
		textHandler.setItemProp(index, "y", data.y);
	};

	const rnd_props = {
		style: {
			background: bg ? "rgb(255,255,255)" : "transparent",
			paddingRight: "10px",
		},
		bounds: "parent",
		position: { x: text_obj.x, y: text_obj.y },
		size: {
			width: width !== 0 ? width : 100,
			height: height !== 0 ? height : 30,
		},
		enableResizing: false,
		onDragStart: handleDrag,
		onDragStop: handleMove,
		dragHandleClassName: `textdDragHandle-${index}`,
		disableDragging: pushed,
	};

	const pre_props = {
		style: {
			lineHeight: fontSize + "px",
			fontSize: rem(fontSize + "px"),
		},
		ref: ref,
	};

	const text_area_props = {
		style: {
			lineHeight: fontSize + "px",
			fontSize: rem(fontSize + "px"),
			width: width != 0 ? width : 100,
			height: height != 0 ? height : 30,
		},
		placeholder: "Aa",
		onChange: (e: any) => {
			textHandler.setItemProp(index, "text", e.currentTarget.value);
		},
	};

	return (
		<Rnd
			className={styles.textarea_rnd}
			data-focused={focused}
			{...rnd_props}
		>
			<div ref={focused_ref}>
				<pre {...pre_props}>{text_obj.text + "&#10;"}</pre>
				<textarea {...text_area_props} />
				<div
					className={styles.controls_bottom}
					data-pushed={pushed}
					data-focused={focused}
				>
					<IconArrowsMove
						color={theme.colors.black_olive[7]}
						size={20}
						className={`textdDragHandle-${index}`}
					/>
					{bg ? (
						<Tooltip label="Remove Background">
							<IconBackground
								size={20}
								color={theme.colors.black_olive[7]}
								onClick={() => bgToggle.toggle()}
							/>
						</Tooltip>
					) : (
						<Tooltip label="Add Background">
							<IconSquareFilled
								color={theme.colors.black_olive[7]}
								size={20}
								onClick={() => bgToggle.toggle()}
							/>
						</Tooltip>
					)}
					<Flex
						align="center"
						style={{
							justifyContent: "space-around",
							height: 20,
							padding: "0px 3px 0px 3px",
						}}
					>
						<IconMinus
							size={12}
							onClick={() => {
								fontSizeHandler.decrement();
								textHandler.setItemProp(index, "fontSize", fontSize);
							}}
						/>
						<Text size="sm">{fontSize}</Text>
						<IconPlus
							size={12}
							onClick={() => {
								fontSizeHandler.increment();
								textHandler.setItemProp(index, "fontSize", fontSize);
							}}
						/>
					</Flex>
				</div>
				<div
					className={styles.controls_right}
					data-pushed={pushed}
					data-focused={focused}
				>
					<IconTrashX
						color={theme.colors.flame[6]}
						size={20}
						onClick={() => textHandler.remove(index)}
					/>
				</div>
			</div>
		</Rnd>
	);
}
