import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROBLEMS } from "../data/problem";
import { Panel, Group, Separator } from "react-resizable-panels";
import ProblemDesc from "../components/ProblemDesc";
import Navbar from "../components/Navbar";
import OutPutPanel from "../components/OutPutPanel";
import CodeEditor from "../components/CodeEditor";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const ProblemsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId]?.starterCode.javascript,
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id]?.starterCode[selectedLang]);
      setOutput(null);
    }
  }, [id, selectedLang]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) =>
    navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ","),
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestIsPass = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    return normalizedActual === normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLang, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLang];
      const testedPassed = checkIfTestIsPass(result.output, expectedOutput);

      if (testedPassed) {
        triggerConfetti();
        toast.success("All Tests Passed! Great Job");
      } else {
        toast.error("Tests Failed .Check Once!");
      }
    } else {
      toast.error("Code Execution failed");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Group direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            {/* leftPanel - problem */}
            <ProblemDesc
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <Separator className="w-2 bg-base-100 hover:bg-primary transition-colors cursor-col-resize" />

          {/* rightPanel - codeEditor */}
          <Panel defaultSize={60} minSize={30}>
            <Group direction="vertical">
              {/* code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditor
                  selectedLang={selectedLang}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <Separator className="w-2 bg-base-100 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={30} minSize={30}>
                <OutPutPanel output={output} />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
};

export default ProblemsPage;
