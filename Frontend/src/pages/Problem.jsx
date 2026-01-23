import React from "react";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problem";
import { FaArrowRight, FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDifficultyBadgeClass } from "../lib/utils";
const Problem = () => {
  const problems = Object.values(PROBLEMS);
  const easyProblems = problems.filter((problem) => problem.difficulty.toLowerCase() === "easy").length;
  const mediumProblems = problems.filter((problem) => problem.difficulty.toLowerCase() === "medium").length;
  const hardProblems = problems.filter((problem) => problem.difficulty.toLowerCase() === "hard").length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice</h1>
          <p className="text-base-content/70">
            Sharpen your skills with our curated set of coding problems designed
            to challenge and inspire you.
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01 transition-transform"
            >
              <div className="card-body ">
                <div className="flex items-center justify-between gap-4">
                  {/* left side */}
                  <div className="flex-1">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-center">
                      <FaCode className="size-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{problem.title}</h2>
                        <span
                          className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/60">
                        {problem.category}
                      </p>
                    </div>
                  <p className="text-base-content/80 mb-3">
                    {problem.description.text}
                  </p>
                  </div>

                  {/* rightside */}

                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">Solve</span>
                    <FaArrowRight className="size-5"/>

                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* stats footer */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>
                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-success">{easyProblems}</div>
                </div>
                
              <div className="stat">
                 <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{mediumProblems}</div>
              </div>
              <div className="stat">
                 <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardProblems}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Problem;
