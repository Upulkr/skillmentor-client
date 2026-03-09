import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import type { Mentor } from "../../hooks/useMentors";
import { Star, BadgeCheck, Users } from "lucide-react";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300">
      <div className="relative h-56 bg-slate-50 overflow-hidden">
        {mentor.profileImageUrl ? (
          <img
            src={mentor.profileImageUrl}
            alt={`${mentor.firstName} ${mentor.lastName}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <span className="text-6xl">👤</span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {mentor.isCertified && (
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-white">
              <BadgeCheck className="w-5 h-5 text-indigo-600" />
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm border border-white flex items-center gap-1 text-amber-500 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            4.9
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
            {mentor.title}
          </p>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
          {mentor.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {mentor.subjects.slice(0, 3).map((subject) => (
            <Badge
              key={subject.id}
              variant="outline"
              className="bg-indigo-50/30 border-indigo-100 text-indigo-600"
            >
              {subject.name}
            </Badge>
          ))}
          {mentor.subjects.length > 3 && (
            <span className="text-[10px] font-bold text-slate-300 flex items-center px-1">
              +{mentor.subjects.length - 3} OTHERS
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">45+ Students</span>
          </div>
          <Link
            to={`/mentors/${mentor.id}`}
            className="text-sm font-extrabold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
