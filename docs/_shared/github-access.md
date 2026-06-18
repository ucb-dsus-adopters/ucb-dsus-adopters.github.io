<!-- Shared block: instructor GitHub access + grading handoff.
     Host page selects a course into `c` (e.g. c = courses.data8) before including. -->
1. **Download student submissions:** Export all submissions from Canvas onto your machine.
2. **Get solutions:** Log into the private solutions repository
   ([{{ c.solutions_repo_name }}]({{ c.solutions_repo }})), navigate to the
   `autograder_zips` folder, and download the `autograder.zip` for the assignment you are
   grading.
3. **Grade automatically:** Log into the grader at
   [{{ grader_url }}]({{ grader_url }}) with your GitHub username and grade the
   submissions (see [Otter Autograding](../how-to-adopt/autograding.md)).
4. **Import grades:** Upload the CSV file with grades back to Canvas.

!!! warning "Please do not distribute solutions"

    Access to {{ c.solutions_repo_name }} is granted on the condition that solutions are
    not redistributed. This protects the integrity of the course materials for every
    adopting institution.
