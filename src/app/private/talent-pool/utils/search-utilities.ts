/**
 * Search utility functions for different talent types
 */
export const searchUtilities = {
  /**
   * Search freelancers by firstName + lastName
   */
  searchFreelancers: (freelancers: any[], query: string) => {
    if (!query.trim()) return freelancers;

    const searchTerm = query.toLowerCase().trim();

    return freelancers.filter((freelancer) => {
      const fullName = `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
  },

  /**
   * Search agencies by firstName + lastName
   */
  searchAgencies: (agencies: any[], query: string) => {
    if (!query.trim()) return agencies;

    const searchTerm = query.toLowerCase().trim();

    return agencies.filter((agency) => {
      const fullName = `${agency.firstName || ''} ${agency.lastName || ''}`.toLowerCase();
      return fullName.includes(searchTerm);
    });
  },

  /**
   * Search teams by groupName
   */
  searchTeams: (teams: any[], query: string) => {
    if (!query.trim()) return teams;

    const searchTerm = query.toLowerCase().trim();

    return teams.filter((team) => {
      const groupName = (team.groupName || '').toLowerCase();
      return groupName.includes(searchTerm);
    });
  }
};
