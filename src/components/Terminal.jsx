import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";

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

const Terminal = ({ interactive, options }) => {
  const terminalRef = useRef(null);
  const terminal = useRef(null);

  useEffect(() => {
    // Initialize terminal
    if (!terminal.current && terminalRef.current) {
      // Create new terminal instance
      terminal.current = new XTerm({ ...DEFAULT_OPTIONS, ...options });

      // Add addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      const searchAddon = new SearchAddon();

      terminal.current.loadAddon(fitAddon);
      terminal.current.loadAddon(webLinksAddon);
      terminal.current.loadAddon(searchAddon);

      // Open terminal in the container
      terminal.current.open(terminalRef.current);
      fitAddon.fit();

      // Handle window resize
      const handleResize = (event) => {
        fitAddon.fit();
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        terminal.current.dispose();
      };
    }
  }, []);

  useEffect(() => {
    // Handle input
    if (interactive) {
      // Welcome message
      terminal.current.writeln("\x1b[1;32mWelcome to Interactive Terminal!\x1b[0m");
      terminal.current.writeln("Type \x1b[1;34mhelp\x1b[0m for available commands.");
      terminal.current.write("\r\n$ ");
      let currentLine = "";

      terminal.current.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter
          terminal.current.write("\r\n");
          handleCommand(currentLine.trim());
          currentLine = "";
          terminal.current.write("$ ");
        } else if (domEvent.keyCode === 8) {
          // Backspace
          if (currentLine.length > 0) {
            terminal.current.write("\b \b");
            currentLine = currentLine.slice(0, -1);
          }
        } else if (printable) {
          terminal.current.write(key);
          currentLine += key;
        }
      });
    }
  }, []);

  const handleCommand = (command) => {
    switch (command.toLowerCase()) {
      case "help":
        terminal.current.writeln("\r\nAvailable commands:");
        terminal.current.writeln("  help     - Show this help message");
        terminal.current.writeln("  clear    - Clear the terminal");
        terminal.current.writeln("  date     - Show current date and time");
        terminal.current.writeln("  echo     - Echo back your text");
        terminal.current.writeln("  color    - Show some colored text");
        break;

      case "clear":
        terminal.current.clear();
        break;

      case "date":
        terminal.current.writeln(`\r\n${new Date().toLocaleString()}`);
        break;

      case "color":
        terminal.current.writeln("\r\n\x1b[31mRed\x1b[0m");
        terminal.current.writeln("\x1b[32mGreen\x1b[0m");
        terminal.current.writeln("\x1b[34mBlue\x1b[0m");
        terminal.current.writeln("\x1b[33mYellow\x1b[0m");
        break;

      case "":
        break;

      default:
        if (command.startsWith("echo ")) {
          terminal.current.writeln(`\r\n${command.slice(5)}`);
        } else {
          terminal.current.writeln(`\r\nCommand not found: ${command}`);
        }
    }
  };

  return <div id="xterm" ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
};

export default Terminal;
