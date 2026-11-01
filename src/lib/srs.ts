import { SRSData } from "@/types";

// ====================================================================
// SUPERMEMO SM-2 SPACED REPETITION ALGORITHM
// ====================================================================

export function calculateNextReview(
  currentData: SRSData,
  rating: number // 0 to 5
): SRSData {
  let { repetitionCount, intervalDays, easeFactor } = currentData;

  // Grade < 3 means failed recall
  if (rating < 3) {
    repetitionCount = 0;
    intervalDays = 1;
  } else {
    // Successful recall
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionCount += 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  let status: 'learning' | 'known' | 'difficult' | 'mastered' = 'learning';
  if (rating <= 2) {
    status = 'difficult';
  } else if (repetitionCount >= 4 && intervalDays >= 21) {
    status = 'mastered';
  } else if (repetitionCount >= 1) {
    status = 'known';
  }

  return {
    vocabularyId: currentData.vocabularyId,
    repetitionCount,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewAt: nextReview.toISOString(),
    lastReviewedAt: now.toISOString(),
    status,
  };
}

export function createInitialSRS(vocabularyId: string): SRSData {
  return {
    vocabularyId,
    repetitionCount: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewAt: new Date().toISOString(),
    status: 'learning',
  };
}
