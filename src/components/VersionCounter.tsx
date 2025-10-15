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
    <div className="fixed bottom-0 right-0 m-4">
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

