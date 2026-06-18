# Infrastructure & Tools

Before importing a course, decide **how your students will run notebooks**. The course
materials are platform-independent Jupyter notebooks, so several options work.

## Choose a delivery mode

=== "Campus JupyterHub"

    If your institution already runs a JupyterHub, students sign in with campus single
    sign-on and notebooks open directly. You'll use the
    [Canvas JupyterHub rewriter](canvas-import.md#2-point-assignments-at-your-jupyterhub) to
    point assignment links at your hub.

=== "Partner-provisioned hub"

    If your institution doesn't already run JupyterHub, we can help connect you with a
    provisioned environment configured to your campus sign-on:

    - **[Cloudbank](https://www.cloudbank.org/)** (NSF-funded) — available to adopting
      institutions nationwide.
    - **[Cal-ICOR](https://www.cal-icor.org/)** (California Education Learning Lab) — a
      UC Berkeley-led shared JupyterHub platform for California public colleges and
      universities.

    Provisioning is scheduled, so start this early. We'll give you a realistic timeline when
    you contact us.

=== "Colab / Binder"

    For piloting or smaller deployments, the notebooks also run on Google Colab or Binder.
    These are good temporary options while a hub is being prepared.

## What you need

- A **GitHub account** (free): [create one here](https://github.com)
- A way for students to **run notebooks** (one of the delivery modes above)
- An **LMS such as Canvas** if you want to use our cartridge (the notebooks also work with
  other LMSs)
- A commitment **not to distribute solutions** publicly

## Privacy and accessibility documentation

Your institution may need documentation related to privacy (HECVAT) and accessibility
(VPAT). The student information required is minimal (an email address). Accessibility is an
ongoing effort across UC Berkeley and the Jupyter community; ask us for the current HECVAT
and accessibility statements when you adopt.

## A deeper technical reference

For a thorough overview of the infrastructure needed to run a data science course, see
[The Data Science Educator's Guide to Technical Infrastructure](https://ucbds-infra.github.io/ds-course-infra-guide/intro.html).
