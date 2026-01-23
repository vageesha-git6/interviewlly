import { Link } from "react-router-dom";
import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import { FaVideo, FaCode, FaHighlighter, FaLanguage} from "react-icons/fa";
const Home = () => {
  return (
    <div className="bg-linear-to-br from-base-100 via-base-200 to-base-300 ">
      {/* navbar */}
      <nav className="bg-base-100/70 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <img src="/logo.png" alt="Logo" className="w-30 h-25" />
          </Link>

          <SignInButton mode="modal">
            <button className="group px-6 bg-gradient-to-r from-primary to-secondary rounded-xl cursor-pointer text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 py-3 flex items-center gap-3 hover:scale-105 transform">
              <span>Get Started</span>
              <span>✨</span>
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* left content */}
          <div className="space-y-7">
            <div className="badge badge-primary badge-lg">
              <span>Real Time Collaboration✨</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>
            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              The Ultimate Platform for collaborative coding interviews and pair
              programming.Connect face-to-face,code in real-time,and your
              technical interviews.
            </p>

            {/* features pillls */}
            <div className="flex flex-wrap gap-3">
              <div className="badge badge-lg badge-outline">
                Live Video Chat
              </div>
              <div className="badge badge-lg badge-outline">Code Editor</div>
              <div className="badge badge-lg badge-outline">
                Syntax Highlight
              </div>
              <div className="badge badge-lg badge-outline">Multi-Language</div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="px-6 bg-gradient-to-r from-primary to-secondary rounded-xl cursor-pointer text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 py-3 flex items-center gap-3 hover:scale-105 transform">
                  <span className="text-black">Start Coding Now</span>
                  <span>🚀</span>
                </button>
              </SignInButton>
              <button className="btn btn-outline btn-lg">Watch Demo</button>
            </div>

            {/* stats */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg flex">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">50K+</div>
                <div className="stat-title">Interviews</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>
          {/* right image */}

          <img
            src="/logo.png"
            alt="Hero"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* features sections */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-15">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for Collaborative{" "}
            <span className="text-primary font-mono">Coding.</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Our platform offers a comprehensive suite of features designed to
            enhance your coding interviews and pair programming sessions.
          </p>
        </div>

        {/* fetures list */}
        <div className="grid md:grid-cols-3 gap-8 ">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <FaVideo className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content">
                Crystal Clear Video And Audio for seamless communications During
                Interviews
              </p>
            </div>
          </div>
          {/* features2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <FaCode className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content">
                Collaborative Real-Time Coding with Syntax Highlighting and
                Multi Language Support.
              </p>
            </div>
          </div>

          {/* features3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <FaHighlighter className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HighLight Code</h3>
              <p className="text-base-content">
                Collaborative Real-Time Coding with Syntax Highlighting.
              
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
