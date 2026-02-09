"use client";

import { useState, useRef } from "react";
import { Star, Video, X, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addReview } from "@/redux/features/reviewSlice";

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

  /* ---------------- FILE UPLOAD ---------------- */

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = [];

    Array.from(files).forEach((file) => {
      if (mediaFiles.length + newFiles.length >= 5) {
        toast({
          title: "Maximum files reached",
          description: "You can upload up to 5 images/videos",
          variant: "destructive",
        });
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Only images or videos allowed",
          variant: "destructive",
        });
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
      toast.error("Please select a star rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("product", productId);
      formData.append("rating", rating);
      formData.append("review", reviewText);

      mediaFiles.forEach((media, index) => {
        formData.append("media_files", media.file);
      });

      const response = await dispatch(addReview(formData)).unwrap();

      toast.success(response?.message || "Review submitted successfully");
      console.log("Review submitted:", response);
      handleClose();
    } catch (error) {
      toast.error(error || "Failed to submit review");
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">Write a Review</h2>
        </div>

        <div className="p-5 space-y-6">
          {/* PRODUCT INFO */}
          <div className="flex gap-4 bg-gray-50 p-3 rounded-lg">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{productName}</p>
              <p className="text-sm text-gray-500">Order: {orderId}</p>
            </div>
          </div>

          {/* RATING */}
          <div>
            <p className="font-semibold mb-2">Your Rating *</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* REVIEW TEXT */}
          <div>
            <p className="font-semibold mb-2">Your Review</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              maxLength={1000}
              className="w-full border rounded-lg p-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 text-right">
              {reviewText.length}/1000
            </p>
          </div>

          {/* MEDIA UPLOAD */}
          <div>
            <p className="font-semibold mb-1">Add Photos / Videos</p>
            <p className="text-sm text-gray-500 mb-3">
              Upload up to 5 images or videos
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={mediaFiles.length >= 5}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Upload size={16} />
              Upload Media
            </button>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative group aspect-square">
                    {media.type === "image" ? (
                      <img
                        src={media.preview}
                        className="w-full h-full object-cover rounded-lg border"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center">
                        <Video className="text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-5 border-t">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
