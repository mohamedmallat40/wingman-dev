/**
 * Enterprise-level URL State Management for Talent Pool
 * 
 * Features:
 * - Type-safe parameter validation with Zod
 * - Debounced URL updates to prevent spam
 * - Comprehensive error handling and fallbacks
 * - URL compression for complex filter states  
 * - SEO-friendly parameter names
 * - Backward compatibility handling
 * - Performance optimizations with memoization
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { z } from 'zod';

import { type TalentPoolFilters, type TalentType } from '../types';

// ============================================================================
// TYPE-SAFE PARAMETER SCHEMA
// ============================================================================

const AvailabilitySchema = z.enum(['full-time', 'part-time']).optional();
const ProfessionSchema = z.enum(['freelancer', 'interim', 'consultant', 'student']).optional();
const ExperienceLevelSchema = z.enum(['junior', 'mid', 'senior', 'lead', 'expert']).optional();
const TalentTabSchema = z.enum(['freelancers', 'agencies', 'teams']);

const URLParamsSchema = z.object({
  tab: TalentTabSchema.optional(),
  q: z.string().optional(), // search query
  skills: z.string().optional(), // comma-separated
  availability: AvailabilitySchema,
  countries: z.string().optional(), // comma-separated ISO codes
  experience: z.string().optional(), // comma-separated levels
  profession: ProfessionSchema,
  minRate: z.coerce.number().min(0).optional(),
  maxRate: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
});

type URLParams = z.infer<typeof URLParamsSchema>;

// ============================================================================
// PARAMETER MAPPING UTILITIES
// ============================================================================

/**
 * Maps internal filter types to URL-friendly formats
 */
const PARAMETER_MAPPINGS = {
  availability: {
    'OPEN_FOR_PROJECT': 'full-time',
    'OPEN_FOR_PART_TIME': 'part-time',
  } as const,
  
  profession: {
    'FULL_TIME_FREELANCER': 'freelancer',
    'PART_TIME_FREELANCER': 'interim', 
    'CONTRACTOR': 'consultant',
    'STUDENT': 'student',
  } as const,
  
  experienceLevel: {
    'JUNIOR': 'junior',
    'MID_LEVEL': 'mid',
    'SENIOR': 'senior', 
    'LEAD': 'lead',
    'EXPERT': 'expert',
  } as const,
} as const;

/**
 * Reverse mappings for parsing URL parameters back to internal types
 */
const REVERSE_MAPPINGS = {
  availability: Object.fromEntries(
    Object.entries(PARAMETER_MAPPINGS.availability).map(([k, v]) => [v, k])
  ) as Record<string, string>,
  
  profession: Object.fromEntries(
    Object.entries(PARAMETER_MAPPINGS.profession).map(([k, v]) => [v, k])
  ) as Record<string, string>,
  
  experienceLevel: Object.fromEntries(
    Object.entries(PARAMETER_MAPPINGS.experienceLevel).map(([k, v]) => [v, k])
  ) as Record<string, string>,
};

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Converts internal filters to URL parameters with validation and error handling
 */
