import { Link } from "react-router-dom";
import { cn, formatMatchTime, formatRelativeTime } from "@/lib/utils";
import type { Match } from "@/lib/types";
import { AlertTriangle, ChevronRight, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
  variant?: "compact" | "full";
}

export default function MatchCard({ match, variant = "full" }: MatchCardProps) {
  const isLive = match.status === "LIVE";
  const isUpcoming = match.status === "UPCOMING";
  
  return (
    <Link
      to={`/match/${match.id}`}
      className={cn(
        "block bg-card rounded-lg border border-border card-hover overflow-hidden",
        variant === "compact" ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium",
              isLive && "bg-live text-live-foreground",
              isUpcoming && "bg-muted text-muted-foreground",
              match.status === "FINISHED" && "bg-accent/10 text-accent"
            )}
          >
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-live-foreground opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-foreground" />
              </span>
            )}
            {match.status}
          </span>
          {match.importance === "HIGH" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-highlight/20 text-highlight-foreground text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              Key Match
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{match.matchType}</span>
      </div>

      {/* Tournament & Venue */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
        {match.tournament} • {match.venue}
      </p>

      {/* Teams & Scores */}
      <div className="space-y-2">
        <TeamRow
          team={match.team1}
          innings={match.innings.find(i => i.team.id === match.team1.id)}
          isCurrentlyBatting={isLive && match.innings.length > 0 && match.innings[match.innings.length - 1].team.id === match.team1.id}
        />
        <TeamRow
          team={match.team2}
          innings={match.innings.find(i => i.team.id === match.team2.id)}
          isCurrentlyBatting={isLive && match.innings.length > 0 && match.innings[match.innings.length - 1].team.id === match.team2.id}
        />
      </div>

      {/* Status Text */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <p className={cn(
          "text-sm",
          isLive ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {isUpcoming ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatMatchTime(match.startTime)}
            </span>
          ) : (
            match.statusText
          )}
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Context for important matches */}
      {match.context && (
        <p className="mt-2 text-xs text-accent font-medium">{match.context}</p>
      )}
    </Link>
  );
}

interface TeamRowProps {
  team: Match["team1"];
  innings?: Match["innings"][0];
  isCurrentlyBatting?: boolean;
}

function TeamRow({ team, innings, isCurrentlyBatting }: TeamRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-1",
      isCurrentlyBatting && "font-medium"
    )}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-4 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {team.shortName}
        </div>
        <span className="text-sm text-foreground">{team.name}</span>
        {isCurrentlyBatting && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        )}
      </div>
      {innings && (
        <div className="text-right">
          <span className="text-sm font-semibold text-foreground">
            {innings.runs}/{innings.wickets}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">
            ({innings.overs})
          </span>
        </div>
      )}
    </div>
  );
}
