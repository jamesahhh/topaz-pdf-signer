"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { NotFoundTitle } from "../component/error/NotFoundTitle";
import { redirect, useRouter } from "next/navigation";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	if (error.name === "TOPAZ_ERROR") redirect("/install");
	return (
		<div style={{ width: "100vw", height: "100vh", padding: "2rem" }}>
			<NotFoundTitle />
		</div>
	);
}
