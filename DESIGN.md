# Valore — Design system

## Identity and philosophy
A contemporary Toronto property firm, expressed through architectural photography, expressive editorial typography and precise service information. Brand colours and photography are the principal visual elements. No invented proof, property listings or performance statistics.

## Palette
| Token | Value | Role |
|---|---|---|
| ink | #0B0B0D | Brand, headings, dark sections |
| charcoal | #171719 | Secondary dark surface |
| red | #B5121B | Primary actions and selected states |
| red-hover | #941018 | Primary hover |
| white | #FFFFFF | Main surface, dark foreground |
| paper | #F7F6F3 | Secondary section surface |
| line | #E6E5E3 | Rules and fields |
| muted | #626269 | Accessible secondary text on light |
| dark-muted | #C0BFC1 | Secondary text on ink |

White-on-red controls use the darker brand red for AA contrast. Focus uses a red outer ring with a contrasting gap. Errors include text, never colour alone.

## Typography
Self-hosted DM Serif Display (regular) for editorial headings; Manrope (400–700 variable, Latin WOFF2) for body, navigation and controls. Both distributed under SIL Open Font License; licences in public/fonts. Display lettering is title/sentence case, no gratuitous labels. Scale: body 16–18px; small 12–14px; h3 24–32px; h2 clamp(36px,4.2vw,60px); h1 clamp(46px,6.6vw,96px). Display line height 1.04–1.12, tracking -0.025em; body line-height 1.7. Keep prose under 70ch. Tabular numerals for prices.

## Grid, space and responsive layout
Container maximum 1280px. Page gutters: 20px compact mobile, 28px tablet, 56px desktop. 12-column conceptual grid; split content 5/7 or 6/6. Spacing scale 4,8,12,16,24,32,40,48,64,80,104,128px. Section padding 72px mobile, 112px desktop. Breakpoints 640,768,1024,1280,1536px. Art-direct mobile independently: stacked copy, shorter image crops, full-width primary actions where useful. No page-level horizontal scrolling.

## Components
Header: 94px desktop / 78px mobile, white, sticky, fine bottom rule after scroll. Original typographic Valore lockup and angular V mark. Desktop links in one row; compact navigation in native modal dialog with labelled close, focus containment, Escape and return focus. Primary quote access remains visible.

Buttons: minimum 48px high, square corners (2px), 16–24px padding, sans 13–14px semibold. Primary red, secondary white outline on photography, tertiary underlined text with a small Lucide arrow. No decorative shadows or pills. Disabled states are explicit.

Pricing: three aligned columns with shared baselines. Signature has a red top rule, Recommended label and dark surface; rate and minimum always visible. Detailed comparison uses a semantic table inside a labelled horizontal scroll region on small screens. Inspection count is total, not additive. Add-ons use simple definition rows.

Forms: persistent visible labels, 48px controls, 16px text, 2-column only at larger widths; grouped fieldsets. Required/optional distinctions, inline field errors with aria-describedby, status announcements and focusable recovery. Consent covers response to the enquiry only. Honeypot is not in the tab order. No data in query strings.

FAQ: native details/summary with 48px targets, explicit expanded indicator and divided rows.

## Shape, line and iconography
Architecture is rectangular. 0–2px radii for interface; no generic rounded card grid, unnecessary shadows or gradients. Photography overlays may use a neutral luminance gradient solely for legibility. 1px borders. Lucide icons with consistent 1.5px stroke, decorative icons hidden from screen readers. Numbering only for actual process steps.

## Motion
One authored hero entrance: image resolves and type settles, 800ms cubic-bezier(.2,.7,.2,1). Natural-flow image depth up to 32px with stable text and frame, using requestAnimationFrame, no scroll hijacking or pinned blank space. Process line grows on entry once; service image reacts to selection. Hover 180ms; navigation 200ms. Content is visible without JavaScript. Reduced motion disables travel/reveals while preserving all information and controls.

## Image direction
Toronto skyline and contemporary residential interiors, natural light, neutral material, clean architectural lines. Self-host assets and serve with next/image; explicit sizes and aspect ratios. Editorial stock is marked illustrative, not a Valore portfolio. Hero uses a deliberately darkened crop for text contrast. No synthetic client portraits or staff.

## Page conventions
Home: image-led opening → spacious editorial introduction → interactive service index → service principles → process → pricing → geographic context → FAQ → enquiry. Distinct scene cuts, natural scrolling. Internal pages: large editorial opening, task-led content, useful CTA, consistent footer. About uses photography and plain service principles; pricing prioritizes comparison; quote and contact prioritize clarity and recovery.

## Accessibility and performance
Semantic landmarks, one h1, logical headings, skip link, visible focus, aria-current navigation, 44px targets, labelled errors, no hover-only content. Respect reduced motion; test 320–1920px. Self-host fonts, image optimization, server components by default, limited client islands. No marketing trackers. Test actual rendering and report measured limits honestly.

## Taste review
The brief deliberately asks for a black/red/white editorial real estate identity. Avoid the generic luxury-serifs-on-cream template by anchoring the opening in Toronto, using Manrope's technical clarity beside the serif, a compact architectural mark, an asymmetric service index and practical pricing tools. No unrelated decorative numbering, badges or filler metrics.
