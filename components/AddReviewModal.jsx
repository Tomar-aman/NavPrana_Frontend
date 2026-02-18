"use client";

import { useState, useRef } from "react";
import { Star, X, Upload, ImagePlus, Video, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addReview } from "@/redux/features/reviewSlice";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const AddReviewModal = ({
  isOpen,
  onClose,
  orderId,
  productName,
  productImage,
  productId,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const activeRating = hoverRating || rating;

  /* ---------------- FILE UPLOAD ---------------- */

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = [];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    Array.from(files).forEach((file) => {
      if (mediaFiles.length + newFiles.length >= 5) {
        toast.error("Maximum 5 files allowed");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error("Only images or videos are allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds 10MB limit`);
        return;
      }

      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? "image" : "video",
      });
    });

    setMediaFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaFiles[index].preview);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("product", productId);
      formData.append("rating", rating);
      formData.append("review", reviewText);
      mediaFiles.forEach((media) => formData.append("media_files", media.file));

      const response = await dispatch(addReview(formData)).unwrap();
      toast.success(response?.message || "Review submitted!");
      handleClose();
    } catch (error) {
      toast.error(error?.error || error?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setMediaFiles([]);
    setIsSubmitting(false);
    onClose();
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-foreground">Write a Review</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Product */}
          <div className="flex items-center gap-3">
            <img
              src={productImage}
              alt={productName}
              className="w-12 h-12 rounded-lg object-cover border border-gray-100"
            />
            <div>
              <p className="font-medium text-sm text-foreground leading-tight">
                {productName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order #{orderId}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${activeRating >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                      }`}
                  />
                </button>
              ))}
              {activeRating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {ratingLabels[activeRating]}
                </span>
              )}
            </div>
          </div>

          {/* Review text */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Your Review</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              maxLength={1000}
              className="w-full border border-gray-200 rounded-xl p-3 min-h-[100px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">Min 10 characters</p>
              <p className="text-xs text-muted-foreground">
                {reviewText.length}/1000
              </p>
            </div>
          </div>

          {/* Media upload */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Photos & Videos{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex gap-2 flex-wrap">
              {mediaFiles.map((media, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.preview}
                      className="w-full h-full object-cover"
                      alt="Upload preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <Video size={20} className="text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}

              {mediaFiles.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5 hover:border-primary/40 hover:bg-primary/5 transition cursor-pointer"
                >
                  <ImagePlus size={18} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
