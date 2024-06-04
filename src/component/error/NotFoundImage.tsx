import {
	Image,
	Container,
	Title,
	Text,
	Button,
	SimpleGrid,
	Tooltip,
	Group,
	Mark,
} from "@mantine/core";
import classes from "./NotFoundImage.module.css";
import {
	IconBrandChrome,
	IconBrandEdge,
	IconBrandFirefox,
} from "@tabler/icons-react";

export function NotFoundImage() {
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
					<Text align-self="right">
						<Mark color="#c94277">Refresh if installed previously</Mark>
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
						Installers for the Gemview Tablet to function with this app. Click
						below and run the install.bat found within...
					</Text>
					<Button
						component="a"
						download=""
						href="/INSTALL_READ_ME.zip"
						color="#eb5e28"
						size="md"
						mt="xl"
						className={classes.control}
					>
						Get Drivers Required for Extension
					</Button>
				</div>
				<div>
					<Image
						alt=""
						src={"/FittingPiece.svg"}
						className={classes.desktopImage}
					/>
				</div>
			</SimpleGrid>
		</Container>
	);
}
