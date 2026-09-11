# Otter Service In-Browser

The in-browser version of [Otter Service Standalone]({{ grader_url }}). Upload an
assignment's `autograder.zip` and the student notebooks, and download the same grades CSV,
except that everything runs in your browser: notebooks never leave your computer, there is
no login, and there is no download code to copy. The page fetches Python packages from
public CDNs the first time you grade, so the first batch takes about a minute to start.
Otter Service Standalone remains available if you prefer the hosted service.

!!! tip "Quick start"

    - Upload the assignment's `autograder.zip`
    - Upload the student notebooks: several `.ipynb` files, or one `.zip` of notebooks
      (a Canvas "Download Submissions" zip works as is)
    - Add another batch for each additional assignment, for example the hw02 autograder
      with the hw02 notebooks
    - Click **Grade all batches**. Each batch produces its own grades CSV and log, and
      **Download all results** bundles them into one zip

<div class="otter-grader" markdown="0">
  <div id="batches"></div>
  <div class="grader-actions">
    <button id="addBatch" type="button" class="btn-secondary">Add another batch</button>
  </div>

  <details class="grader-advanced">
    <summary>Advanced options</summary>
    <div class="grader-row">
      <div class="grader-col">
        <label for="otterVersion">otter-grader version override
          <input id="otterVersion" type="text" placeholder="(from autograder zip)" />
        </label>
      </div>
      <div class="grader-col">
        <label for="timeoutSecs">Per-notebook timeout (seconds)
          <input id="timeoutSecs" type="number" min="10" step="10" value="120" />
        </label>
      </div>
    </div>
    <label for="extraPackages">Extra pip packages (one per line)
      <textarea id="extraPackages" rows="2" placeholder="datascience==0.18.1"></textarea>
    </label>
  </details>

  <div class="grader-actions">
    <button id="gradeAll" type="button" disabled>Grade all batches</button>
    <button id="cancel" type="button" class="btn-secondary" hidden>Cancel</button>
    <button id="reset" type="button" class="btn-secondary" hidden>Reset</button>
  </div>

  <div id="status" class="grader-status" role="status" aria-live="polite" hidden>
    <progress id="progress" max="1" value="0"></progress>
    <p id="statusText"></p>
  </div>

  <div id="results"></div>

  <div class="grader-actions">
    <button id="downloadAll" type="button" hidden disabled>Download all results (.zip)</button>
  </div>

  <div id="loading-overlay" hidden>
    <div class="loading-spinner" aria-hidden="true"></div>
    <p>Loading...</p>
  </div>
</div>

<script type="module" src="/assets/otter-grader/grader.js"></script>

!!! note "Buttons and options"

    - **Add another batch** adds a second autograder zip plus its own notebooks, so you can
      grade several assignments in one run. Each batch gets its own CSV.
    - **Grade all batches** runs every batch in order. **Cancel** stops the run; **Reset**
      clears everything.
    - **Download all results (.zip)** bundles every CSV and log, with a manifest of the
      package versions used.
    - **Advanced options** are rarely needed: override the otter-grader version the zip
      pins, change the per-notebook timeout (a notebook that runs longer is marked
      "Timed out" and grading continues), or list extra pip packages a notebook imports
      that the autograder zip does not declare.
