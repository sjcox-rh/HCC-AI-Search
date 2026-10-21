import * as React from 'react';
import { createPortal } from 'react-dom';
import './FeedbackOverlay.css';

const WEBHOOK_URL = 'https://script.google.com/a/macros/redhat.com/s/AKfycbxNWhEZpO1uBGXqPPRcfX5n9wCo60I0UVLi4T3DyNJY4UU1fOMXSTK6uAepU1H1WJSG4g/exec';

const FeedbackModeContext = React.createContext(false);
const useFeedbackMode = (): boolean => React.useContext(FeedbackModeContext);
const FEEDBACK_DOC_URL = 'https://docs.google.com/document/d/1HMGAW6fX3Rl3ausA6uvCX3F4nLh-nIderV87B9RM05M/edit';
const STORAGE_KEY = 'hcc-feedback-pins';

interface FeedbackPin {
  id: string;
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
  pathname: string;
  author: string;
  comment: string;
  component: string;
  searchQuery: string;
  searchOpen: boolean;
  timestamp: string;
}

function readPins(): FeedbackPin[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writePins(pins: FeedbackPin[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
}

function detectComponent(el: Element | null): string {
  if (!el) return 'Unknown';
  const pf = el.closest('[class*="pf-v6-c-"]');
  if (pf) {
    const match = pf.className.match(/pf-v6-c-([\w-]+)/);
    if (match) return `PF/${match[1]}`;
  }
  const closest = el.closest('[data-ouia-component-type]');
  if (closest) return closest.getAttribute('data-ouia-component-type') || 'Unknown';
  const tag = el.tagName.toLowerCase();
  const cls = el.className && typeof el.className === 'string'
    ? el.className.split(/\s+/).find((c) => c && !c.startsWith('pf-'))
    : '';
  return cls ? `${tag}.${cls}` : tag;
}

/* ─── Pin Form ─── */

interface PinFormProps {
  x: number;
  y: number;
  onSubmit: (author: string, comment: string) => void;
  onCancel: () => void;
}

const PinForm: React.FC<PinFormProps> = ({ x, y, onSubmit, onCancel }) => {
  const [author, setAuthor] = React.useState('');
  const [comment, setComment] = React.useState('');
  const formRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const input = formRef.current?.querySelector('input');
    input?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(author.trim() || 'Anonymous', comment.trim());
  };

  const formWidth = 280;
  const formHeight = 220;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = x + formWidth + 16 > vw ? x - formWidth - 16 : x + 16;
  const top = y + formHeight + 16 > vh ? Math.max(8, vh - formHeight - 8) : y + 16;

  return (
    <div ref={formRef} className="feedback-pin-form" style={{ left, top }}>
      <form onSubmit={handleSubmit}>
        <div className="feedback-pin-form__header">📌 Leave feedback</div>
        <label className="feedback-pin-form__label">
          Name
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous" className="feedback-pin-form__input" />
        </label>
        <label className="feedback-pin-form__label">
          Comment
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="What do you think?" className="feedback-pin-form__textarea" rows={3} required />
        </label>
        <div className="feedback-pin-form__actions">
          <button type="button" className="feedback-pin-form__btn feedback-pin-form__btn--cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="feedback-pin-form__btn feedback-pin-form__btn--submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

/* ─── Pin Marker ─── */

const PinMarker: React.FC<{ pin: FeedbackPin; onDelete: (id: string) => void }> = ({ pin, onDelete }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className={`feedback-pin-marker ${expanded ? 'is-expanded' : ''}`} style={{ left: pin.x, top: pin.y }}>
      <button type="button" className="feedback-pin-marker__dot"
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        aria-label={`Feedback from ${pin.author}`} title={`${pin.author}: ${pin.comment}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </button>
      {expanded && (
        <div className="feedback-pin-marker__popover" onClick={(e) => e.stopPropagation()}>
          <div className="feedback-pin-marker__meta"><strong>{pin.author}</strong></div>
          <p className="feedback-pin-marker__comment">{pin.comment}</p>
          {pin.searchQuery && (
            <div className="feedback-pin-marker__search-query">🔍 <span>{pin.searchQuery}</span></div>
          )}
          <div className="feedback-pin-marker__footer">
            <span className="feedback-pin-marker__time">
              {new Date(pin.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
            <span className="feedback-pin-marker__component" title={pin.component}>{pin.component}</span>
          </div>
          <button type="button" className="feedback-pin-marker__delete" onClick={() => onDelete(pin.id)} aria-label="Delete pin">✕</button>
        </div>
      )}
    </div>
  );
};

/* ─── Comments Sidebar ─── */

const CommentsSidebar: React.FC<{
  pins: FeedbackPin[];
  collapsed: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}> = ({ pins, collapsed, onToggle, onDelete }) => (
  <div className={`feedback-sidebar ${collapsed ? 'feedback-sidebar--collapsed' : ''}`}>
    <button type="button" className="feedback-sidebar__edge-toggle" onClick={onToggle}
      aria-label={collapsed ? 'Show comments sidebar' : 'Hide comments sidebar'}>
      <span className="feedback-sidebar__edge-arrow">{collapsed ? '▶' : '◀'}</span>
    </button>
    <div className="feedback-sidebar__header">
      <span className="feedback-sidebar__title">Comments ({pins.length})</span>
    </div>
    <div className="feedback-sidebar__doc-link-wrap">
      <a href={FEEDBACK_DOC_URL} target="_blank" rel="noopener noreferrer" className="feedback-sidebar__doc-link">
        📄 View all comments in Google Doc
      </a>
    </div>
    <div className="feedback-sidebar__body">
      {pins.length === 0 ? (
        <p className="feedback-sidebar__empty">No comments on this page yet. Click anywhere to add one.</p>
      ) : (
        pins.map((pin) => (
          <div key={pin.id} className="feedback-sidebar__item">
            <div className="feedback-sidebar__item-header">
              <strong>{pin.author}</strong>
              <span className="feedback-sidebar__item-time">
                {new Date(pin.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <p className="feedback-sidebar__item-comment">{pin.comment}</p>
            {pin.searchQuery && (
              <div className="feedback-sidebar__item-query">🔍 {pin.searchQuery}</div>
            )}
            <div className="feedback-sidebar__item-footer">
              <span className="feedback-sidebar__item-component">{pin.component}</span>
              <button type="button" className="feedback-sidebar__item-delete" onClick={() => onDelete(pin.id)} aria-label="Delete comment">✕</button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ─── Feedback Overlay ─── */

interface FeedbackOverlayProps {
  searchQuery?: string;
  searchOpen?: boolean;
  children?: React.ReactNode;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ searchQuery = '', searchOpen = false, children }) => {
  const [active, setActive] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [pins, setPins] = React.useState<FeedbackPin[]>(() => readPins());
  const [pendingPin, setPendingPin] = React.useState<{ x: number; y: number; component: string } | null>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const currentPathname = window.location.pathname;
  const visiblePins = pins.filter((p) => p.pathname === currentPathname && p.searchOpen === searchOpen);

  React.useEffect(() => { writePins(pins); }, [pins]);

  const handleOverlayClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!active) return;
      if ((e.target as HTMLElement).closest('.feedback-pin-form, .feedback-pin-marker, .feedback-sidebar')) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const component = detectComponent(el);
      setPendingPin({ x: e.clientX, y: e.clientY, component });
    },
    [active],
  );

  const handleFormSubmit = React.useCallback(
    (author: string, comment: string) => {
      if (!pendingPin) return;
      const pin: FeedbackPin = {
        id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: pendingPin.x,
        y: pendingPin.y,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pathname: currentPathname,
        author,
        comment,
        component: pendingPin.component,
        searchQuery,
        searchOpen,
        timestamp: new Date().toISOString(),
      };
      setPins((prev) => [...prev, pin]);
      setPendingPin(null);

      if (WEBHOOK_URL) {
        try {
          const params = new URLSearchParams({
            timestamp: pin.timestamp, author: pin.author, component: pin.component,
            comment: pin.comment, page: pin.pathname, searchQuery: pin.searchQuery,
          });
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = `${WEBHOOK_URL}?${params.toString()}`;
          document.body.appendChild(iframe);
          setTimeout(() => iframe.remove(), 15000);
        } catch { /* silent */ }
      }
    },
    [pendingPin, currentPathname, searchQuery],
  );

  const handleDelete = React.useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const portalContent = (
    <>
      {/* ─── Sidebar (only when active) ─── */}
      {active && (
        <CommentsSidebar
          pins={visiblePins}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          onDelete={handleDelete}
        />
      )}

      {/* ─── Click overlay + pins ─── */}
      <div
        ref={overlayRef}
        className={`feedback-overlay ${active ? 'is-active' : ''}`}
        onClick={handleOverlayClick}
      >
        {active && <div className="feedback-overlay__scrim" />}
        {active && visiblePins.map((pin) => (
          <PinMarker key={pin.id} pin={pin} onDelete={handleDelete} />
        ))}
        {pendingPin && (
          <>
            <div className="feedback-pin-marker is-pending" style={{ left: pendingPin.x, top: pendingPin.y }}>
              <span className="feedback-pin-marker__dot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              </span>
            </div>
            <PinForm x={pendingPin.x} y={pendingPin.y} onSubmit={handleFormSubmit} onCancel={() => setPendingPin(null)} />
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ─── Top bar (inline, pushes content down) ─── */}
      <div className={`feedback-topbar ${active ? 'feedback-topbar--active' : ''}`}>
        <div className="feedback-topbar__inner">
          <span className="feedback-topbar__label">💬 Comment Mode</span>
          <label className="feedback-topbar__toggle">
            <input type="checkbox" checked={active} onChange={() => { setActive((v) => { if (!v) setSidebarCollapsed(false); return !v; }); setPendingPin(null); }} />
            <span className="feedback-topbar__slider" />
          </label>
        </div>
      </div>
      <FeedbackModeContext.Provider value={active}>
        {children}
      </FeedbackModeContext.Provider>
      {createPortal(portalContent, document.body)}
    </>
  );
};

export { FeedbackOverlay, useFeedbackMode };
