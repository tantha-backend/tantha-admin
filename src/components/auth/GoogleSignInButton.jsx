import { useEffect, useRef, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

/**
 * Loads Google's sign-in library once, however many buttons ask for it.
 *
 * Kept as a shared promise rather than a script tag in index.html so the
 * dashboard does not fetch Google on every page load for a script only the
 * login screen uses.
 */
let loader = null;

const loadGoogle = () => {
  if (window.google?.accounts?.id) return Promise.resolve();

  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        // Let a later attempt retry rather than caching the failure forever.
        loader = null;
        reject(new Error("Could not reach Google"));
      };

      document.head.appendChild(script);
    });
  }

  return loader;
};

/**
 * Google's own sign-in button.
 *
 * Rendered by Google rather than drawn by us, because their branding rules
 * require it and because the button is what carries the account chooser.
 *
 * It hands back an ID token, which is passed straight to the backend. Nothing
 * here decides whether the person may enter — the token only proves which
 * Google account they are, and the server decides what that account can do.
 */
function GoogleSignInButton({ onToken, onError, disabled }) {
  const holder = useRef(null);
  const [ready, setReady] = useState(false);

  // Held in a ref so re-rendering the parent cannot leave Google calling an
  // old handler, which is easy to do when the callback is registered once.
  //
  // Assigned in an effect rather than during render: a render can be thrown
  // away and re-run, and mutating the ref on the way past would leave Google
  // holding a handler from a render that never happened.
  const handler = useRef(onToken);

  useEffect(() => {
    handler.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!CLIENT_ID) {
      onError?.("Google sign-in is not configured.");
      return;
    }

    let cancelled = false;

    loadGoogle()
      .then(() => {
        if (cancelled || !holder.current) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => handler.current?.(response.credential),
        });

        window.google.accounts.id.renderButton(holder.current, {
          theme: "filled_black",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width: 320,
        });

        setReady(true);
      })
      .catch((err) => onError?.(err.message));

    return () => {
      cancelled = true;
    };
    // onError is only used for reporting, and re-running this would re-render
    // Google's button from scratch on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : ""}>
      <div ref={holder} className="flex justify-center" />

      {!ready ? (
        <p className="text-center text-sm text-white/40">Loading Google…</p>
      ) : null}
    </div>
  );
}

export default GoogleSignInButton;
