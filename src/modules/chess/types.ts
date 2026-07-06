export type TournamentSystem = "swiss" | "round_robin";

export type TournamentKind = "official" | "private";

export type TournamentStatus = "setup" | "active" | "closed" | "cancelled";

export type TournamentVisibility = "draft" | "published" | "unlisted" | "archived";

/** Categoría por sexo de un torneo. Ausente = "open" (abierta). */
export type TournamentSexCategory = "open" | "female" | "male";

export type PlayerStatus = "active" | "withdrawn" | "absent";

export type RoundStatus =
  | "pending"
  | "paired"
  | "in_progress"
  | "completed"
  | "locked";

export type GameResult =
  | "white_win"
  | "black_win"
  | "draw"
  | "white_forfeit"
  | "black_forfeit"
  | "double_forfeit"
  | "bye"
  | "unplayed";

export type TieBreakCode =
  | "points"
  | "progressive"
  | "buchholz"
  | "median_buchholz"
  | "buchholz_cut_1"
  | "sonneborn_berger"
  | "direct_encounter"
  | "wins"
  | "black_wins"
  | "manual";

export type ChessPlayer = {
  id: string;
  name: string;
  rating?: number;
  seed: number;
  status: PlayerStatus;
  photoUrl?: string;
  /** Vínculo al roster del club (para ranking y ELO). Los invitados no lo tienen. */
  clubPlayerId?: string;
  /** Sexo del jugador (para categorías femenina/masculina). */
  sex?: ClubPlayerSex;
  /** Fecha de nacimiento YYYY-MM-DD (para categorías por edad; sobre todo invitados). */
  birthDate?: string;
};

export type ChessGame = {
  id: string;
  boardNumber: number;
  whitePlayerId?: string;
  blackPlayerId?: string;
  result: GameResult;
  whiteScore?: number;
  blackScore?: number;
  isBye?: boolean;
  isForfeit?: boolean;
};

export type ChessRound = {
  id: string;
  roundNumber: number;
  status: RoundStatus;
  games: ChessGame[];
};

export type ChessTournament = {
  id: string;
  kind: TournamentKind;
  visibility: TournamentVisibility;
  title: string;
  slug: string;
  description: string;
  recap?: string;
  coverImage?: string;
  gallery?: Array<{ src: string; alt: string }>;
  system: TournamentSystem;
  roundsPlanned: number;
  currentRoundNumber: number;
  status: TournamentStatus;
  startsAt: string;
  locationLabel: string;
  tieBreakOrder: TieBreakCode[];
  regulations?: string;
  prizes?: Array<{ place: string; award: string }>;
  entryFee?: string;
  timeControl?: string;
  // Bases extendidas (todos opcionales; los blobs antiguos pueden no tenerlos)
  registrationDeadline?: string;
  entryIncludes?: string[];
  paymentInstructions?: string;
  prizeCategories?: Array<{
    name: string;
    places: Array<{ place: string; award: string }>;
  }>;
  prizesNonCumulative?: boolean;
  attachments?: Array<{ name: string; url: string }>;
  // Categoría (cuando el torneo es una categoría dentro de un evento con varias).
  /** Nombre visible de la categoría: "Sub-12", "Libre", "Femenino Absoluto"… */
  categoryLabel?: string;
  /** Edad mínima inclusiva (ej. 35+ → 35). Referencia = startsAt del torneo. */
  ageMin?: number;
  /** Edad máxima inclusiva (ej. Sub-12 → 12). Referencia = startsAt del torneo. */
  ageMax?: number;
  /** Categoría por sexo. Ausente = "open" (abierta). */
  sexCategory?: TournamentSexCategory;
  /** Cuenta para el ranking del club (puntos anuales + ELO). Por defecto solo
   *  los torneos de lunes; otros días quedan a discreción del organizador. */
  clubRanked?: boolean;
  players: ChessPlayer[];
  rounds: ChessRound[];
};

export type ScoringConfig = {
  win: number;
  draw: number;
  loss: number;
  bye: number;
  forfeitWin: number;
  forfeitLoss: number;
};

export type PlayerStanding = {
  playerId: string;
  name: string;
  seed: number;
  rating?: number;
  photoUrl?: string;
  clubPlayerId?: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  byes: number;
  forfeits: number;
  blackWins: number;
  colorHistory: Array<"white" | "black" | "bye">;
  opponentIds: string[];
  progressive: number;
  tieBreaks: Partial<Record<TieBreakCode, number>>;
};

export type TieBreakContext = {
  tournament: ChessTournament;
  standingsByPlayer: Map<string, PlayerStanding>;
};

export type TieBreakCalculator = (
  standing: PlayerStanding,
  context: TieBreakContext,
) => number | null;

export type PairingWarning = {
  code: string;
  message: string;
};

export type PairingResult = {
  round: ChessRound;
  warnings: PairingWarning[];
};

export type ClubPlayerSex = "M" | "F";

/** Jugador del club: roster permanente independiente de torneos. Al
 *  inscribirlo en un torneo se copian sus datos al blob del torneo. */
export type ClubPlayer = {
  id: string;
  name: string;
  rating?: number;
  fideId?: string;
  title?: string;
  sex?: ClubPlayerSex;
  birthDate?: string; // YYYY-MM-DD
  photoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PrivateTournamentDraft = {
  title: string;
  system: TournamentSystem;
  roundsPlanned: number;
  playerNames: string[];
  createdAt: string;
};
