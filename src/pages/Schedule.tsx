import { Helmet } from "react-helmet-async";
import { useUpcomingMatches } from "@/hooks/use-matches";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { Calendar, ChevronRight, Clock, MapPin, AlertTriangle } from "lucide-react";
import { cn, formatMatchTime, formatScheduleDate } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Match } from "@/lib/types";

export default function Schedule() {
  const [selectedTournament, setSelectedTournament] = useState("All Tournaments");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  
  // Fetch upcoming matches
  const { data: matches, isLoading, error, refetch } = useUpcomingMatches();

  // Extract unique tournaments and teams from data
  const { tournaments, teams } = useMemo(() => {
    if (!matches) return { tournaments: ["All Tournaments"], teams: ["All Teams"] };
    
    const tournamentSet = new Set(matches.map(m => m.tournament));
    const teamSet = new Set(matches.flatMap(m => [m.team1.name, m.team2.name]));
    
    return {
      tournaments: ["All Tournaments", ...Array.from(tournamentSet)],
      teams: ["All Teams", ...Array.from(teamSet)],
    };
  }, [matches]);

  // Filter and group matches by date
  const groupedMatches = useMemo(() => {
    if (!matches) return {};

    const filtered = matches.filter(m => {
      const tournamentMatch = selectedTournament === "All Tournaments" || m.tournament === selectedTournament;
      const teamMatch = selectedTeam === "All Teams" || 
        m.team1.name === selectedTeam || 
        m.team2.name === selectedTeam;
      return tournamentMatch && teamMatch;
    });

    // Sort by date
    const sorted = [...filtered].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // Group by date
    const groups: Record<string, Match[]> = {};
    sorted.forEach(match => {
      const dateKey = formatScheduleDate(match.startTime);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(match);
    });

    return groups;
  }, [matches, selectedTournament, selectedTeam]);

  return (
    <>
      <Helmet>
        <title>Match Schedule | STRYKER</title>
        <meta name="description" content="Complete cricket match schedule with US timezone support. Never miss a match again." />
      </Helmet>

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6" />
            <h1 className="font-display text-3xl font-bold">Match Schedule</h1>
          </div>
          <p className="text-primary-foreground/80">
            All times shown in your local timezone (US Eastern by default).
          </p>
        </div>
      </section>

      <div className="container-content py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Tournament</label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {tournaments.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule List */}
        {isLoading ? (
          <LoadingState message="Loading schedule..." />
        ) : error ? (
          <ErrorState message="Unable to load schedule." onRetry={() => refetch()} />
        ) : Object.keys(groupedMatches).length === 0 ? (
          <EmptyState
            title="No matches found"
            message="Try adjusting your filters to see more matches."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([date, dayMatches]) => (
              <div key={date}>
                <h2 className="font-display text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  {date}
                </h2>
                <div className="space-y-3">
                  {dayMatches.map(match => (
                    <ScheduleRow key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ScheduleRow({ match }: { match: Match }) {
  const isLive = match.status === "LIVE";
  
  return (
    <Link
      to={`/match/${match.id}`}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg card-hover group"
    >
      {/* Time */}
      <div className="flex-shrink-0 w-24 text-center">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-live text-live-foreground text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live-foreground opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-live-foreground" />
            </span>
            LIVE
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatMatchTime(match.startTime).split(',')[1]?.trim() || formatMatchTime(match.startTime)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 text-foreground font-medium">
          <span>{match.team1.shortName}</span>
          <span className="text-muted-foreground text-sm">vs</span>
          <span>{match.team2.shortName}</span>
          {match.importance === "HIGH" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-highlight/20 text-highlight-foreground text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              Key
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{match.tournament}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.venue?.split(',')[0] || 'TBD'}
          </span>
        </div>
      </div>

      {/* Match Type */}
      <div className="flex-shrink-0 text-right">
        <span className="text-sm text-muted-foreground">{match.matchType}</span>
      </div>

      {/* Arrow */}
      <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
}
