"use client";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitFeedback } from "@/features/feedback/feedbackSlice";

type FeedbackType = "bug" | "idea" | "ui-ux" | "other";

export default function FeedbackWidget() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const submitStatus = useAppSelector((s) => s.feedback.status);
  const [open, setOpen] = useState(false);

  const [rating, setRating] = useState<number | null>(null);
  const [type, setType] = useState<FeedbackType>("idea");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [includeMeta, setIncludeMeta] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  // New question set
  const [slowOrBreak, setSlowOrBreak] = useState<"yes" | "no" | null>(null);
  const [slowDetail, setSlowDetail] = useState("");
  const [solvedExpected, setSolvedExpected] = useState<"yes" | "no" | null>(null);
  const [missingDetail, setMissingDetail] = useState("");
  const [nextFix, setNextFix] = useState("");
  const [likedOneThing, setLikedOneThing] = useState("");
  const [weeklyLikelihood, setWeeklyLikelihood] = useState<number | "">("");

  const pagePath = useMemo(() => (typeof window !== "undefined" ? window.location.pathname : ""), []);

  const resetForm = () => {
    setRating(null);
    setType("idea");
    setMessage("");
    setEmail("");
    setIncludeMeta(true);
    setFile(null);
    setSlowOrBreak(null);
    setSlowDetail("");
    setSolvedExpected(null);
    setMissingDetail("");
    setNextFix("");
    setLikedOneThing("");
    setWeeklyLikelihood("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please add a rating.");
      return;
    }
    // Always include answers; optionally add device/page info
    const baseMeta = {
      slow_or_break: slowOrBreak || undefined,
      slow_or_break_detail: slowOrBreak === "yes" && slowDetail ? slowDetail : undefined,
      solved_expected: solvedExpected || undefined,
      missing_detail: solvedExpected === "no" && missingDetail ? missingDetail : undefined,
      next_improvement: nextFix || undefined,
      liked_one_thing: likedOneThing || undefined,
      weekly_use_likelihood:
        weeklyLikelihood === "" ? undefined : Number(weeklyLikelihood),
    } as const;
    const meta = includeMeta
      ? {
        ...baseMeta,
        page_path: pagePath,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        language: typeof navigator !== "undefined" ? navigator.language : undefined,
      }
      : baseMeta;

    const resultAction = await dispatch(
      submitFeedback({
        rating,
        type,
        message,
        userId: user?.id ?? null,
        userEmail: (email || user?.email || null) as string | null,
        includeMeta,
        meta,
        file,
      })
    );

    if (submitFeedback.fulfilled.match(resultAction)) {
      toast.success("Thanks for your feedback!");
      setOpen(false);
      resetForm();
    } else {
      const err =
        (resultAction as { payload?: string; error?: { message?: string } }).payload ||
        (resultAction as { payload?: string; error?: { message?: string } }).error?.message;
      toast.error(err || "Failed to submit feedback.");
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label="Feedback"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-6 z-40 flex items-center gap-2 rounded-full bg-orange-600 text-white px-4 py-2 shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5A8.5 8.5 0 0 1 21 11v.5Z"></path></svg>
        <span className="hidden md:inline">Feedback</span>
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 shadow-xl max-h-[88vh] md:max-h-[90vh] overflow-y-auto overscroll-contain">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Share your feedback</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Rating */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">How easy was it?</label>
                <p className="text-xs text-gray-500 mb-1">1 = painful, 5 = effortless</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={`Rate ${n}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={rating && n <= rating ? "#f59e0b" : "none"} stroke={rating && n <= rating ? "#f59e0b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="feedback-type" className="block text-sm text-gray-600 mb-1">Type</label>
                <select
                  id="feedback-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as FeedbackType)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                  title="Feedback type"
                >
                  <option value="idea">Idea</option>
                  <option value="bug">Bug</option>
                  <option value="ui-ux">UI/UX</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="feedback-message" className="block text-sm text-gray-600 mb-1">Describe it</label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="What happened or what would you improve?"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Did anything feel slow or break? */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Did anything feel slow or break?</p>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="slowBreak" checked={slowOrBreak === "yes"} onChange={() => setSlowOrBreak("yes")} />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="slowBreak" checked={slowOrBreak === "no"} onChange={() => setSlowOrBreak("no")} />
                    No
                  </label>
                </div>
                {slowOrBreak === "yes" && (
                  <div className="space-y-2">
                    <label htmlFor="slow-detail" className="block text-sm text-gray-600">What happened?</label>
                    <input
                      id="slow-detail"
                      type="text"
                      value={slowDetail}
                      onChange={(e) => setSlowDetail(e.target.value)}
                      placeholder="Short description"
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                    />
                    <div>
                      <label htmlFor="feedback-screenshot" className="block text-sm text-gray-600 mb-1">Add screenshot (optional)</label>
                      <input
                        id="feedback-screenshot"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Did this solve the problem you expected it to? */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Did this solve the problem you expected it to?</p>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="solvedExpected" checked={solvedExpected === "yes"} onChange={() => setSolvedExpected("yes")} />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="solvedExpected" checked={solvedExpected === "no"} onChange={() => setSolvedExpected("no")} />
                    No
                  </label>
                </div>
                {solvedExpected === "no" && (
                  <div>
                    <label htmlFor="missing-detail" className="block text-sm text-gray-600 mb-1">What was missing?</label>
                    <input
                      id="missing-detail"
                      type="text"
                      value={missingDetail}
                      onChange={(e) => setMissingDetail(e.target.value)}
                      placeholder="Short text"
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>
                )}
              </div>

              {/* If we fix only one thing next, what should it be? */}
              <div>
                <label htmlFor="next-fix" className="block text-sm text-gray-600 mb-1">If we fix only one thing next, what should it be?</label>
                <input
                  id="next-fix"
                  type="text"
                  value={nextFix}
                  onChange={(e) => setNextFix(e.target.value)}
                  placeholder="Short text"
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Optional add-ons */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="liked-one" className="block text-sm text-gray-600 mb-1">One thing you really liked? (optional)</label>
                  <input
                    id="liked-one"
                    type="text"
                    value={likedOneThing}
                    onChange={(e) => setLikedOneThing(e.target.value)}
                    placeholder="Short text"
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label htmlFor="weekly-likelihood" className="block text-sm text-gray-600 mb-1">How likely are you to use Lolelink again this week? 0–10 (optional)</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="weekly-likelihood"
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={weeklyLikelihood === "" ? 5 : weeklyLikelihood}
                      onChange={(e) => setWeeklyLikelihood(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={weeklyLikelihood === "" ? "" : weeklyLikelihood}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") setWeeklyLikelihood("");
                        else {
                          const n = Math.max(0, Math.min(10, Number(v)));
                          setWeeklyLikelihood(Number.isNaN(n) ? "" : n);
                        }
                      }}
                      placeholder="0–10"
                      title="Weekly use likelihood (0–10)"
                      className="w-16 h-10 rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:border-orange-600 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Storage note if screenshot visible */}
              {slowOrBreak === "yes" && (
                <p className="text-xs text-gray-400">Stored in Supabase storage bucket "feedback".</p>
              )}

              {/* Email */}
              <div>
                <label htmlFor="feedback-email" className="block text-sm text-gray-600 mb-1">Email (optional)</label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={user?.email ? `Using ${user.email} if left empty` : "you@company.com"}
                  title="Your email"
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:border-orange-600"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  id="feedback-includeMeta"
                  type="checkbox"
                  checked={includeMeta}
                  onChange={(e) => setIncludeMeta(e.target.checked)}
                />
                <label htmlFor="feedback-includeMeta">Include page and device info</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="border max-md:mb-8 px-4 h-10 rounded-md text-sm hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 disabled:opacity-60"
                >
                  {submitStatus === "loading" ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
