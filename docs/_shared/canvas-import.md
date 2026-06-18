<!-- Shared block: import the common cartridge into Canvas.
     Host page selects a course into `c` (e.g. c = courses.data8) before including. -->
We recommend importing the cartridge into a **new** Canvas course. After the first
import, **copy that course inside Canvas** from term to term instead of re-importing
the cartridge into an existing shell (re-importing can duplicate items that do not
share the same internal IDs).

- Create a new course: Settings → Start a new course, name it (e.g., "{{ c.title }}")
- Go to **Import Course Content** from the course menu
- Select **Common cartridge 1.x package** as the content type
- Upload the `.imscc` file (the rewritten file from the rewriter step, or the original
  template if using `{{ default_hub }}`)
- Upload **all** content for this initial import
- Wait for the import: Status will show "queued" then "running" with a progress bar
- **Verify the links.** After import, click on an assignment (e.g., Homework 1) and
  check the link in the bottom-left corner of your browser. It should show your
  JupyterHub URL. Click through to confirm the notebook loads correctly

<div class="video-wrapper">
<iframe src="https://www.youtube.com/embed/tsi-z_cf8Pc" title="Uploading the Canvas template" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

!!! note "What's in the Canvas shell"

    The Canvas shell includes:

    - Reading assignments embedded as quizzes (ensures student engagement)
    - Week-by-week course structure
    - Pre-configured assignment links
    - Gradebook setup
