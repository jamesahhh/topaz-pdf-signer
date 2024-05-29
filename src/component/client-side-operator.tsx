"use client";

import { Button, Group, ScrollArea } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import classes from "./client-side-operator.module.css";

function ClientSideOperator({
	gemview,
	opener,
}: {
	gemview: any;
	opener: any;
}) {
	const [capture, setCapture] = useState<any>(null);
	const [sigs, setSigs] = useState<any>([]);

	return (
		<div className={classes.operator_window}>
			<Group
				pt="1.5rem"
				pb=".5rem"
				justify="center"
				gap="lg"
			>
				<Button
					onClick={async () => {
						await gemview.LoadIdleScreen();
						await gemview.StopCaptureGemViewScreen();
						await opener.Topaz.GemView.RevertCurrentTab(1);
						await setTimeout(() => window.close(), 750);
					}}
				>
					Recall Window
				</Button>
				<Button
					onClick={async () => {
						gemview.CloseIdleScreen();
						opener.Topaz.GemView.StartCaptureGemViewScreen((x: any) =>
							setCapture(x)
						);
						console.log(
							"Setting Pen",
							opener.Topaz.SignatureCaptureWindow.Sign.SetPenDetails(
								"#000000",
								2
							)
						);
						opener.Topaz.GemView.PushCurrentTab().then((result: any) =>
							console.log(result)
						);
					}}
				>
					Push Signing Window to Tablet
				</Button>
			</Group>
			<ScrollArea.Autosize h="80vh">
				{capture && (
					<Image
						src={capture}
						alt="Capture Container"
					/>
				)}
			</ScrollArea.Autosize>
		</div>
	);
}

export default ClientSideOperator;
