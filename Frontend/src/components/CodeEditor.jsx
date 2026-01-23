import React from "react";
import { LANGUAGE_CONFIG } from "../data/problem";
import { LoaderIcon } from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  selectedLang,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) => {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLang].icon}
            alt={LANGUAGE_CONFIG[selectedLang].name}
            className="size-6 "
          />
          <select
            value={selectedLang}
            className="select select-sm"
            onChange={onlanguagechange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm gap-2 "
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <LoaderIcon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <FaPlay className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLang].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
