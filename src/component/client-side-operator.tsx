"use client";

import { Button, Group } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";

function ClientSideOperator({
	gemview,
	opener,
}: {
	gemview: any;
	opener: any;
}) {
	const [capture, setCapture] = useState<any>(null);
	const [sigs, setSigs] = useState<any>([]);

	useEffect(() => {
		if (gemview) {
			gemview.StartCaptureGemViewScreen((x: any) => setCapture(x));
		}
	});

	return (
		<>
			<Group>
				<Button
					onClick={async () => {
						await opener.Topaz.GemView.RevertCurrentTab(1);
						await gemview.LoadIdleScreen();
						await gemview.StopCaptureGemViewScreen();
						await setTimeout(() => window.close(), 750);
					}}
				>
					Recall Window
				</Button>
			</Group>
			{capture && (
				<Image
					src={capture}
					alt="Capture Container"
				/>
			)}
		</>
	);
}

export default ClientSideOperator;
