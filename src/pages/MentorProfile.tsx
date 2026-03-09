import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMentor } from "../hooks/useMentors";
import type { Subject } from "../hooks/useMentors";
import { Badge } from "../components/ui/Badge";
import { BookingModal } from "../components/mentor/BookingModal";
import { useMentorReviews } from "../hooks/useReviews";
import { useAuth, useClerk } from "@clerk/clerk-react";
import {
  ChevronLeft,
  BadgeCheck,
  Star,
  Briefcase,
  Calendar,
  Users,
  GraduationCap,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export function MentorProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: mentor, isLoading, error } = useMentor(id);
  const { data: reviews, isLoading: reviewsLoading } = useMentorReviews(id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const openBooking = (subject?: Subject) => {
    setSelectedSubject(subject);
    setIsBookingOpen(true);
  };

  const handleReserve = (subject?: Subject) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    openBooking(subject);
  };

  if (isLoading)
    return (
      <div className="p-20 flex flex-col items-center justify-center animate-pulse">
        <div className="w-20 h-20 bg-slate-100 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-100 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-50 rounded"></div>
      </div>
    );

  if (error || !mentor)
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Mentor Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          The mentor profile you are looking for doesn't exist.
        </p>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">
          Back to Mentor Discovery
        </Link>
      </div>
    );

  return (
    <div className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 mb-10 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Discovery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-20">
          <header>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                {mentor.profileImageUrl ? (
                  <img
                    src={mentor.profileImageUrl}
                    alt={mentor.firstName}
                    className="relative w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="relative w-40 h-40 rounded-3xl bg-slate-50 flex items-center justify-center text-6xl border-4 border-white shadow-xl">
                    👤
                  </div>
                )}
                {mentor.isCertified && (
                  <div className="absolute -top-3 -right-3 bg-indigo-600 p-2 rounded-2xl border-4 border-white shadow-lg">
                    <BadgeCheck className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {mentor.firstName} {mentor.lastName}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6">
                  <Briefcase className="w-5 h-5" />
                  <span>
                    {mentor.title} @{mentor.company}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-xl text-slate-600 font-bold border border-slate-100">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {mentor.averageRating.toFixed(1)}
                    <span className="text-slate-400 font-medium">
                      ({mentor.reviewCount} Reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-xl text-slate-600 font-bold border border-slate-100">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                    {mentor.subjects.length} Subjects
                  </div>
                  {mentor.startYear && (
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                      MENTOR SINCE {mentor.startYear}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                ABOVE AND BEYOND
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line mb-8">
                {mentor.bio}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 mb-1">
                    {mentor.experienceYears}+
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Years Exp
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 mb-1">
                    50+
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600 mb-1">
                    98%
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 mb-1">
                    {mentor.subjects.length}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Subjects
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                SUBJECTS TAUGHT
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentor.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {subject.imageUrl ? (
                      <img
                        src={subject.imageUrl}
                        alt={subject.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {subject.description}
                  </p>
                  <button
                    onClick={() => handleReserve(subject)}
                    className="flex items-center gap-2 text-sm font-black text-indigo-600 group-hover:translate-x-1 transition-transform"
                  >
                    RESERVE NOW <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS SECTION */}
          <section className="bg-slate-50 -mx-12 px-12 py-20 border-y border-slate-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    STUDENT VOICES
                  </h2>
                  <p className="text-slate-500 font-medium">
                    What students are saying about their experience.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-indigo-600 mb-1">
                    {mentor.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 justify-end mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= mentor.averageRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                    {mentor.reviewCount} REVIEWS
                  </div>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="p-10 text-center text-slate-400 font-bold animate-pulse text-sm">
                  LOADING REVIEWS...
                </div>
              ) : mentor.reviewCount === 0 ||
                !reviews ||
                reviews.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-300 text-center">
                  <div className="text-4xl mb-4">✍️</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    No reviews yet
                  </h3>
                  <p className="text-slate-500 text-sm italic">
                    Be the first to learn from {mentor.firstName}!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed mb-6 italic">
                        "{review.reviewText}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600">
                          {review.studentName.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-slate-900">
                          {review.studentName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200">
              <h3 className="text-2xl font-bold mb-8">Schedule Session</h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium font-bold">
                    Session Fee
                  </span>
                  <span className="text-2xl font-black">
                    $55.00{" "}
                    <span className="text-xs text-slate-500 font-normal">
                      /hr
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium font-bold">
                    Availability
                  </span>
                  <Badge
                    variant="success"
                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-black"
                  >
                    AVAILABLE
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold uppercase tracking-widest text-[10px] text-slate-500">
                      Next Available
                    </div>
                    <div className="font-black">MARCH 15th, 2026</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold uppercase tracking-widest text-[10px] text-slate-500">
                      SLOT TYPE
                    </div>
                    <div className="font-black">1-ON-1 SESSIONS ONLY</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleReserve()}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95 shadow-xl shadow-indigo-900/50"
              >
                CONTINUE TO BOOKING
              </button>

              <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-black">
                Secure SSL Encrypted Payment
              </p>
            </div>

            <div className="mt-8 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100/50">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-sm mb-4">
                <Users className="w-4 h-4" />
                ACTIVE NETWORK
              </div>
              <p className="text-sm text-indigo-700/80 font-bold leading-relaxed">
                Join 50+ other students who have improved their skills with{" "}
                {mentor.firstName} this month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          mentor={mentor}
          initialSubject={selectedSubject}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
