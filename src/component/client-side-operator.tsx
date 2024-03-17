"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function ClientSideOperator({ gemview }: { gemview: any }) {
	const [capture, setCapture] = useState<any>(null);

	useEffect(() => {
		if (gemview) {
			gemview.StartCaptureGemViewScreen((x: any) => setCapture(x));
		}
	});

	return (
		<>
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
