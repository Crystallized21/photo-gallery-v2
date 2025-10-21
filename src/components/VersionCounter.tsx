import styles from "./VersionCounter.module.css";

declare const process: {
  env: {
    NEXT_PUBLIC_APP_VERSION?: string;
    NEXT_PUBLIC_COMMIT_HASH?: string;
  };
};

export default function VersionCounter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";
  const commit = process.env.NEXT_PUBLIC_COMMIT_HASH ?? "";

  return (
    <div className="pb-2 pr-4 flex justify-end items-end">
      <div className="text-center text-lg">
        <h1
          className={styles.versionCounter}
          style={{ position: "relative", display: "inline-block" }}
        >
          v{version} {commit && `(${commit})`}
        </h1>
      </div>
    </div>
  );
}
