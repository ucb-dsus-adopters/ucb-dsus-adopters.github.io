{% set c = courses.data8 %}
<div class="course-hero course-hero--data8" markdown>
![Data 8](../assets/data8logo.png){ .hero-logo }
# Data 8: Foundations of Data Science
</div>

Data 8, "The Foundations of Data Science," is taught to first-year students at UC Berkeley.
It combines inference, computing, and statistics (hypothesis testing, modeling,
visualization, and more) into a single introductory course. The full set of materials
used at Berkeley is available to adopt.

- Course site: [data8.org](http://data8.org) · Textbook:
  [inferentialthinking.com](https://www.inferentialthinking.com/chapters/intro)
- Zero to Data 8 guide: [data8.org/zero-to-data-8](https://data8.org/zero-to-data-8/intro.html) -
  syllabus, lectures, course staff, and context for running Data 8
- Browse notebooks in your browser: [{{ c.title }} xeus-lite]({{ c.xeus_lite }})
- Public student materials: [{{ c.materials_repo_name }}]({{ c.materials_repo }})

!!! tip "Quick start"

    1. Complete the [Data 8 Instructor Interest Form]({{ c.interest_form }})
    2. Fork the [student materials]({{ c.materials_repo }})
    3. Follow the steps below

## Choose your adoption version

Both versions use the **same workflow below**; they differ mainly in which materials repo
and Canvas template you use.

| | **Version 1** | **Version 2 (recommended)** |
| --- | --- | --- |
| **Materials repo** | [materials-fds](https://github.com/data-8/materials-fds) | [materials-fds-v2](https://github.com/data-8/materials-fds-v2) |
| **Basis** | Spring 2022 track | Fall 2025 |
| **Curriculum** | Classic Data 8 sequence | Adds multiple linear regression |
| **Canvas shell** | Original template | UI + accessibility improvements |

New adopters should use **Version 2**; returning adopters can stay on Version 1 for
continuity. The variable values on this page reflect Version 2.

## 1. Get access

Create a GitHub account if needed, then complete the
[Instructor Interest Form]({{ c.interest_form }}) (indicate which version you'll use). Fork
the student materials at [{{ c.materials_repo_name }}]({{ c.materials_repo }}), and accept
the invitations to the private solutions repository
([{{ c.solutions_repo_name }}]({{ c.solutions_repo }})) and the
[Otter Service Standalone org]({{ otter_org_url }}).

**Screen recording: forking the student materials**

{% include 'forking-video.md' %}

## 2. Set up Canvas

Download the Version 2 Canvas template (provided after you complete the adoption form;
email [{{ support_email }}](mailto:{{ support_email }}) if you need the link).

:material-play-circle: [Screen recording: configuring the Canvas shell](https://drive.google.com/file/d/1rBG97FUwMdV3QQas7znuH8pud-KC8yPM/view)

### Point assignments at your JupyterHub

{% include 'canvas-rewriter.md' %}

### Import into Canvas

{% include 'canvas-import.md' %}

## 3. Student workflow

:material-play-circle: [Screen recording: student workflow](https://drive.google.com/file/d/1flQlOZ6ViM0S7S0k0-ZLFZsFNY5ZXMON/view)

{% include 'student-workflow.md' %}

## 4. Grade with Otter

{% include 'otter-service.md' %}

### Instructor grading checklist

{% include 'github-access.md' %}

## License

Data 8 content is released under **two different licenses**. Check which applies before
you adapt or redistribute:

- **The Data 8 textbook** (*Inferential Thinking*) is licensed
  [CC-BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/2.0/). You may use it at
  [inferentialthinking.com](https://inferentialthinking.com), but you **may not modify or
  redistribute** it without permission from the textbook authors.
- **Data 8 course materials** (notebooks, exercises, and other materials) are licensed
  [CC-BY-NC](https://creativecommons.org/licenses/by-nc/2.0/). You are free to **modify and
  distribute** them.
- **Private course materials** (exams and answers) are kept private to protect course
  integrity; request access via the [instructor interest form]({{ c.interest_form }}).

See [Understanding Licenses](../how-to-adopt/licenses.md) for how to read these terms.

## Explore the materials in your browser

{% include 'in-browser-notebooks.md' %}

## Need help?

Email [{{ support_email }}](mailto:{{ support_email }}) or see [Support](../how-to-adopt/support.md).
