"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
};

export default function ReviewSection({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [slug]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("يرجى كتابة تعليق");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل");
      }
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(5);
      toast.success("تم إضافة التقييم");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare size={20} />
        التقييمات
        {reviews.length > 0 && (
          <span className="text-sm font-normal text-[var(--muted)]">
            ({reviews.length})
          </span>
        )}
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                className={
                  s <= Math.round(avgRating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-[var(--muted)]"
                }
              />
            ))}
          </div>
          <span className="text-sm text-[var(--muted)]">
            {avgRating.toFixed(1)} من 5
          </span>
        </div>
      )}

      {session && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">تقييمك</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={22}
                    className={
                      s <= rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-[var(--muted)]"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <textarea
              className="input min-h-[80px]"
              placeholder="اكتب تعليقك هنا..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "جاري الإرسال..." : "نشر التقييم"}
          </button>
        </form>
      )}

      {!session && (
        <p className="text-sm text-[var(--muted)] mb-4">
          <a href="/auth/login" className="text-[var(--primary)] hover:underline">
            سجل دخول
          </a>{" "}
          لإضافة تقييم
        </p>
      )}

      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="text-[var(--muted)] text-center py-8">
            لا توجد تقييمات بعد. كن أول من يقيم!
          </p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-sm font-bold">
                  {review.user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{review.user.name}</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= review.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-[var(--muted)]"
                    }
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-[var(--muted)]">{review.comment}</p>
            )}
            <p className="text-xs text-[var(--muted)] mt-2 opacity-60">
              {new Date(review.createdAt).toLocaleDateString("ar-IQ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
