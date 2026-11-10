/* Storm HQ admin: the small slice of the GitHub API the admin page needs.
   Every Publish is ONE commit on the site's branch, so each change shows up (and can be
   undone) as one entry in the history. GitHub Pages republishes the site about a minute later.

   const gh = D250GitHub({ token, owner, repo, branch })
   gh.check()                      -> repo info; throws a readable error if the key can't write
   gh.readText(path)               -> { text, sha } of a file on the branch (null if missing)
   gh.commit(message, files)       -> commit sha. files: [{ path, text } | { path, base64 } | { path, remove:true }]
   gh.history(path, n)             -> recent commits that touched path
   gh.undo(sha)                    -> new commit putting every file that commit changed back to its parent's version */
(function (root) {
  const API = "https://api.github.com";
  const b64ToText = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));
  const textToB64 = text => {
    const bytes = new TextEncoder().encode(text);
    let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const encPath = p => p.split("/").map(encodeURIComponent).join("/");

  function D250GitHub(cfg) {
    const base = `${API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`;
    async function call(path, opts = {}) {
      const r = await fetch(path.startsWith("http") ? path : base + path, {
        ...opts,
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${cfg.token}`, "X-GitHub-Api-Version": "2022-11-28",
          ...(opts.body ? { "Content-Type": "application/json" } : {}) },
      });
      if (r.status === 404 && opts.allow404) return null;
      if (!r.ok) {
        let msg = ""; try { msg = (await r.json()).message || ""; } catch (_) {}
        const e = new Error(
          r.status === 401 ? "GitHub did not accept the access key. It may have expired: an admin can set a new one under Settings." :
          r.status === 403 ? "The access key can't change this site. It needs Contents: Read and write on the repository." :
          r.status === 409 || r.status === 422 ? "Someone else changed the site at the same moment. Reload the page and try again." :
          `GitHub error ${r.status}${msg ? ": " + msg : ""}`);
        e.status = r.status; throw e;
      }
      return r.status === 204 ? null : r.json();
    }
    const json = (method, path, body) => call(path, { method, body: JSON.stringify(body) });

    async function check() {
      const info = await call("");
      if (!info.permissions || !info.permissions.push) throw new Error("This access key can read the site but can't change it. Give it Contents: Read and write.");
      return info;
    }
    async function readText(path) {
      const f = await call(`/contents/${encPath(path)}?ref=${encodeURIComponent(cfg.branch)}`, { allow404: true });
      if (!f) return null;
      if (f.content) return { text: b64ToText(f.content), sha: f.sha };
      const blob = await call(`/git/blobs/${f.sha}`);              // files over 1 MB come back without content
      return { text: b64ToText(blob.content), sha: f.sha };
    }
    async function head() {
      const ref = await call(`/git/ref/heads/${encodeURIComponent(cfg.branch)}`);
      const c = await call(`/git/commits/${ref.object.sha}`);
      return { sha: ref.object.sha, tree: c.tree.sha };
    }
    async function commit(message, files) {
      const h = await head();
      const tree = [];
      for (const f of files) {
        if (f.remove) { tree.push({ path: f.path, mode: "100644", type: "blob", sha: null }); continue; }
        if (f.sha) { tree.push({ path: f.path, mode: "100644", type: "blob", sha: f.sha }); continue; }
        const blob = await json("POST", "/git/blobs", { content: f.base64 != null ? f.base64 : textToB64(f.text), encoding: "base64" });
        tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
      }
      const t = await json("POST", "/git/trees", { base_tree: h.tree, tree });
      const c = await json("POST", "/git/commits", { message, tree: t.sha, parents: [h.sha] });
      await json("PATCH", `/git/refs/heads/${encodeURIComponent(cfg.branch)}`, { sha: c.sha, force: false });
      return c.sha;
    }
    async function history(path, n = 15) {
      return call(`/commits?sha=${encodeURIComponent(cfg.branch)}&path=${encodeURIComponent(path)}&per_page=${n}`);
    }
    async function undo(sha) {
      const c = await call(`/commits/${sha}`);
      if (!c.parents || c.parents.length !== 1) throw new Error("That change can't be undone from here.");
      const parent = c.parents[0].sha, files = [];
      for (const f of c.files || []) {
        if (f.status === "renamed") throw new Error("That change renamed a file and can't be undone from here.");
        if (f.status === "added") { files.push({ path: f.filename, remove: true }); continue; }
        const old = await call(`/contents/${encPath(f.filename)}?ref=${parent}`, { allow404: true });
        files.push(old ? { path: f.filename, sha: old.sha } : { path: f.filename, remove: true });
      }
      const first = (c.commit.message || "").split("\n")[0];
      return commit(`Undo: ${first}`, files);
    }
    return { check, readText, commit, history, undo, cfg };
  }
  D250GitHub.textToB64 = textToB64;
  root.D250GitHub = D250GitHub;
})(window);
