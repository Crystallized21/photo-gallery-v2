import styles from "./FooterInfo.module.css";

declare const process: {
  env: {
    NEXT_PUBLIC_APP_VERSION?: string;
    NEXT_PUBLIC_COMMIT_HASH?: string;
  };
};

export default function FooterInfo() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";
  const commit = process.env.NEXT_PUBLIC_COMMIT_HASH ?? "";

  return (
    <div className="pb-2 px-4 flex justify-between items-center w-full">
      <h1 className={`${styles.versionCounter} text-lg`}>
        &copy; 2025 Crystallized
      </h1>
      <h1
        className={`${styles.versionCounter} text-lg`}
        style={{ position: "relative", display: "inline-block" }}
      >
        v{version} {commit && `(${commit})`}
      </h1>
    </div>
  );
}
