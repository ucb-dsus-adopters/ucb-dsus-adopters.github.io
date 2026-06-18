# Canvas Import

Each course ships a **Canvas common-cartridge template** with the week-by-week structure,
assignment links, embedded reading quizzes, and gradebook already set up. Importing it is
the fastest way to stand up the course.

The steps below are the standardized flow. For the **exact Canvas template download and
materials repository URL**, open your course page ([Data 8](../courses/data8.md) or
[Data 6](../courses/data6.md)), where these same steps render with your course's values.

## 1. Download the Canvas template

Download the common-cartridge (`.imscc`) template linked from your course page.

## 2. Point assignments at your JupyterHub

By default the template links assignments to `datahub.berkeley.edu`. If your institution
uses a different JupyterHub, run the template through the
[Canvas JupyterHub rewriter](https://ds-modules.github.io/canvas-jupyterhub-rewriter/) to
rewrite the hub URL and the materials repository **before** importing. Your course page
lists the exact materials repository URL to enter.

## 3. Import into Canvas

Import the cartridge into a **new** Canvas course, then copy that course term-to-term
rather than re-importing (re-importing can duplicate items). After importing, click an
assignment and confirm the link points at your JupyterHub.

## 4. The student workflow

Once Canvas is set up, this is how students interact with assignments:

{% include 'student-workflow.md' %}

!!! tip "Other LMS platforms"

    Not using Canvas? The core notebooks are platform-independent and can be linked from
    any LMS. Only the cartridge import is Canvas-specific.
