# Canvas JupyterHub Rewriter

Upload a Canvas common-cartridge export (`.imscc` or `.zip`) and rewrite JupyterHub and
materials-repo links before importing. Everything runs in your browser; nothing is uploaded
to a server.

!!! tip "Quick start"

    - Upload your Canvas template (`.imscc` or `.zip` file) below
    - Enter your JupyterHub URL (e.g., `https://your-hub.example.edu/hub/`)
    - Enter your **forked** student materials repository URL, not the upstream Berkeley repo
    - Click **Scan & Preview** to see how links will change
    - Click **Rewrite & Download**, then import the updated file into Canvas

!!! note "Use your fork, not the upstream repo"

    The rewriter updates assignment links to point at **your** JupyterHub and **your fork**
    of the student materials. Fork the course's public materials repo on GitHub first, then
    paste that fork URL into **New Repo URL**. See your
    [course adoption page](../courses/index.md) for the repo to fork. A video walkthrough is
    below the tool.

<div class="canvas-rewriter" markdown="0">
  <div class="rewriter-section">
    <label for="file">Choose .imscc / .zip file
      <input id="file" type="file" accept=".imscc,.zip" />
    </label>
  </div>

  <div class="rewriter-section">
    <div class="rewriter-row">
      <div class="rewriter-col">
        <label for="newHub">New Hub Base URL (required)
          <input id="newHub" type="text" placeholder="https://datahub.berkeley.edu/hub/" />
        </label>
      </div>
      <div class="rewriter-col">
        <label for="newRepo">New Repo URL (required)
          <input id="newRepo" type="text" placeholder="https://github.com/&lt;user&gt;/&lt;repo&gt;" />
        </label>
      </div>
    </div>

    <div class="rewriter-row">
      <div class="rewriter-col">
        <label for="oldHub">Old Hub Base (optional, auto-detected)
          <input id="oldHub" type="text" placeholder="(auto-detect)" />
        </label>
      </div>
      <div class="rewriter-col">
        <label for="oldRepo">Old Repo URL (optional, auto-detected)
          <input id="oldRepo" type="text" placeholder="(auto-detect)" />
        </label>
      </div>
    </div>

    <button id="scan" type="button">Scan &amp; Preview</button>
    <button id="rewrite" type="button" disabled>Rewrite &amp; Download</button>
    <button id="reset" type="button" class="btn-secondary" style="display:none">Reset</button>
  </div>

  <div class="rewriter-section">
    <h3>Summary</h3>
    <div class="rewriter-stats">
      <div>Files scanned: <span id="filesScanned">0</span></div>
      <div>Links found: <span id="linksFound">0</span></div>
      <div>Links rewritten: <span id="linksRewritten">0</span></div>
    </div>
  </div>

  <div class="rewriter-section">
    <h3>Sample rewrites (up to 10)</h3>
    <div id="samples"></div>
  </div>

  <div id="loading-overlay" style="display: none;">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
</div>

<script type="module" src="/assets/canvas-rewriter/rewriter.js"></script>

## Walkthrough video

<div class="video-wrapper">
<iframe src="https://www.youtube.com/embed/xbvQF5HmwUw" title="JupyterHub rewriter walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
