import React from "react";
import { configError } from "../services/GlobalApi";

function ConfigNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0d14] px-5 py-16">
      <div className="w-full max-w-lg">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-400">
          Setup needed
        </p>
        <h1 className="mt-2 text-2xl font-black text-white">Connect your TMDb API token</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{configError}</p>

        <ol className="mt-6 space-y-4 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
              1
            </span>
            <span>
              Request an API read access token at{" "}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline underline-offset-4 hover:text-sky-300"
              >
                themoviedb.org/settings/api
              </a>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
              2
            </span>
            <span>
              Copy <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">.env.example</code>{" "}
              to <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">.env</code> in the
              project root.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
              3
            </span>
            <span>
              Set{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                REACT_APP_TMDB_READ_TOKEN
              </code>{" "}
              to your token, then restart the dev server.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ConfigNotice;
