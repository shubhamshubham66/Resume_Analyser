import { useEffect } from "react";

const CSE_ID = "e1f3546ec239a49eb";

export function meta() {
  return [
    { title: "Search Jobs & Resources - ResumeAI" },
    { name: "description", content: "Search jobs, courses and resume tips powered by Google." },
  ];
}

export default function Search() {
  useEffect(() => {
    if (document.getElementById("gcse-script")) return;
    const s = document.createElement("script");
    s.id = "gcse-script";
    s.async = true;
    s.src = `https://cse.google.com/cse.js?cx=${CSE_ID}`;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Search jobs &amp; resources</h1>
      <p className="text-gray-600 mb-8">
        Look up roles, skills and courses to close the gaps found in your resume analysis.
      </p>
      <div className="gcse-search"></div>
    </div>
  );
}
