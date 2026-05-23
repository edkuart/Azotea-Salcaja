import type { ChessGame, ScoringConfig } from "./types";

export const defaultScoring: ScoringConfig = {
  win: 1,
  draw: 0.5,
  loss: 0,
  bye: 1,
  forfeitWin: 1,
  forfeitLoss: 0,
};

export function getGameScores(
  game: ChessGame,
  scoring: ScoringConfig = defaultScoring,
) {
  if (typeof game.whiteScore === "number" && typeof game.blackScore === "number") {
    return {
      whiteScore: game.whiteScore,
      blackScore: game.blackScore,
    };
  }

  switch (game.result) {
    case "white_win":
      return { whiteScore: scoring.win, blackScore: scoring.loss };
    case "black_win":
      return { whiteScore: scoring.loss, blackScore: scoring.win };
    case "draw":
      return { whiteScore: scoring.draw, blackScore: scoring.draw };
    case "white_forfeit":
      return {
        whiteScore: scoring.forfeitLoss,
        blackScore: scoring.forfeitWin,
      };
    case "black_forfeit":
      return {
        whiteScore: scoring.forfeitWin,
        blackScore: scoring.forfeitLoss,
      };
    case "double_forfeit":
      return {
        whiteScore: scoring.forfeitLoss,
        blackScore: scoring.forfeitLoss,
      };
    case "bye":
      return { whiteScore: scoring.bye, blackScore: 0 };
    case "unplayed":
      return { whiteScore: 0, blackScore: 0 };
  }
}

export function isCompletedResult(result: ChessGame["result"]) {
  return result !== "unplayed";
}
