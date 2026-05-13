// app/utils/skillSuggestions.js
/**
 * Mapping of internship domain names to suggested skill sets.
 * Keys should match the exact `user.course` values used elsewhere.
 */
export const DOMAIN_SKILLS = {
  'React.js Web Development Intern': ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Git'],
  'Mern Stack Web Development Intern': ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript'],
  'Python Programming Intern': ['Python', 'OOP', 'SQL', 'Django', 'Flask'],
  'UI/UX Intern': ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
  'Power BI Intern': ['Power BI', 'Data Modeling', 'DAX', 'Visualization', 'SQL'],
  // Add additional domains as needed
};

/**
 * Return an array of suggested skills for a given domain.
 * If the domain is not recognized, returns an empty array.
 */
export function getSuggestedSkills(domain) {
  return DOMAIN_SKILLS[domain] || [];
}