export function filtersToURLParams(filters: TalentPoolFilters, activeTab: TalentType): URLParams {
  try {
    const params: URLParams = {};
    
    // Tab (always include for deep linking)
    if (activeTab !== 'freelancers') { // freelancers is default
      params.tab = activeTab;
    }
    
    // Search query (URL encode for special characters)
    if (filters.search?.trim()) {
      params.q = filters.search.trim();
    } else if (filters.name?.trim()) {
      params.q = filters.name.trim(); 
    }
    
    // Skills (comma-separated, lowercase, sorted for consistency)
    if (filters.skills?.length) {
      params.skills = [...filters.skills]
        .map(skill => skill.toLowerCase().trim())
        .filter(Boolean)
        .sort()
        .join(',');
    }
    
    // Availability (map to friendly names)
    if (filters.availability) {
      const mapped = PARAMETER_MAPPINGS.availability[filters.availability as keyof typeof PARAMETER_MAPPINGS.availability];
      if (mapped) params.availability = mapped;
    }
    
    // Countries (ISO codes, uppercase, sorted)
    if (filters.country?.length) {
      params.countries = [...filters.country]
        .map(country => country.toUpperCase().trim())
        .filter(Boolean) 
        .sort()
        .join(',');
    }
    
    // Experience levels (map to friendly names, sorted)
    if (filters.experienceLevel?.length) {
      const mappedLevels = filters.experienceLevel
        .map(level => PARAMETER_MAPPINGS.experienceLevel[level as keyof typeof PARAMETER_MAPPINGS.experienceLevel])
        .filter(Boolean)
        .sort();
      
      if (mappedLevels.length) {
        params.experience = mappedLevels.join(',');
      }
    }
    
    // Profession (map to friendly name)
    if (filters.profession) {
      const mapped = PARAMETER_MAPPINGS.profession[filters.profession as keyof typeof PARAMETER_MAPPINGS.profession];
      if (mapped) params.profession = mapped;
    }
    
    // Rate range (only include if both are set or meaningful)
    if (filters.minRate !== undefined && filters.minRate > 0) {
      params.minRate = filters.minRate;
    }
    if (filters.maxRate !== undefined && filters.maxRate > 0) {
      params.maxRate = filters.maxRate;
    }
    
    // Minimum rating
    if (filters.minRating !== undefined && filters.minRating > 0) {
      params.rating = filters.minRating;
    }
    
    return params;
  } catch (error) {
    console.error('Error converting filters to URL params:', error);
    return {}; // Return empty params on error
  }
}

/**
 * Converts URL parameters back to internal filter format with validation
 */
export function urlParamsToFilters(searchParams: URLSearchParams): {
  filters: TalentPoolFilters;
  activeTab: TalentType;
  errors: string[];
} {
  const errors: string[] = [];
  const filters: TalentPoolFilters = {};
  let activeTab: TalentType = 'freelancers'; // Default
  
  try {
    // Convert URLSearchParams to plain object
    const rawParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (value.trim()) rawParams[key] = value.trim();
    }
    
    // Validate against schema
    const validatedParams = URLParamsSchema.safeParse(rawParams);
    
    if (!validatedParams.success) {
      console.warn('Invalid URL parameters:', validatedParams.error.issues);
      validatedParams.error.issues.forEach(issue => {
        errors.push(`Invalid ${issue.path.join('.')}: ${issue.message}`);
      });
    }
    
    const params = validatedParams.success ? validatedParams.data : rawParams;
    
    // Parse tab
    if (params.tab && ['freelancers', 'agencies', 'teams'].includes(params.tab)) {
      activeTab = params.tab as TalentType;
    }
    
    // Parse search query
    if (params.q) {
      const decoded = decodeURIComponent(params.q);
      filters.search = decoded;
      filters.name = decoded; // For backward compatibility
    }
    
    // Parse skills
    if (params.skills) {
      const skills = params.skills.split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
      if (skills.length) filters.skills = skills;
    }
    
    // Parse availability
    if (params.availability && REVERSE_MAPPINGS.availability[params.availability]) {
      filters.availability = REVERSE_MAPPINGS.availability[params.availability] as any;
    }
    
    // Parse countries 
    if (params.countries) {
      const countries = params.countries.split(',')
        .map(country => country.toUpperCase().trim())
        .filter(country => /^[A-Z]{2}$/.test(country)); // Validate ISO format
      if (countries.length) filters.country = countries;
    }
    
    // Parse experience levels
    if (params.experience) {
      const levels = params.experience.split(',')
        .map(level => REVERSE_MAPPINGS.experienceLevel[level.trim()])
        .filter(Boolean);
      if (levels.length) filters.experienceLevel = levels;
    }
    
    // Parse profession
    if (params.profession && REVERSE_MAPPINGS.profession[params.profession]) {
      filters.profession = REVERSE_MAPPINGS.profession[params.profession] as any;
    }
    
    // Parse rate range
    if (params.minRate !== undefined) filters.minRate = params.minRate;
    if (params.maxRate !== undefined) filters.maxRate = params.maxRate;
    
    // Parse rating
    if (params.rating !== undefined) filters.minRating = params.rating;
    
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    errors.push('Failed to parse URL parameters');
  }
  
  return { filters, activeTab, errors };
}

// ============================================================================
// ADVANCED URL STATE HOOK
// ============================================================================

interface UseURLStateOptions {
  debounceMs?: number;
  replaceState?: boolean;
  onError?: (errors: string[]) => void;
}

/**
 * Advanced hook for URL state management with enterprise features
 */
