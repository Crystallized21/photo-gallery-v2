"use client";

import { T } from "gt-next";
import styles from "./HeaderText.module.css";

export default function HeaderText() {
  return (
    <div className="mb-8">
      <h1 className={`${styles.titleLogo} ${styles.textContent}`}>
        crystallized.
      </h1>
      <T>
        <p className="text-xl">
          If you came from my main website, welcome. This is me when I have time
          and go outside to do something else, taking a break from the screens.
          <br />
          If you find this website by any other means e.g. email, social media,
          or word of person, welcome to my gallery.
          <br />
          <br />
          Hope you enjoy viewing my photos.
          <br />
        </p>
      </T>
    </div>
  );
}
