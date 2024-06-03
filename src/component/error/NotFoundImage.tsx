import {
	Image,
	Container,
	Title,
	Text,
	Button,
	SimpleGrid,
	Tooltip,
	Group,
} from "@mantine/core";
import classes from "./NotFoundImage.module.css";
import {
	IconBrandChrome,
	IconBrandEdge,
	IconBrandFirefox,
} from "@tabler/icons-react";

export function NotFoundImage({ reset }: { reset: () => void }) {
	const chromeExt =
		"https://chrome.google.com/webstore/detail/topaz-sigplusextlite-back/dhcpobccjkdnmibckgpejmbpmpembgco";
	const firefoxExt =
		"https://addons.mozilla.org/en-US/firefox/addon/topaz-sigplusextlite-extension/";
	return (
		<Container className={classes.root}>
			<SimpleGrid
				spacing={{ base: 40, sm: 80 }}
				cols={{ base: 1, sm: 2 }}
			>
				<Image
					alt=""
					src={"/FittingPiece.svg"}
					className={classes.mobileImage}
				/>
				<div>
					<Title className={classes.title}>Something is not right...</Title>
					<Text
						// c="dimmed"
						size="lg"
					>
						Page you are trying to open is reliant on a 3rd Party extension.
						Click your browsers icon below to start the installation.
					</Text>
					<Group
						justify="space-evenly"
						py="sm"
					>
						<Tooltip
							label="Microsoft Edge"
							onClick={() => window.open(chromeExt)}
						>
							<IconBrandEdge size={30} />
						</Tooltip>
						<Tooltip
							label="Mozilla Firefox"
							onClick={() => window.open(firefoxExt)}
						>
							<IconBrandFirefox size={30} />
						</Tooltip>
						<Tooltip
							label="Google Chrome"
							onClick={() => window.open(chromeExt)}
						>
							<IconBrandChrome size={30} />
						</Tooltip>
					</Group>
					<Title className={classes.title}>You will also require...</Title>
					<Text
						// c="dimmed"
						size="lg"
					>
						Click below and unzip the installers for the Topaz Systems Inc.
						Gemview Tablet to function with this app
					</Text>
					<Button
						component="a"
						download=""
						href="/installs.zip"
						color="#eb5e28"
						size="md"
						mt="xl"
						className={classes.control}
						onClick={() => reset()}
					>
						Get Drivers Required for Extension
					</Button>
				</div>
				<Image
					alt=""
					src={"/FittingPiece.svg"}
					className={classes.desktopImage}
				/>
			</SimpleGrid>
		</Container>
	);
}
