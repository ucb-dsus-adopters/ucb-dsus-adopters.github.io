# Otter Autograding

Assignments are [Otter](https://otter-grader.readthedocs.io/)-graded Jupyter notebooks.
You have four ways to grade them; **Otter Service** (in your browser or as the hosted
Standalone service) needs no local installation.

For the exact private solutions repository and any pinned otter-grader version, see your
course page, [Data 8](../courses/data8/adoption.md) or [Data 6](../courses/data6.md).

## Option 1: Otter Service In-Browser

[Otter Service In-Browser](../tools/otter-grader.md) is the in-browser version of the
Standalone service below: upload the assignment's `autograder.zip` plus the student
notebooks (or a Canvas submissions zip), add a batch per assignment, and download a grades
CSV per batch. No login, no server, and nothing leaves your computer.

## Option 2: Otter Service Standalone

A web-based grader at [grader.datahub.berkeley.edu](https://grader.datahub.berkeley.edu/),
with no local installation. You authorize once with your GitHub username, upload the student
submissions plus the assignment's `autograder.zip` (from your course's private solutions
repo), and download a CSV of grades. The full, course-specific steps render on each course
page.

## Option 3: Gradescope

!!! important "Paid service"

    Gradescope is a **paid** service that ties assignments back to Canvas; your institution
    needs a Gradescope license.

Create the assignment in Canvas and Gradescope, attach the assignment's `autograder.zip`
as the programming autograder, and grades push back to the LMS. See Gradescope's docs on
[Canvas integration](https://help.gradescope.com/article/y10z941fqs-instructor-canvas) and
[programming assignments](https://help.gradescope.com/article/ujutnle52h-instructor-assignment-programming).

## Option 4: Grade locally

Full control, but requires local setup. Install
[otter-grader](https://otter-grader.readthedocs.io/en/latest/index.html#installation) and
[Docker](https://otter-grader.readthedocs.io/en/latest/index.html#docker), then use
`otter grade`.

!!! warning "Match the pinned version"

    Some courses pin a specific otter-grader version (for example, **Data 6 requires
    6.1.6**). Install exactly the version listed on your course page, or grades may differ.
