<!-- Shared block: grade notebooks with Otter Service Standalone (web-based).
     Host page selects a course into `c` (e.g. c = courses.data8) before including. -->
The Otter Service Standalone is a web-based service for grading notebooks, with no local
installation required. The service is available at [{{ grader_url }}]({{ grader_url }}).

:material-play-circle: [Screen recording: grading walkthrough (5 min)](https://drive.google.com/file/d/1-r1kuUutn7ZXl3lSUgBbZAxLFuHoeFPp/view)

**Step 1: Authorization.** To access the service, we add your GitHub username to our
Otter service organization. Once you have been added, accept the invitation by opening
the [otter-service-stdalone organization]({{ otter_org_url }}), then log in to the
grader with your GitHub account.

**Step 2: Download your student submissions.** Export submissions from Canvas. You can
grade a folder of notebooks by compressing it into a zip file and uploading that, or
grade one notebook at a time by uploading the notebook itself.

**Step 3: Download the solution files (`autograder.zip`).** In the private solutions
repository ([{{ c.solutions_repo_name }}]({{ c.solutions_repo }})), browse to the
`autograder_zips` folder and download the `autograder.zip` for the assignment you are
grading. If you do not have access yet, complete the
[Instructor Interest Form]({{ c.interest_form }}) or email
[{{ support_email }}](mailto:{{ support_email }}).

**Step 4: Upload and grade.** In the "Grade" section, upload your `autograder.zip` and
the student submissions, then press **Grade Notebooks**. A "download" code appears under
the button. You will need it for the next step.

**Step 5: Download your results.** The system grades roughly one minute per ten
notebooks. When it finishes, enter the code from Step 4 into the "Results" section and a
folder with a log file and a CSV file downloads. The CSV contains the grades by
notebook; if anything fails, check the log file first.
{% if c.otter_version %}
!!! important "Version requirement"

    {{ c.title }} notebooks are configured with **otter-grader {{ c.otter_version }}**.
    If you grade locally, install exactly that version:

    ```bash
    pip install otter-grader=={{ c.otter_version }}
    ```
{% endif %}
