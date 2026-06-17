import type { MetadataRoute } from "next";

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512] as const;

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Atovio BeyondAQI Web",
    short_name: "BeyondAQI",
    description:
      "Real-time India air quality index, hyperlocal sensor data, news, and health guidance.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#050a14",
    theme_color: "#050a14",
    categories: ["weather", "health", "utilities"],
    icons: iconSizes.flatMap((size) => [
      {
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "maskable",
      },
    ]),
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Open the BeyondAQI dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