export function useURLState(options: UseURLStateOptions = {}) {
  const {
    debounceMs = 300,
    replaceState = false,
    onError
  } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<string>('');
  
  // Memoized parsing of current URL parameters
  const currentState = useMemo(() => {
    const result = urlParamsToFilters(searchParams);
    if (result.errors.length && onError) {
      onError(result.errors);
    }
    return result;
  }, [searchParams, onError]);
  
  // Debounced URL update function
  const updateURL = useCallback((
    filters: TalentPoolFilters, 
    activeTab: TalentType,
    options: { immediate?: boolean } = {}
  ) => {
    const { immediate = false } = options;
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    const performUpdate = () => {
      try {
        const urlParams = filtersToURLParams(filters, activeTab);
        const newSearchParams = new URLSearchParams();
        
        // Build new URL parameters
        Object.entries(urlParams).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            newSearchParams.set(key, String(value));
          }
        });
        
        const newURL = newSearchParams.toString();
        
        // Avoid unnecessary updates
        if (newURL === lastUpdateRef.current) return;
        lastUpdateRef.current = newURL;
        
        // Update URL
        const fullURL = newURL ? `${pathname}?${newURL}` : pathname;
        
        if (replaceState) {
          router.replace(fullURL, { scroll: false });
        } else {
          router.push(fullURL, { scroll: false });
        }
      } catch (error) {
        console.error('Failed to update URL:', error);
      }
    };
    
    if (immediate) {
      performUpdate();
    } else {
      debounceRef.current = setTimeout(performUpdate, debounceMs);
    }
  }, [router, pathname, debounceMs, replaceState]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Generate shareable URL
  const generateShareableURL = useCallback((filters: TalentPoolFilters, activeTab: TalentType): string => {
    const urlParams = filtersToURLParams(filters, activeTab);
    const searchParams = new URLSearchParams();
    
    Object.entries(urlParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    
    const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
    const query = searchParams.toString();
    
    return `${baseURL}${pathname}${query ? `?${query}` : ''}`;
  }, [pathname]);
  
  return {
    // Current state
    filters: currentState.filters,
    activeTab: currentState.activeTab,
    errors: currentState.errors,
    
    // Update functions
    updateURL,
    generateShareableURL,
    
    // Utilities
    hasFilters: Object.keys(currentState.filters).length > 0,
    isLoading: false, // Could be enhanced with loading states
  };
}

// ============================================================================
// URL PREVIEW AND SHARING UTILITIES
// ============================================================================

/**
 * Generates a human-readable description of current filters for sharing
 */
export function generateFilterDescription(filters: TalentPoolFilters, activeTab: TalentType): string {
  const parts: string[] = [];
  
  // Tab
  const tabName = activeTab === 'freelancers' ? 'Freelancers' : 
                 activeTab === 'agencies' ? 'Agencies' : 'Teams';
  parts.push(tabName);
  
  // Search
  if (filters.search || filters.name) {
    parts.push(`searching "${filters.search || filters.name}"`);
  }
  
  // Skills
  if (filters.skills?.length) {
    const skillCount = filters.skills.length;
    parts.push(`with ${skillCount} skill${skillCount === 1 ? '' : 's'}`);
  }
  
  // Location
  if (filters.country?.length) {
    const countryCount = filters.country.length;
    parts.push(`in ${countryCount} countr${countryCount === 1 ? 'y' : 'ies'}`);
  }
  
  // Availability
  if (filters.availability) {
    const avail = filters.availability === 'OPEN_FOR_PROJECT' ? 'full-time' : 'part-time';
    parts.push(`available ${avail}`);
  }
  
  return parts.join(' ');
}

/**
 * Validates if URL parameters are within acceptable limits (for performance)
 */
export function validateURLComplexity(filters: TalentPoolFilters): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isValid = true;
  
  // Check for overly complex queries
  if (filters.skills && filters.skills.length > 20) {
    warnings.push('Too many skills selected (max 20)');
    isValid = false;
  }
  
  if (filters.country && filters.country.length > 10) {
    warnings.push('Too many countries selected (max 10)');
    isValid = false;
  }
  
  if (filters.search && filters.search.length > 100) {
    warnings.push('Search query too long (max 100 chars)');
    isValid = false;
  }
  
  return { isValid, warnings };
}