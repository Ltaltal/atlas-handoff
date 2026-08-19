// audit — reads accessibility facts out of a rendered subtree.
//
// The rest of the handoff measures components rather than describing them, and
// there is no reason accessibility should be the exception. A written heading
// outline is a claim about the markup; this reads the markup. When someone
// changes a component the answers here change with it, which is the only way a
// review of this kind stays true.
//
// It reports what is *checkable*: the heading outline, what the tab order
// actually contains, and whether every stop has an accessible name. Judgement —
// whether a name is a good one, whether the order makes sense — is still a
// person's job, and is written down as prose next to these facts.

/** How a control got the name a screen reader will read out. */
export type NameSource = 'aria-label' | 'aria-labelledby' | 'label' | 'content' | 'title' | 'none';

export interface AuditHeading {
  level: number;
  text: string;
  /** Set when this heading is more than one level below the one before it. */
  skippedFrom?: number;
}

export interface AuditStop {
  /** Tag plus whatever distinguishes it, e.g. `button.primary`. */
  target: string;
  role: string;
  name: string;
  nameSource: NameSource;
}

export interface AuditResult {
  headings: AuditHeading[];
  stops: AuditStop[];
  /** Focusable things a screen reader would announce as unlabelled. */
  unnamed: AuditStop[];
  /** Focusable things inside an aria-hidden subtree — reachable but invisible. */
  hiddenButFocusable: AuditStop[];
}

const FOCUSABLE = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[tabindex]',
  '[contenteditable="true"]',
].join(',');

const IMPLICIT_ROLE: Record<string, string> = {
  A: 'link',
  BUTTON: 'button',
  SELECT: 'combobox',
  TEXTAREA: 'textbox',
  SUMMARY: 'button',
};

function roleOf(el: Element): string {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit;
  if (el.tagName === 'INPUT') {
    const type = (el as HTMLInputElement).type;
    if (type === 'checkbox' || type === 'radio') return type;
    return 'textbox';
  }
  return IMPLICIT_ROLE[el.tagName] ?? el.tagName.toLowerCase();
}

/**
 * The name a screen reader would announce, and where it came from.
 *
 * This follows the order the accessible name calculation uses for the cases
 * that occur here; it is not the full spec, and it says which rule fired so a
 * surprising answer can be traced rather than argued about.
 */
function nameOf(el: Element): { name: string; source: NameSource } {
  const label = el.getAttribute('aria-label')?.trim();
  if (label) return { name: label, source: 'aria-label' };

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    if (text) return { name: text, source: 'aria-labelledby' };
  }

  if (el.id) {
    const explicit = el.ownerDocument.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const text = explicit?.textContent?.trim();
    if (text) return { name: text, source: 'label' };
  }

  const wrapping = el.closest('label')?.textContent?.trim();
  if (wrapping) return { name: wrapping, source: 'label' };

  // A control's own text. Components often render a second copy of a label for
  // sizing, so repeated text collapses to one.
  const content = el.textContent?.trim().replace(/\s+/g, ' ') ?? '';
  if (content) {
    const half = content.slice(0, content.length / 2);
    const deduped = half && content === half + half ? half : content;
    return { name: deduped, source: 'content' };
  }

  const title = el.getAttribute('title')?.trim();
  if (title) return { name: title, source: 'title' };

  return { name: '', source: 'none' };
}

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const type = el.getAttribute('type');
  return type && tag === 'input' ? `${tag}[${type}]` : tag;
}

/** True when the element is present but not rendered, so it is not a real stop. */
function isRendered(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  return Boolean((el as HTMLElement).offsetParent) || style.position === 'fixed';
}

export function auditHeadings(root: ParentNode): AuditHeading[] {
  const found = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isRendered);
  let previous = 0;
  return found.map((el) => {
    const level = Number(el.tagName[1]);
    const heading: AuditHeading = {
      level,
      text: el.textContent?.trim().replace(/\s+/g, ' ') ?? '',
    };
    if (previous && level > previous + 1) heading.skippedFrom = previous;
    previous = level;
    return heading;
  });
}

export function auditTabOrder(root: ParentNode): AuditStop[] {
  return [...root.querySelectorAll(FOCUSABLE)]
    .filter((el) => {
      if (!isRendered(el)) return false;
      if (el.getAttribute('tabindex') === '-1') return false;
      // A disabled control is not focusable, so it is not a stop. Listing it
      // would overstate how long the tab order is.
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
      return true;
    })
    .map((el) => {
      const { name, source } = nameOf(el);
      return {
        target: describe(el),
        role: roleOf(el),
        name,
        nameSource: source,
      };
    });
}

/** Everything the audit can determine about a rendered subtree. */
export function audit(root: ParentNode): AuditResult {
  const stops = auditTabOrder(root);
  const hiddenButFocusable = [...root.querySelectorAll(FOCUSABLE)]
    .filter((el) => isRendered(el) && !el.hasAttribute('disabled') && el.closest('[aria-hidden="true"]'))
    .map((el) => {
      const { name, source } = nameOf(el);
      return {
        target: describe(el),
        role: roleOf(el),
        name,
        nameSource: source,
      };
    });

  return {
    headings: auditHeadings(root),
    stops,
    unnamed: stops.filter((stop) => stop.nameSource === 'none'),
    hiddenButFocusable,
  };
}
