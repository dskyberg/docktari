import React, { useEffect, useRef } from "react";
import { listen, emit } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";

import { notifications } from "@mantine/notifications";
import { Button, Stack } from "@mantine/core";

export const DEFAULT_OPTIONS = {
  scrollback: 5000, // Allow 5000 lines of scrollback
  cursorBlink: true,
  cursorStyle: "block",
  fontSize: 14,
  fontFamily: "monospace",
  theme: {
    background: "#1e1e1e",
    foreground: "#ffffff",
    cursor: "#ffffff",
    selection: "#5DA5D533",
    black: "#1e1e1e",
    blue: "#569CD6",
    cyan: "#9CDCFE",
    green: "#6A9955",
    yellow: "#D7BA7D",
    red: "#F44747",
    white: "#D4D4D4",
  },
};

const LogViewer = ({ id }) => {
  const terminalRef = useRef(null);
  const terminal = useRef(null);

  useEffect(() => {
    // Initialize terminal
    if (!terminal.current && terminalRef.current) {
      // Create new terminal instance
      terminal.current = new XTerm(DEFAULT_OPTIONS);

      // Add addons
      const fitAddon = new FitAddon();

      terminal.current.loadAddon(fitAddon);
      terminal.current.loadAddon(new WebLinksAddon());

      // Open terminal in the container
      terminal.current.open(terminalRef.current);
      fitAddon.fit();
      terminal.current.clear();

      const unlistenLogs = listen("log_chunk_" + id, (event) => {
        terminal.current.writeln(event.payload);
      });

      // Handle window resize
      const handleResize = (event) => {
        fitAddon.fit();
      };

      window.addEventListener("resize", handleResize);

      invoke("stream_container_logs", { id })
        .then(() => {
          console.log("we appear to be streaming");
        })
        .catch((err) => notifications.show({ title: "Error", message: err, color: "red" }));

      return () => {
        unlistenLogs.then((f) => f());
        window.removeEventListener("resize", handleResize);
        // Docker won't 'continue on reentry. So, clear the terminal.
        terminal.current.dispose();
      };
    }
  }, []);

  const handleCancelLogs = () => {
    console.log("emitting:", "cancel_logs_" + id);
    emit("cancel_logs_" + id);
  };

  return (
    <Stack>
      <Button w={300} onClick={handleCancelLogs}>
        Cancel Log Streaming
      </Button>
      <div id="xterm" ref={terminalRef} style={{ margin: "0.5rem", width: "100%", height: "100%" }} />;
    </Stack>
  );
};

export default LogViewer;
