"""mkdocs-macros hook module.

Defines the per-course and per-module variables that drive the shared instruction blocks in
``docs/_shared/``. The shared blocks are pulled into course/guide pages with
Jinja2 ``{% include %}`` (provided by mkdocs-macros), so any ``{{ ... }}``
references inside them are resolved against the context set on the host page.

Pattern on a course page:

    {% set c = courses.data8 %}
    {% include 'canvas-rewriter.md' %}

The included block then refers to ``c.materials_repo``, ``c.solutions_repo``,
etc. Common values that do not vary by course (grader URL, rewriter URL, support
email) are exposed as top-level variables.

Licensing is deliberately NOT modeled here. Each course states its own license
directly on its page, since licenses differ per course (and per content type).
"""


# Values shared by every course / guide page.
COMMON = {
    "support_email": "ds-help@berkeley.edu",
    "grader_url": "https://grader.datahub.berkeley.edu/",
    "rewriter_url": "https://ds-modules.github.io/canvas-jupyterhub-rewriter/",
    "otter_org_url": "https://github.com/orgs/otter-service-stdalone",
    "default_hub": "datahub.berkeley.edu",
}

# Per-course variables. Only the keys that actually differ between courses live
# here; everything genuinely shared stays in the snippet text itself.
COURSES = {
    "data8": {
        "title": "Data 8",
        "hub_url": "datahub.berkeley.edu",
        "materials_repo": "https://github.com/data-8/materials-fds-v2",
        "materials_repo_name": "data-8/materials-fds-v2",
        "solutions_repo": "https://github.com/data-8/materials-fds-private",
        "solutions_repo_name": "materials-fds-private",
        "interest_form": "https://forms.gle/y5aQBi816xDXKe7r7",
        # Browser-based course calendar (xeus-lite): slides, worksheets, videos.
        "xeus_lite": "http://data8.org/materials-fds-xeus-lite/",
        # Data 8 does not pin an otter-grader version in the adoption package.
        "otter_version": None,
    },
    "data6": {
        "title": "Data 6",
        "hub_url": "datahub.berkeley.edu",
        "materials_repo": "https://github.com/dubois-ctds/data-6-materials-student",
        "materials_repo_name": "dubois-ctds/data-6-materials-student",
        "solutions_repo": "https://github.com/dubois-ctds/data-6-materials-solutions",
        "solutions_repo_name": "dubois-ctds/data-6-materials-solutions",
        "interest_form": "https://forms.gle/2nNtbfgBtNsUHypCA",
        "xeus_lite": "https://dubois-ctds.github.io/data6-xeus-lite/",
        "otter_version": "6.1.6",
    },
    # Data 9 (Practical Data Science / CS9): public student materials and a private
    # instructor repo; full adoption package still in progress.
    "data9": {
        "title": "El Camino College CSCI 9: Practical Data Science",
        "catalog_url": "http://catalog.elcamino.edu/preview_course_nopop.php?catoid=12&coid=25255",
        "materials_repo": "https://github.com/eccdatascience/csci9-sp26-student",
        "materials_repo_name": "eccdatascience/csci9-sp26-student",
        "solutions_repo": "https://github.com/ds-modules/cs-9-dev",
        "solutions_repo_name": "ds-modules/cs-9-dev",
        "access_email": "jedwin321@berkeley.edu",
        "xeus_lite": "https://ds-modules.github.io/cs9-xeus-lite/",
    },
    # Data 100: public semester materials and a private instructor/solutions repo;
    # full adoption package still in progress.
    "data100": {
        "title": "Data 100",
        "materials_repo": "https://github.com/DS-100/sp25-student",
        "materials_repo_name": "DS-100/sp25-student",
        "solutions_repo": "https://github.com/DS-100/materials-ptds-private",
        "solutions_repo_name": "DS-100/materials-ptds-private",
    },
}


def define_env(env):
    """Register variables for use in Markdown pages and shared includes."""
    env.variables["courses"] = COURSES
    for key, value in COMMON.items():
        env.variables[key] = value
