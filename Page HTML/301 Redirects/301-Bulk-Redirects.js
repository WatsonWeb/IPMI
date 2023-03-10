// Paste this in the console at the Webflow Publishing page to bulk-import 301 Redirects

let hostingContainer = document.getElementsByClassName("redirects")[0];
let hostingController = angular.element(hostingContainer);
let scope = hostingController.scope();

let redirects = [
	{ source: "/institutes-main", target: "/institutes" },
	{ source: "/virtual-think-tanks", target: "/thinktanks" },
	{ source: "/about-us", target: "/about" },
	{ source: "/contact-us", target: "/contact" },
	{ source: "/privacy-policy", target: "/privacy" },
	{ source: "/ehs-management-institute-2023", target: "/institutes/ehs-management-institute-2023" },
	{ source: "/hrmi-east-2023", target: "/institutes/hr-management-institute-east-2023" },
	{ source: "/hgc-feb-2023", target: "/institutes/hgc-feb-2023" },
	{ source: "/hchr-march-2023", target: "/institutes/healthcare-hrmi-2023" },
	{ source: "/healthcare-finance-institute-2023", target: "/institutes/healthcare-finance-institute-2023" },
	{ source: "/hrmi-canada-east-2023", target: "/institutes/hrm-institute-canada-east-2023" },
	{ source: "/corporate-wellness-institute-2022", target: "/institutes/corporate-wellness-institute-2022" },
	{ source: "/ip-law-management-institute-2022", target: "/institutes/ip-law-institute-2022" },
	{ source: "/hr-can-nov-2022", target: "/institutes/hrm-institute-canada-west-2022" },
	{ source: "/sales-operations-institute-2022", target: "/institutes/sales-operations-institute-2022" },
	{ source: "/hgc-october-2022", target: "/institutes/hgc-october-2022" },
	{ source: "/hchr-september-2022", target: "/institutes/hchr-2022" },
	{ source: "/cldi-2022", target: "/institutes/cldi-2022" },
	{ source: "/hrmi-west-2022", target: "/institutes/hrmi-west-2022" },
	{ source: "/healthcare-it-institute-2022", target: "/institutes/hit-2022" },
	{ source: "/taiee-can-2022", target: "/institutes/taiee-2022" },
	{ source: "/virtual-hchr-institute-2021", target: "/institutes" },
	{ source: "/corporate-wellness-institute", target: "/institutes" },
	{ source: "/hr-management-institute-canada-2021", target: "/institutes" },
	{ source: "/healthcare-law-compliance-institute-2021", target: "/institutes" },
	{ source: "/cld-institute", target: "/institutes" },
	{ source: "/virtual-ip-law-management-institute", target: "/institutes" },
	{ source: "/hr-management-institute-2", target: "/institutes" },
	{ source: "/virtual-healthcare-it-institute-july", target: "/institutes" },
	{ source: "/virtual-sales-operations-institute", target: "/institutes" },
	{ source: "/virtual-healthcare-it-institute", target: "/institutes" },
	{ source: "/ehs-management-institute", target: "/institutes" },
	{ source: "/hr-management-institute", target: "/institutes" },
	{ source: "/healthcare-law-compliance-institute", target: "/institutes" },
	{ source: "/corporate-learning-development-institute", target: "/institutes" },
	{ source: "/virtual-hr-management-institute-canada", target: "/institutes" },
	{ source: "/indeed-coffee-break-feb-23", target: "/thinktanks/indeed-vtt-feb-2023" },
	{ source: "/indeed-vtt-dec22-jan23", target: "/thinktanks/indeed-vtt-jan-2023" },
	{ source: "/apirasol-dec-14-2022-vtt", target: "/thinktanks/apirasol-vtt-dec-2022" },
	{ source: "/apirasol-nov-23-2022-vtt", target: "/thinktanks/apirasol-vtt-nov-2022" },
	{ source: "/crosschq-vtt-nov1-2022", target: "/thinktanks/crosschq-vtt-nov-2022" },
	{ source: "/servicenow-can-west-vtt-nov-23-2022/", target: "/thinktanks/servicenow-can-west-vtt-nov-2022" },
	{ source: "/apirasol-oct-12-2022-vtt", target: "/thinktanks" },
	{ source: "/servicenow-can-west-vtt-oct-19-2022", target: "/thinktanks" },
	{ source: "/servicenow-can-west-vtt-sept-8-2022", target: "/thinktanks" },
	{ source: "/hueman-august-9-2022-vtt", target: "/thinktanks" },
	{ source: "/indeed-coffee-break-august-11-12-2022", target: "/thinktanks" },
	{ source: "/indeed-coffee-break-august-23-2022", target: "/thinktanks" },
	{ source: "/vivvi-vtt-july13-2022", target: "/thinktanks" },
	{ source: "/vivvi-vtt-june1-2022", target: "/thinktanks" },
	{ source: "/thoughtexchange-vtt-may-2022", target: "/thinktanks" },
	{ source: "/hueman-vtt-april7-22", target: "/thinktanks" },
	{ source: "/vtt-vivvi-april27-2022", target: "/thinktanks" },
	{ source: "/indeed-coffee-break-april-2022", target: "/thinktanks" },
	{ source: "/hueman-vtt-march-3-2022", target: "/thinktanks" },
	{ source: "/thoughtexchange-march9-2022", target: "/thinktanks" },
	{ source: "/servicenow-vtt-march17-2022", target: "/thinktanks" },
	{ source: "/indeed-emplyer-brand-march-24-2022", target: "/thinktanks" },
	{ source: "/work-happiness-march-24-2022", target: "/thinktanks" },
	{ source: "/indeed-emplyer-brand-march-31-2022", target: "/thinktanks" },
	{ source: "/work-happiness-march-31-2022", target: "/thinktanks" },
	{ source: "/vtt-instride-feb4-2022", target: "/thinktanks" },
	{ source: "/crosschq-vtt-feb10-2022", target: "/thinktanks" },
	{ source: "/indeed-coffeebreak-jan2022", target: "/thinktanks" },
	{ source: "/indeed-employerbranding-ongoing-2022", target: "/thinktanks" },
	{ source: "/indeed-workhappiness-ongoing-2022", target: "/thinktanks" },
	{ source: "/servicenow-east-dec2-2021", target: "/thinktanks" },
	{ source: "/servicenow-can-dec14", target: "/thinktanks" },
	{ source: "/servicenow-can-dec16", target: "/thinktanks" },
	{ source: "/huemanvtt-dec16-2021", target: "/thinktanks" },
	{ source: "/hueman-vtt-nov-4-2021", target: "/thinktanks" },
	{ source: "/kronologic-oct-2021", target: "/thinktanks" },
	{ source: "/servicenow-east-nov16-2021", target: "/thinktanks" },
	{ source: "/crosschq-vtt-november-2021", target: "/thinktanks" },
	{ source: "/indeed-coffee-break-nov2021", target: "/thinktanks" },
	{ source: "/servicenow-can-nov30", target: "/thinktanks" },
	{ source: "/dorn-vtt-october16-2021", target: "/thinktanks" },
	{ source: "/kronologic-oct-nov-2021", target: "/thinktanks" },
	{ source: "/servicenow-vtt-sept16-2", target: "/thinktanks" },
	{ source: "/thoughtexchange-sept162021", target: "/thinktanks" },
	{ source: "/servicenowvtt-sept23", target: "/thinktanks" },
	{ source: "/how-does-culture-play-a-role-in-creating-a-best-in-class-integrated-risk-management-program-vtt", target: "/thinktanks" },
	{ source: "/be-the-employer-of-choice-by-investing-in-a-learning-culture-and-workforce-education-vtt", target: "/thinktanks" },
	{ source: "/the-hybrid-workforce-if-we-build-it-will-they-come", target: "/thinktanks" },
	{ source: "/the-state-of-the-economy-insights-to-help-guide-your-organization-august2021", target: "/thinktanks" },
	{ source: "/hueman-vtt-august26", target: "/thinktanks" },
	{ source: "/cyber-insurance-has-changed", target: "/thinktanks" },
	{ source: "/digital-transformation-in-financial-services", target: "/thinktanks" },
	{ source: "/practical-strategies-for-nurse-hiring-retention-post-pandemic-the-mental-health-edition", target: "/thinktanks" },
	{ source: "/the-covid-shift-emerging-strategies-in-workforce-planning-and-leading-teams-in-a-more-authentic-holistic-and-supported-way", target: "/thinktanks" },
	{ source: "/unlocking-the-potential-of-your-salesforce-the-key-to-winning-in-an-era-of-distributed-sales-leadership-2", target: "/thinktanks" },
	{ source: "/future-proof-your-talent-acquisition-strategy-with-a-world-class-rpo-partner", target: "/thinktanks" },
	{ source: "/how-to-achieve-systemic-cultural-change-and-drive-impact-on-all-key-pillars-operationalizing-leadership-best-practices-in-todays-environment-2", target: "/thinktanks" },
	{ source: "/how-to-achieve-systemic-cultural-change-and-drive-impact-on-all-key-pillars-operationalizing-leadership-best-practices-in-todays-environment", target: "/thinktanks" },
	{ source: "/furthering-the-dialogue-addressing-mental-health-to-protect-and-retain-our-nurses", target: "/thinktanks" },
	{ source: "/unlocking-the-potential-of-your-salesforce-the-key-to-winning-in-an-era-of-distributed-sales-leadership", target: "/thinktanks" },
	{ source: "/how-to-prepare-your-employees-for-returning-to-the-work-place-and-plan-for-the-future-in-financial-services", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-84", target: "/thinktanks" },
	{ source: "/leverage-artificial-intelligence-ai-to-identify-potentially-serious-injuries-and-fatalities-psif", target: "/thinktanks" },
	{ source: "/brave-new-workforce-how-to-prepare-your-organization-for-tomorrows-jobs", target: "/thinktanks" },
	{ source: "/creating-better-buying-experiences-in-a-virtual-selling-environment-6", target: "/thinktanks" },
	{ source: "/back-to-basics-driving-fulfillment-for-frontline-caregivers", target: "/thinktanks" },
	{ source: "/adapting-and-prospering-in-2021-and-beyond-6", target: "/thinktanks" },
	{ source: "/executive-strategies-for-nurse-hiring-and-retention-during-covid-19", target: "/thinktanks" },
	{ source: "/metrics-that-matter-driving-safety-performance-in-an-era-of-forced-autonomy-10", target: "/thinktanks" },
	{ source: "/agility-dei-and-cohesion-what-do-they-have-in-common-9", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-101", target: "/thinktanks" },
	{ source: "/the-state-of-ergonomic-injuries-today-and-tomorrow", target: "/thinktanks" },
	{ source: "/the-next-evolution-of-legal-ops-accelerating-revenue-and-improving-business-operations-3", target: "/thinktanks" },
	{ source: "/how-to-lead-in-a-post-covid-era-moving-from-transactional-to-personalized-authentic-engagement", target: "/thinktanks" },
	{ source: "/building-a-robust-employer-branding-strategy-for-the-year-ahead-2", target: "/thinktanks" },
	{ source: "/metrics-that-matter-driving-safety-performance-in-an-era-of-forced-autonomy-7", target: "/thinktanks" },
	{ source: "/adapting-and-prospering-in-2021-and-beyond-8", target: "/thinktanks" },
	{ source: "/agility-dei-and-cohesion-what-do-they-have-in-common-8", target: "/thinktanks" },
	{ source: "/economic-justice-aligning-your-financial-wellness-and-dei-initiatives-to-help-employees-build-wealth-for-their-families-6", target: "/thinktanks" },
	{ source: "/impact-of-product-stewardship-and-sustainability-commitment-on-ehs", target: "/thinktanks" },
	{ source: "/maximize-your-candidate-pipeline", target: "/thinktanks" },
	{ source: "/the-next-evolution-of-legal-ops-accelerating-revenue-and-improving-business-operations-2", target: "/thinktanks" },
	{ source: "/metrics-that-matter-driving-safety-performance-in-an-era-of-forced-autonomy", target: "/thinktanks" },
	{ source: "/creating-better-buying-experiences-in-a-virtual-selling-environment", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-99", target: "/thinktanks" },
	{ source: "/how-a-large-hospital-and-health-system-is-leveraging-an-rpo-partner-to-overcome-the-biggest-challenges-in-healthcare-talent-acquisition-16", target: "/thinktanks" },
	{ source: "/beyond-policies-a-roadmap-to-accelerate-change-and-adoption-for-dei-and-ld", target: "/thinktanks" },
	{ source: "/it-is-about-the-money-aligning-your-financial-wellness-and-dei-initiatives-to-help-employees-build-wealth-for-their-families", target: "/thinktanks" },
	{ source: "/adapting-and-prospering-in-2021-and-beyond-5", target: "/thinktanks" },
	{ source: "/building-a-robust-employer-branding-strategy-for-the-year-ahead", target: "/thinktanks" },
	{ source: "/agility-dei-and-cohesion-what-do-they-have-in-common", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-82", target: "/thinktanks" },
	{ source: "/addressing-ransomware-threats-2", target: "/thinktanks" },
	{ source: "/hospitals-challenges-and-opportunities-like-never-before", target: "/thinktanks" },
	{ source: "/economic-justice-the-role-of-hr-practitioners", target: "/thinktanks" },
	{ source: "/driving-hr-innovation-in-global-hi-tech-organizations", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-83", target: "/thinktanks" },
	{ source: "/the-next-evolution-of-legal-ops-accelerating-revenue-and-improving-business-operations", target: "/thinktanks" },
	{ source: "/developing-agility-in-your-organization", target: "/thinktanks" },
	{ source: "/strategic-shifts-in-financial-operations-to-combat-the-challenges-of-covid-19-an-interactive-reflection-discussion-6", target: "/thinktanks" },
	{ source: "/unlocking-the-potential-of-frontline-nurse-managers-to-drive-engagement-and-retention-2", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-64", target: "/thinktanks" },
	{ source: "/addressing-ransomware-threats", target: "/thinktanks" },
	{ source: "/addressing-diversity-equity-and-inclusion-in-our-current-reality-17", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-59", target: "/thinktanks" },
	{ source: "/aligning-cost-with-value-best-practices-for-selecting-a-maintenance-and-renewal-service-fee-provider", target: "/thinktanks" },
	{ source: "/strategic-shifts-in-financial-operations-to-combat-the-challenges-of-covid-19-an-interactive-reflection-discussion", target: "/thinktanks" },
	{ source: "/the-impact-of-covid-19-on-employee-engagement-in-healthcare-16", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-65", target: "/thinktanks" },
	{ source: "/hrs-role-in-supporting-employees-in-a-new-world-of-work", target: "/thinktanks" },
	{ source: "/how-a-large-hospital-and-health-system-is-leveraging-an-rpo-partner-to-overcome-the-biggest-challenges-in-healthcare-talent-acquisition-8", target: "/thinktanks" },
	{ source: "/patent-prosecution-process-myths-versus-reality", target: "/thinktanks" },
	{ source: "/ai-quality-of-hire-the-foundation-for-the-next-level-of-hiring-4", target: "/thinktanks" },
	{ source: "/strategies-to-reduce-sifs-by-tappingiinto-human-performance-behaviors-and-safety-ownership", target: "/thinktanks" },
	{ source: "/comparing-cybersecurity-strategies-3", target: "/thinktanks" },
	{ source: "/do-you-know-your-patients-driving-connected-healthcare-experiences-to-gain-a-360-degree-consumer-view", target: "/thinktanks" },
	{ source: "/the-new-future-of-healthcare-talent-development", target: "/thinktanks" },
	{ source: "/tried-and-tested-an-interactive-peer-discussion-on-proven-strategies-to-drive-margin-improvement", target: "/thinktanks" },
	{ source: "/innovation-in-the-new-normal-an-interactive-discussion-and-reflection-on-hiring-post-pandemic-3", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-38", target: "/thinktanks" },
	{ source: "/unlocking-the-potential-of-frontline-nurse-managers-to-drive-engagement-and-retention-unc", target: "/thinktanks" },
	{ source: "/addressing-diversity-equity-and-inclusion-in-our-current-reality-11", target: "/thinktanks" },
	{ source: "/the-new-future-of-work-10", target: "/thinktanks" },
	{ source: "/the-impact-of-covid-19-on-employee-engagement-in-healthcare-3", target: "/thinktanks" },
	{ source: "/why-the-employee-commute-is-an-hr-imperative-for-every-healthcare-employer-13", target: "/thinktanks" },
	{ source: "/enabling-internal-talent-to-develop-critical-skills-for-the-new-world-of-work", target: "/thinktanks" },
	{ source: "/do-you-know-your-patients-driving-connected-healthcare-experiences-to-gain-a-360-degree-consumer-view-4", target: "/thinktanks" },
	{ source: "/mapping-the-technology-frontiers-of-trade-and-ip-in-todays-digital-economy", target: "/thinktanks" },
	{ source: "/re-thinking-the-national-sales-meeting-running-a-virtual-kickoff-during-a-pandemic", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-27", target: "/thinktanks" },
	{ source: "/ai-quality-of-hire-the-foundation-for-the-next-level-of-hiring-10", target: "/thinktanks" },
	{ source: "/tried-and-tested-an-interactive-peer-discussion-on-proven-strategies-to-drive-margin-improvement-4", target: "/thinktanks" },
	{ source: "/the-state-of-the-economy-insights-to-help-guide-your-organization-2", target: "/thinktanks" },
	{ source: "/addressing-diversity-equity-and-inclusion-in-our-current-reality-2", target: "/thinktanks" },
	{ source: "/making-virtual-work-work-for-the-long-term", target: "/thinktanks" },
	{ source: "/exceeding-modern-buyer-expectations-in-the-new-normal", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-26", target: "/thinktanks" },
	{ source: "/aligning-strategy-for-results", target: "/thinktanks" },
	{ source: "/staying-connected-and-staying-productive-in-a-changing-world", target: "/thinktanks" },
	{ source: "/comparing-cybersecurity-strategies-1", target: "/thinktanks" },
	{ source: "/innovation-in-the-new-normal-an-interactive-discussion-and-reflection-on-hiring-post-pandemic", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-28", target: "/thinktanks" },
	{ source: "/how-to-hire-and-retain-top-nurses-during-covid-19-and-beyond-10", target: "/thinktanks" },
	{ source: "/virtual-case-study-digital-reference-checks-with-lincoln-property-company", target: "/thinktanks" },
	{ source: "/can-a-cfo-implement-effective-healthcare-cost-reduction-strategies-without-sacrificing-patient-satisfaction-11", target: "/thinktanks" },
	{ source: "/strategies-to-reduce-sifs-tapping-behavioral-science-psychology-performance", target: "/thinktanks" },
	{ source: "/creating-and-sustaining-a-culture-of-diversity-inclusion-and-belonging-3", target: "/thinktanks" },
	{ source: "/why-the-employee-commute-is-an-hr-imperative-for-every-healthcare-employer-2", target: "/thinktanks" },
	{ source: "/unlocking-the-potential-of-frontline-nurse-managers-to-drive-engagement-and-retention", target: "/thinktanks" },
	{ source: "/the-new-future-of-work-8", target: "/thinktanks" },
	{ source: "/how-to-pivot-your-employer-branding-strategy-during-times-of-crisis-2", target: "/thinktanks" },
	{ source: "/supporting-employees-during-a-pandemic-7", target: "/thinktanks" },
	{ source: "/innovation-in-the-new-normal-an-interactive-discussion-and-reflection-on-hiring-post-pandemic-2", target: "/thinktanks" },
	{ source: "/how-a-large-hospital-and-health-system-is-leveraging-an-rpo-partner-to-overcome-the-biggest-challenges-in-healthcare-talent-acquisition", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-29", target: "/thinktanks" },
	{ source: "/the-impact-of-covid-19-on-employee-engagement-in-healthcare-2", target: "/thinktanks" },
	{ source: "/mastering-virtual-selling-and-client-relationships-in-a-remote-world-9", target: "/thinktanks" },
	{ source: "/how-hr-leaders-can-help-employees-avoid-robbing-themselves-of-future-financial-success", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-15", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change-12", target: "/thinktanks" },
	{ source: "/harassment-prevention-meeting-state-mandates-7", target: "/thinktanks" },
	{ source: "/converting-diversity-inclusion-initiatives-into-measurable-change", target: "/thinktanks" },
	{ source: "/how-to-hire-and-retain-top-nurses-during-covid-19-and-beyond-9", target: "/thinktanks" },
	{ source: "/can-a-cfo-implement-effective-healthcare-cost-reduction-strategies-without-sacrificing-patient-satisfaction", target: "/thinktanks" },
	{ source: "/creating-and-sustaining-a-culture-of-diversity-inclusion-and-belonging", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-8", target: "/thinktanks" },
	{ source: "/supporting-employees-during-a-pandemic", target: "/thinktanks" },
	{ source: "/addressing-diversity-equity-and-inclusion-in-our-current-reality", target: "/thinktanks" },
	{ source: "/going-beyond-cost-containment-revenue-accretive-strategies-for-financial-resiliency-11", target: "/thinktanks" },
	{ source: "/the-new-future-of-work-4", target: "/thinktanks" },
	{ source: "/psychological-first-aid-helping-the-healthcare-professional-6", target: "/thinktanks" },
	{ source: "/converting-diversity-inclusion-initiatives-into-measurable-change-2", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change-14", target: "/thinktanks" },
	{ source: "/mastering-virtual-selling-and-client-relationships-in-a-remote-world", target: "/thinktanks" },
	{ source: "/how-to-pivot-your-employer-branding-strategy-during-times-of-crisis", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-9", target: "/thinktanks" },
	{ source: "/creating-and-sustaining-a-culture-of-diversity-inclusion-and-belonging-2", target: "/thinktanks" },
	{ source: "/never-let-a-good-crisis-go-to-waste-seizing-opportunities-in-the-wake-of-the-pandemic", target: "/thinktanks" },
	{ source: "/build-enable-and-prioritize-how-healthcare-organizations-can-plan-for-the-future-3", target: "/thinktanks" },
	{ source: "/never-let-a-good-crisis-go-to-waste-seizing-opportunities-in-the-wake-of-the-pandemic-2", target: "/thinktanks" },
	{ source: "/never-let-a-good-crisis-go-to-waste-seizing-opportunities-in-the-wake-of-the-pandemic-3", target: "/thinktanks" },
	{ source: "/driving-sustainable-value-with-clinical-variation-reduction-strategy", target: "/thinktanks" },
	{ source: "/diversity-inclusion-in-the-healthcare-workplace-having-critical-conversations-3", target: "/thinktanks" },
	{ source: "/diversity-and-inclusion-having-difficult-conversations", target: "/thinktanks" },
	{ source: "/sales-message-design-in-a-virtual-world-3", target: "/thinktanks" },
	{ source: "/the-state-of-the-economy-insights-to-help-guide-your-organization", target: "/thinktanks" },
	{ source: "/build-enable-and-prioritize-how-healthcare-organizations-can-plan-for-the-future-2", target: "/thinktanks" },
	{ source: "/adapting-your-learning-culture-to-a-suddenlyremote-world", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change-13", target: "/thinktanks" },
	{ source: "/psychological-first-aid-helping-the-healthcare-professional", target: "/thinktanks" },
	{ source: "/reopening-america-what-hospitals-and-health-systems-can-do-to-recover", target: "/thinktanks" },
	{ source: "/how-to-hire-and-retain-top-nurses-during-covid-19-and-beyond", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-7", target: "/thinktanks" },
	{ source: "/sales-message-design-in-a-virtual-world", target: "/thinktanks" },
	{ source: "/implement-effective-healthcare-cost-reduction-strategies", target: "/thinktanks" },
	{ source: "/the-new-future-of-work-2", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-3", target: "/thinktanks" },
	{ source: "/challenging-assumptions-an-opportunity-to-explore-value", target: "/thinktanks" },
	{ source: "/lessons-learned-in-the-aftermath-of-covid-19-3", target: "/thinktanks" },
	{ source: "/going-beyond-cost-containment-revenue-accretive-strategies-for-financial-resiliency", target: "/thinktanks" },
	{ source: "/leadership-strategies-in-times-of-change-leveraging-chro-voices-to-navigate-and-lead-the-changes-necessary-for-successful-outcomes", target: "/thinktanks" },
	{ source: "/driving-sustainable-value-with-clinical-variation-reduction-cvr-strategy", target: "/thinktanks" },
	{ source: "/challenging-assumptions-an-opportunity-to-explore-value-3", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change-4", target: "/thinktanks" },
	{ source: "/the-new-future-of-work-3", target: "/thinktanks" },
	{ source: "/build-enable-and-prioritize-how-healthcare-organizations-can-plan-for-the-future", target: "/thinktanks" },
	{ source: "/challenging-assumptions-an-opportunity-to-explore-value-2", target: "/thinktanks" },
	{ source: "/diversity-and-inclusion-having-difficult-conversations-7", target: "/thinktanks" },
	{ source: "/lessons-learned-in-the-aftermath-of-covid-19-4", target: "/thinktanks" },
	{ source: "/driving-sustainable-value-with-clinical-variation-reduction-cvr-strategy-2", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work-2", target: "/thinktanks" },
	{ source: "/reopening-america-what-hospitals-and-health-systems-can-do-to-recover-2", target: "/thinktanks" },
	{ source: "/having-critical-diversity-and-inclusion-conversations-in-the-healthcare-workplace", target: "/thinktanks" },
	{ source: "/sales-message-design-in-a-virtual-world-2", target: "/thinktanks" },
	{ source: "/challenging-assumptions-an-opportunity-to-explore-value-4", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change-3", target: "/thinktanks" },
	{ source: "/going-beyond-cost-containment-revenue-accretive-strategies-for-financial-resiliency-2", target: "/thinktanks" },
	{ source: "/everything-has-changed-but-these-five-things-remain-important-for-talent-development", target: "/thinktanks" },
	{ source: "/adapting-to-changes-in-the-healthcare-workplace-post-covid-19", target: "/thinktanks" },
	{ source: "/navigating-covid-19-the-benefits-of-outsourcing", target: "/thinktanks" },
	{ source: "/hiring-to-meet-surging-demand-for-key-skills-and-roles", target: "/thinktanks" },
	{ source: "/mid-cycle-revenue-strategies-for-financial-recovery-now-and-post-covid-19", target: "/thinktanks" },
	{ source: "/agility-the-essential-superpower-in-the-new-world-of-work", target: "/thinktanks" },
	{ source: "/the-new-future-of-work", target: "/thinktanks" },
	{ source: "/reopening-america-what-hospitals-can-do-to-recove", target: "/thinktanks" },
	{ source: "/lessons-learned-in-the-aftermath-of-covid-19", target: "/thinktanks" },
	{ source: "/cybersecurity-strategies-in-times-of-change", target: "/thinktanks" },
	{ source: "/strategies-and-tactics-to-accommodate-staff-reacclimatizing-to-their-new-normal-and-how-to-best-measure-at-scale-real-time-satisfaction-in-the-new-environment", target: "/thinktanks" },
	{ source: "/leadership-resilience", target: "/thinktanks" },
	{ source: "/vtt-navigating-post-covid-19", target: "/thinktanks" },
	{ source: "/vtt-crisis-management", target: "/thinktanks" },
	{ source: "/thinking-ahead-how-to-effectively-prepare-for-a-safe-relaunch-post-covid", target: "/thinktanks" },
	{ source: "/building-resilience-in-the-face-of-crisis-trust-transparency-and-teamwork", target: "/thinktanks" },
	{ source: "/leadership-strategies-in-times-of-change", target: "/thinktanks" },
	{ source: "/vtt-leadership-resilience", target: "/thinktanks" },
	{ source: "/turbo-charge-innovation-through-inclusion", target: "/thinktanks" },
	{ source: "/2022/12/cwi-2022-recap", target: "/recaps/cwi-recap-2022" },
	{ source: "/2022/11/soi-2022-recap", target: "/recaps/soi-recap-2022" },
	{ source: "/2022/11/hrcan-west-2022-recap", target: "/recaps/hr-can-nov-recap-2022" },
	{ source: "/2022/11/ip-law-2023-recap", target: "/recaps/ip-law-recap-2022" },
	{ source: "/2022/10/hgc-oct2022-recap", target: "/recaps/hgc-oct-recap-2022" },
	{ source: "/2022/09/hchr-2022-recap", target: "/recaps/hchr-recap-2022" },
	{ source: "/2022/09/cldi-2022-recap", target: "/recaps/cldi-2022" },
	{ source: "/2022/08/hr-west-2022-recap", target: "/recaps/hr-west-2022" },
	{ source: "/2022/06/taiee-2022-recap", target: "/recaps/taiee-2022" },
	{ source: "/2022/06/tai-2022-recap", target: "/recaps/tai-2022" },
	{ source: "/2022/06/hit-2022-recap", target: "/recaps/hit-2022" },
	{ source: "/2022/05/hfi-eventrecap-2022", target: "/recaps/hfi-2022" },
	{ source: "/2022/05/hr-canada-april-2022-recap", target: "/recaps/hr-canada-april-2022" },
	{ source: "/2022/04/hr-east-2022-recap", target: "/recaps/hr-east-2022" },
	{ source: "/2022/03/hgc2022-recap", target: "/recaps/hgc-2022" },
	{ source: "/2022/02/back-and-better-than-ever-at-the-2022-ehs-management-institute-in-scottsdale-az", target: "/recaps/ehs-2022" },
	{ source: "/2021/11/cwi-2021-recap", target: "/recaps" },
	{ source: "/2021/11/hr-canada-recap-2021", target: "/recaps" },
	{ source: "/2021/10/hgc-2021-recap", target: "/recaps" },
	{ source: "/2021/10/cldi-2021-eventrecap", target: "/recaps" },
	{ source: "/2021/08/ip-leaders-connect-virtually-to-share-best-practices-for-navigating-the-evolving-ip-landscape", target: "/recaps" },
	{ source: "/2021/07/hr-july-event-recap", target: "/recaps" },
	{ source: "/2021/06/sales-ops-leaders-gather-virtually-for-the-2021-sales-operations-institute", target: "/recaps" },
	{ source: "/2021/05/talent-acquisition-leaders-unite-virtually-to-collaborate-on-future-ta-success", target: "/recaps" },
	{ source: "/2021/05/with-every-challenge-comes-opportunity-for-growth-and-canadian-hr-leaders-are-seizing-those-opportunities", target: "/recaps" },
	{ source: "/2021/03/healthcare-law-compliance-event-recap", target: "/recaps" },
	{ source: "/2021/03/2021-the-year-of-hr", target: "/recaps" },
	{ source: "/2021/02/happy-new-year-ipmi-kicks-off-2021-with-the-virtual-ehs-management-institute", target: "/recaps" },
	{ source: "/2020/11/canadian-hr-leaders-gather-virtually-to-uncover-strategies-for-success-in-navigating-the-future-of-work", target: "/recaps" },
	{ source: "/2020/10/ipmi-hosts-first-virtual-corporate-learning-development-institute-a-great-success", target: "/recaps" },
	{ source: "/2020/03/healthcare-legal-executives-gather-for-cle-meeting-at-the-ritz-carlton-in-amelia-island-fl", target: "/recaps" },
	{ source: "/2020/03/the-ritz-carlton-in-amelia-island-hosts-hr-executives-at-the-annual-hr-management-institute", target: "/recaps" },
	{ source: "/2020/02/ehs-leaders-gather-for-the-2020-ehs-management-institute", target: "/recaps" },
	{ source: "/2019/11/ip-leaders-gather-in-westlake-village-ca-to-share-insights-on-how-to-effectively-maximize-and-evolve-your-ip-portfolio", target: "/recaps" },
	{ source: "/2019/11/muskoka-hosts-hr-leaders-for-the-2019-hr-management-institute", target: "/recaps" },
	{ source: "/2019/10/la-jolla-hosts-sales-operations-leaders-for-the-2019-sales-operations-institute", target: "/recaps" },
	{ source: "/2019/09/corporate-learning-development-institute", target: "/recaps" },
	{ source: "/2019/09/healthcare-hr-management-institute", target: "/recaps" },
	{ source: "/2019/07/hr-management-institute-west-2", target: "/recaps" },
	{ source: "/2019/06/talent-acquisition-institute-canada-2", target: "/recaps" },
	{ source: "/2019/06/healthcare-it-institute", target: "/recaps" },
	{ source: "/2019/05/talent-acquisition-usa", target: "/recaps" },
	{ source: "/2019/04/healthcare-finance", target: "/recaps" },
	{ source: "/2019/04/healthcare-law", target: "/recaps" },
];

redirects.forEach(function (rule) {
	scope.redirectPath = rule.source;
	scope.redirectTarget = rule.target;
	scope.addRedirect();
});
