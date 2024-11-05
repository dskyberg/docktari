import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { Store } from "@tauri-apps/plugin-store";

const store = new Store(".store.dat");

const storeValue = async (key, value) => {
  await store.set(key, value);
  await store.save();
};

const retrieveValue = async (key) => {
  return await store.get(key);
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const loadSettings = async () => {
    console.log("loadSettings start");
    const result = await retrieveValue("settings");
    setSettings(result);
    console.log("loadSettings end");
  };

  const setSettingsValue = (key, value) => {
    let updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    storeValue("settings", updatedSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return <SettingsContext.Provider value={{ settings, setSettingsValue }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
