import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMatch, useMatchCommentary, useMatchScorecard } from "@/hooks/use-matches";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { cn, formatMatchTime } from "@/lib/utils";
import { useState } from "react";
import { ArrowLeft, AlertTriangle, MapPin, Clock, MessageCircle, Share2, Bookmark } from "lucide-react";
import type { Match, BatsmanStats, BowlerStats, CommentaryBall, FullScorecard } from "@/lib/types";

type TabType = "commentary" | "scorecard" | "stats";

export default function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("commentary");

  // Fetch match with polling if live (5 second intervals)
  const { 
    data: match, 
    isLoading: matchLoading, 
    error: matchError, 
    refetch: refetchMatch 
  } = useMatch(matchId, { pollInterval: 5000 });

  const isLive = match?.status === "LIVE";

  // Fetch commentary with polling if live
  const { data: commentary } = useMatchCommentary(matchId, {
    enabled: activeTab === "commentary",
    isLive,
    pollInterval: 5000,
  });

  // Fetch scorecard with polling if live
  const { data: scorecard } = useMatchScorecard(matchId, {
    enabled: activeTab === "scorecard",
    isLive,
    pollInterval: 30000,
  });

  if (matchLoading) {
    return (
      <div className="container-content py-20">
        <LoadingState message="Loading match details..." />
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <div className="container-content py-20">
        <ErrorState message="Unable to load match details." onRetry={() => refetchMatch()} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{match.team1.shortName} vs {match.team2.shortName} | STRYKER</title>
        <meta name="description" content={`${match.statusText || 'Match'} - ${match.tournament} at ${match.venue}`} />
      </Helmet>

      {/* Match Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container-content">
          {/* Back Link */}
          <Link to="/live" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Live Scores
          </Link>

          {/* Tournament & Status */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-primary-foreground/70">{match.tournament}</span>
            <span className="text-primary-foreground/40">•</span>
            <span className="text-sm text-primary-foreground/70">{match.matchType}</span>
            {match.importance === "HIGH" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-highlight/30 text-highlight text-xs font-medium">
                <AlertTriangle className="h-3 w-3" />
                Key Match
              </span>
            )}
          </div>

          {/* Teams & Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Team 1 */}
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl font-bold mb-1">{match.team1.name}</h2>
              {match.innings?.find(i => i.team.id === match.team1.id) && (
                <p className="text-3xl font-bold">
                  {match.innings.find(i => i.team.id === match.team1.id)?.runs}/
                  {match.innings.find(i => i.team.id === match.team1.id)?.wickets}
                  <span className="text-lg font-normal text-primary-foreground/70 ml-2">
                    ({match.innings.find(i => i.team.id === match.team1.id)?.overs})
                  </span>
                </p>
              )}
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <span className={cn(
                "inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-foreground/30 text-lg font-bold",
                isLive && "bg-live border-live-foreground text-live-foreground"
              )}>
                {isLive ? "LIVE" : "VS"}
              </span>
            </div>

            {/* Team 2 */}
            <div className="text-center md:text-right">
              <h2 className="font-display text-2xl font-bold mb-1">{match.team2.name}</h2>
              {match.innings?.find(i => i.team.id === match.team2.id) && (
                <p className="text-3xl font-bold">
                  {match.innings.find(i => i.team.id === match.team2.id)?.runs}/
                  {match.innings.find(i => i.team.id === match.team2.id)?.wickets}
                  <span className="text-lg font-normal text-primary-foreground/70 ml-2">
                    ({match.innings.find(i => i.team.id === match.team2.id)?.overs})
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center bg-primary-foreground/10 rounded-lg py-3 px-4">
            <p className="font-medium">{match.statusText || 'Match in progress'}</p>
            {match.context && (
              <p className="text-sm text-primary-foreground/70 mt-1">{match.context}</p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {match.venue || 'Venue TBD'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatMatchTime(match.startTime)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm font-medium transition-colors">
              <Bookmark className="h-4 w-4" />
              Follow
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm font-medium transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Live Stats Bar (if live) */}
      {isLive && match.currentBatsmen && match.currentBowler && (
        <section className="bg-card border-b border-border py-4">
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Batsmen */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Batting</h3>
                <div className="space-y-2">
                  {match.currentBatsmen.map((batsman: BatsmanStats) => (
                    <div key={batsman.name} className="flex items-center justify-between">
                      <span className={cn("text-foreground", batsman.isOnStrike && "font-semibold")}>
                        {batsman.name} {batsman.isOnStrike && "*"}
                      </span>
                      <span className="text-foreground font-medium">
                        {batsman.runs} ({batsman.balls}) • SR: {batsman.strikeRate?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Bowler */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bowling</h3>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{match.currentBowler.name}</span>
                  <span className="text-foreground font-medium">
                    {match.currentBowler.wickets}/{match.currentBowler.runs} ({match.currentBowler.overs}) • Econ: {match.currentBowler.economy?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Overs */}
            {match.recentOvers && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent</h3>
                <p className="text-foreground font-mono text-sm">{match.recentOvers}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="container-content py-8">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-border">
          {(["commentary", "scorecard", "stats"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-[2px]",
                activeTab === tab
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "commentary" && <MessageCircle className="inline-block h-4 w-4 mr-1.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "commentary" && (
          <CommentaryTab commentary={commentary || []} />
        )}
        {activeTab === "scorecard" && (
          <ScorecardTab scorecard={scorecard} />
        )}
        {activeTab === "stats" && (
          <StatsTab match={match} />
        )}
      </div>
    </>
  );
}

function CommentaryTab({ commentary }: { commentary: CommentaryBall[] }) {
  if (commentary.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Commentary will appear here once the match starts.</p>;
  }

  return (
    <div className="space-y-4">
      {commentary.map((ball) => (
        <div
          key={ball.id}
          className={cn(
            "p-4 rounded-lg border",
            ball.isWicket && "bg-destructive/5 border-destructive/20",
            ball.isSix && "bg-highlight/10 border-highlight/20",
            ball.isBoundary && !ball.isSix && "bg-accent/5 border-accent/20",
            !ball.isWicket && !ball.isBoundary && !ball.isSix && "bg-card border-border"
          )}
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-mono text-sm font-bold text-foreground">
              {ball.over}
            </span>
            <div>
              <p className="text-foreground">{ball.description}</p>
              {ball.isWicket && <span className="text-xs font-medium text-destructive mt-1 inline-block">WICKET</span>}
              {ball.isSix && <span className="text-xs font-medium text-highlight mt-1 inline-block">SIX</span>}
              {ball.isBoundary && !ball.isSix && <span className="text-xs font-medium text-accent mt-1 inline-block">FOUR</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScorecardTab({ scorecard }: { scorecard: FullScorecard | null | undefined }) {
  if (!scorecard) {
    return <p className="text-muted-foreground text-center py-8">Scorecard will be available once the match begins.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Batting */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          {scorecard.team?.name || 'Team'} Batting
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground">Batsman</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground">Dismissal</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">R</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">B</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">4s</th>
                <th className="pb-2 px-4 font-medium text-muted-foreground text-right">6s</th>
                <th className="pb-2 pl-4 font-medium text-muted-foreground text-right">SR</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.batting?.filter(b => b.dismissal !== "did not bat").map((entry, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-foreground">{entry.batsman}</td>
                  <td className="py-3 px-4 text-muted-foreground">{entry.dismissal}</td>
                  <td className="py-3 px-4 text-right font-semibold text-foreground">{entry.runs}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.balls}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.fours}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{entry.sixes}</td>
                  <td className="py-3 pl-4 text-right text-muted-foreground">{entry.strikeRate?.toFixed(2) || '0.00'}</td>
                </tr>
              )) || null}
            </tbody>
          </table>
        </div>

        {/* Extras & Total */}
        {scorecard.extras && scorecard.total && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Extras:</span>
              <span className="ml-2 text-foreground font-medium">{scorecard.extras.total}</span>
              <span className="ml-1 text-muted-foreground text-xs">
                (b {scorecard.extras.byes}, lb {scorecard.extras.legByes}, w {scorecard.extras.wides}, nb {scorecard.extras.noBalls})
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-2 text-foreground font-bold">
                {scorecard.total.runs}/{scorecard.total.wickets} ({scorecard.total.overs} ov)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bowling */}
      {scorecard.bowling && scorecard.bowling.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Bowling</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Bowler</th>
                  <th className="pb-2 px-4 font-medium text-muted-foreground text-right">O</th>
                  <th className="pb-2 px-4 font-medium text-muted-foreground text-right">M</th>
                  <th className="pb-2 px-4 font-medium text-muted-foreground text-right">R</th>
                  <th className="pb-2 px-4 font-medium text-muted-foreground text-right">W</th>
                  <th className="pb-2 pl-4 font-medium text-muted-foreground text-right">Econ</th>
                </tr>
              </thead>
              <tbody>
                {scorecard.bowling.map((entry, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-foreground">{entry.bowler}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{entry.overs}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{entry.maidens}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{entry.runs}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">{entry.wickets}</td>
                    <td className="py-3 pl-4 text-right text-muted-foreground">{entry.economy?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fall of Wickets */}
      {scorecard.fallOfWickets && scorecard.fallOfWickets.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Fall of Wickets</h3>
          <div className="flex flex-wrap gap-2">
            {scorecard.fallOfWickets.map((fow, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-muted rounded text-sm text-muted-foreground">
                {fow}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsTab({ match }: { match: Match | undefined }) {
  if (!match) {
    return <p className="text-muted-foreground text-center py-8">Match data not available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Match Stats</h3>
        <div className="space-y-4">
          <StatRow label="Format" value={match.matchType || "N/A"} />
          <StatRow label="Venue" value={match.venue || "N/A"} />
          <StatRow label="Tournament" value={match.tournament || "N/A"} />
          <StatRow label="Match Importance" value={match.importance || "MEDIUM"} />
        </div>
      </div>

      {match.innings && match.innings.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Innings Summary</h3>
          <div className="space-y-4">
            {match.innings.map((inn, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-muted-foreground">{inn.team?.shortName || `Innings ${idx + 1}`}</span>
                <span className="text-foreground font-medium">
                  {inn.runs}/{inn.wickets} ({inn.overs} ov)
                  <span className="text-muted-foreground text-sm ml-2">RR: {inn.runRate?.toFixed(2) || '0.00'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
