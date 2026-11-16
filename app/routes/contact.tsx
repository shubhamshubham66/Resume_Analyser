import { useState } from "react";
import { SITE } from "~/site";

export function meta() {
  return [
    { title: "Contact - ResumeAI" },
    {
      name: "description",
      content: "Report a bug, ask a question, or suggest what ResumeAI should build next.",
    },
  ];
}

const REASONS = [
  { value: "Something is broken", hint: "A page errors out or the analysis fails" },
  { value: "Feedback on my results", hint: "The score or advice looked wrong" },
  { value: "Feature request", hint: "Something you want built next" },
  { value: "Collaboration", hint: "Colleges, clubs and placement cells" },
];

export default function Contact() {
  const [reason, setReason] = useState(REASONS[0].value);
  const [message, setMessage] = useState("");

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `[${reason}] ResumeAI`
  )}&body=${encodeURIComponent(message)}`;

  const field =
    "w-full rounded-[4px] border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-crimson focus:ring-2 focus:ring-crimson/15";

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
        {/* Left: the pitch */}
        <div>
          <h1 className="font-serif text-4xl leading-[1.1] text-ink sm:text-[3rem]">
            Tell me what is not working
          </h1>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.75] text-gray-700">
            This is a one-person project, so every message is read by the person who can actually
            change the code. Bug reports with a screenshot get fixed fastest.
          </p>

          <dl className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-medium text-ink">Email</dt>
              <dd>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[15px] text-crimson underline underline-offset-4"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-medium text-ink">LinkedIn</dt>
              <dd>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-crimson underline underline-offset-4"
                >
                  Message me there
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-medium text-ink">Code</dt>
              <dd>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-crimson underline underline-offset-4"
                >
                  Open an issue on GitHub
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="text-[15px] font-medium text-ink">Reply time</dt>
              <dd className="text-[15px] text-gray-600">
                Usually two or three days. Slower during exams.
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: compose */}
        <div className="rounded-[4px] border border-gray-200 bg-[#F7F8FA] p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-ink">Write a message</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
            This opens your own email app with the message filled in. Nothing is sent from this
            page.
          </p>

          <div className="mt-7">
            <fieldset>
              <legend className="text-[14px] font-medium text-ink">What is this about?</legend>
              <div className="mt-3 space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex cursor-pointer gap-3 rounded-[4px] border bg-white p-3 transition ${
                      reason === r.value
                        ? "border-crimson ring-1 ring-crimson/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#C2283C]"
                    />
                    <span>
                      <span className="block text-[14.5px] font-medium text-ink">{r.value}</span>
                      <span className="block text-[13px] text-gray-500">{r.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="msg" className="block text-[14px] font-medium text-ink">
                Message
              </label>
              <textarea
                id="msg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened, and on which page?"
                className={`${field} mt-2 resize-y`}
              />
            </div>

            <a
              href={mailto}
              className={`mt-5 block rounded-[4px] px-4 py-3 text-center text-[15px] font-semibold text-white transition-colors ${
                message.trim()
                  ? "bg-crimson hover:bg-crimson-dark"
                  : "pointer-events-none bg-gray-300"
              }`}
              aria-disabled={!message.trim()}
            >
              Open in email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
