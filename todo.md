# TODO - Final Phase Implementation Plan

## High Priority (Critical Final Features)

### 3. Button Styling Consistency - 🎨 NEW
**Issue:** Inconsistent button styles across card interactions
**Problem:** "View on Scryfall" and "Add to Favourites" buttons don't match "Remove from Favourites" button style
**Goal:** Uniform button styling for professional appearance
**Solution Required:**
- Standardise all card action buttons to match remove button styling
- Update "View on Scryfall" button design in card modals/details
- Update "Add to Favourites" button to match existing remove button
- Ensure consistent hover states and visual feedback
- Test across search results, card details, and favourites pages

**Status:** UI consistency issue - affects professional presentation

### 4. Figma Prototype Creation - 🎨 NEW
**Issue:** No design documentation for assessment showcase
**Goal:** Professional design prototype demonstrating UI/UX design thinking
**Solution Required:**
- Create Figma workspace with key user flows: onboarding → search → favourites → documentation
- Document design system: colour schemes, typography hierarchy, spacing, component library
- Show mobile and desktop responsive layouts
- Include accessibility considerations and design rationale

**Status:** New requirement - full creation needed

## Medium Priority (Content Polish)

### 5. Mechanics Data Parsing - 🔧 HIGH PRIORITY
**Issue:** Mechanics descriptions are displaying poorly formatted or nonsensical content
**Example:** Deathtouch shows "A found on creatures" instead of proper explanation
**Root Cause:** Mechanics data scraping or parsing needs improvement for better display
**Solution Required:**
- Fix mechanics data parsing to show proper descriptions
- Ensure all 273 mechanics have clean, readable explanations
- Review and clean up mechanics JSON data structure
- Implement fallback descriptions for incomplete data
- Test mechanics display across all categories

**Status:** Critical UX issue - needs immediate attention

### 6. Search Animation Enhancement - 🔍 NEW
**Issue:** Current search animation doesn't clearly indicate search functionality
**Goal:** Make search animation look more like a magnifying glass for better UX
**Solution Required:**
- Update search button/icon animation to resemble magnifying glass movement
- Improve visual feedback when search is initiated
- Consider pulsing or scanning animation effect
- Maintain existing 🔍 emoji but enhance with CSS animations

**Status:** UI enhancement for better user experience

### 7. Placeholder Card Handling - 🃏 NEW
**Issue:** Placeholder cards display "goofy" content when full card data unavailable
**Current Behavior:** Shows purple placeholder with minimal/incorrect information
**Proposed Solution:** Exclude cards entirely if incomplete data rather than show placeholder
**Actions Required:**
- Remove placeholder card display logic
- Filter out cards with incomplete Scryfall data
- Show only cards with full information (image, name, type, etc.)
- Update search results to reflect actual available cards only

**Status:** Data quality improvement for professional presentation

### 8. Performance Dashboard Accessibility - ⚡ ✅ COMPLETED
**Issue:** User reports dashboard button not working - likely production mode limitation
**Root Cause:** PerformanceWrapper only shows toggle button in development mode or with localStorage flag
**Solution Applied:**
- ✅ Modified PerformanceWrapper to always enable dashboard in production
- ✅ Floating 📊 button now permanently available on live app
- ✅ Keyboard shortcut `Ctrl+Shift+P` always accessible
- ✅ Updated documentation to reflect production availability
- ✅ Added professional monitoring capabilities for assessment

**Status:** Fully implemented - dashboard now permanently accessible in production with professional monitoring

### 9. Content Management Cleanup - 📝 PARTIALLY COMPLETE
**Remaining Actions:**
- ✅ Delete Canadian Highlander content (verify removal)
- ✅ Convert future steps to proper bullet points format
- Add Setup password authentication to roadmap
- Add Market app concept to product expansion documentation
- Review mechanics guide for optimal card integration display
- Implement retractable buttons for game modes section

## Low Priority (Documentation Enhancement)

### 6. Documentation Improvements - 📚 MINOR UPDATES
**Status:** Comprehensive documentation exists - minor enhancements needed
**Remaining Actions:**
- Add Figma prototype link to planning section
- Reference release history in main README
- Ensure all wiki scraping references are accurate
- Document health dashboard access methods

### 10. Header/TOC Organisation - 🗂️ STRUCTURAL
**Actions:**
- Integrate health indicator without disrupting mobile navigation
- Review table of contents structure with new health dashboard
- Optimise header hierarchy for better UX flow
- Ensure unique emoji usage throughout navigation

### 11. UI/UX Final Polish - ✨ REFINEMENTS
**Actions:**
- Ensure colourless mana coverage is complete throughout application
- Review all UI components for UK English consistency
- Verify all globals.css styling is optimised
- Test health dashboard integration across all screen sizes

## Notes
- All changes must maintain UK spelling (favourites, colour, organisation, etc.)
- Use globals.css for all styling modifications
- Avoid regex searches to conserve development tokens
- Reference existing `release_strategy.md` for GitHub release creation
- Health dashboard components are fully functional - integration focus needed

## Assessment Showcase Priorities
1. **Performance Story**: Health dashboard demonstrates production-ready monitoring
2. **Release Timeline**: GitHub releases show professional development lifecycle
3. **Design Documentation**: Figma prototype evidences UI/UX design thinking
4. **Security Excellence**: Highlight 100/100 security audit score
5. **Testing Coverage**: Emphasise 96 passing tests as quality assurance
6. **Professional Practices**: Release strategy + health monitoring = production mindset

## Implementation Order
**Phase 1 (Critical Fixes):** 🔧 Mechanics data parsing + 🃏 Placeholder card handling + 🎨 Button styling consistency
**Phase 2 (Enhancement):** 🔍 Search animation + 🏥 Header health integration + 🎨 Figma prototype development  
**Phase 3 (Final Polish):** 📝 Content cleanup and final refinements

**Estimated Time:** 2-3 days for critical fixes + enhancements
**Current Status:** 95% feature complete - critical UX issues identified, need immediate attention

## Priority Assessment Update
**Critical Issues Found:**
- Mechanics descriptions showing garbled content affects core learning experience
- Placeholder cards create unprofessional appearance  
- Button styling inconsistencies affect professional presentation
- Search UX could be more intuitive

**These issues impact assessment presentation and should be addressed before final submission.**
