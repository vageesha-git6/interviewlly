export const getDifficultyBadgeClass = (difficulty) => {
  const diff = typeof difficulty === "string" ? difficulty.toLowerCase() : "";

  switch (diff) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
