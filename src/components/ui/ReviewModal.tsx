import { useState } from "react";
import { Star, X } from "lucide-react";
import { useSubmitReview } from "../../hooks/useReviews";

interface ReviewModalProps {
  sessionId: number;
  subjectName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  sessionId,
  subjectName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const {
    mutateAsync: submitReview,
    isPending: loading,
    error,
  } = useSubmitReview();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview({
        sessionId,
        rating,
        reviewText,
      });
      onSuccess();
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Write Review
              </h2>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
                FOR: {subjectName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center py-4 bg-slate-50 rounded-[2rem]">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Rating
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform active:scale-90"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hover || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="mt-4 text-sm font-black text-slate-900 uppercase tracking-widest">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Great"}
                {rating === 5 && "Excellent"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                Your Feedback
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was your learning experience?"
                className="w-full h-32 px-5 py-4 bg-white border border-slate-200 rounded-3xl text-slate-900 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <p className="text-sm font-bold text-rose-600 leading-tight">
                  {error.message}
                </p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-3xl text-sm font-black tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transition-all active:translate-y-0.5"
            >
              {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
