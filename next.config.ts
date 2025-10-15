import { execSync } from "node:child_process";
import { withSentryConfig } from "@sentry/nextjs";
import { withGTConfig } from "gt-next/config";
import type { NextConfig } from "next";
import packageJson from "./package.json";

let commitHash = "dev";
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  console.warn("⚠️ Failed to get commit hash:", error);
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "syd.cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },

  env: {
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default withGTConfig(
  withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "crystallized",

    project: "photo-gallery-rewrite",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }),
  {},
);
