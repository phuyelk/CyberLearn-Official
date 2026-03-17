export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const allBadges: BadgeDefinition[] = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "BookOpen" },
  { id: "password-pro", name: "Password Pro", description: "Complete the Password Security course", icon: "KeyRound" },
  { id: "phishing-spotter", name: "Phishing Spotter", description: "Complete the Phishing course", icon: "Fish" },
  { id: "streak-3", name: "On a Roll", description: "Maintain a 3-day learning streak", icon: "Flame" },
  { id: "streak-7", name: "Dedicated Learner", description: "Maintain a 7-day learning streak", icon: "Zap" },
  { id: "quiz-master", name: "Quiz Master", description: "Score 100% on any quiz", icon: "Trophy" },
  { id: "tool-explorer", name: "Tool Explorer", description: "Try all four security tools", icon: "Wrench" },
  { id: "course-complete-5", name: "Knowledge Seeker", description: "Complete 5 courses", icon: "GraduationCap" },
];
