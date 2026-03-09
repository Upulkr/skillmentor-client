import { useMentors } from "../hooks/useMentors";
import { MentorCard } from "../components/mentor/MentorCard";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

export function Home() {
  const { data: mentors, isLoading, error } = useMentors();
  const [search, setSearch] = useState("");

  const filteredMentors = mentors?.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      m.subjects.some((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <div className="py-20 px-6 lg:px-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          The Future of Learning
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
          Find your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Perfect Mentor.
          </span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Skip the guesswork. Connect with world-class experts for 1-on-1
          sessions that actually move the needle.
        </p>

        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
          <div className="relative flex items-center bg-white border border-slate-200 rounded-[1.8rem] shadow-xl overflow-hidden px-8 py-2">
            <Search className="text-slate-400 w-6 h-6 mr-4" />
            <input
              type="text"
              placeholder="Search by name, technology, or subject..."
              className="flex-1 py-4 bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-900 text-sm font-bold ml-4"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[500px] bg-slate-50 rounded-[3rem] animate-pulse border border-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-32 bg-red-50 rounded-[3rem] border border-red-100">
          <p className="text-red-600 font-black text-xl mb-4">
            Connection Failed
          </p>
          <p className="text-red-400 font-medium">
            We couldn't reach the servers. Please check your connection.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {search ? "Search Results" : "Featured Experts"}
              </h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">
                {filteredMentors?.length || 0} Professional Mentors Available
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredMentors?.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
          {filteredMentors?.length === 0 && (
            <div className="text-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="text-6xl mb-6">🔍</div>
              <p className="text-slate-400 font-black text-2xl mb-2">
                No Matches Found
              </p>
              <p className="text-slate-400">
                Try searching for something else like "Java" or "React".
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
