/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
	webpack: (config) => {
		config.resolve.alias.canvas = false;

		return config;
	},
};

export default nextConfig;
