# Infrastructure & Tools

Decide **how your students will run notebooks**. The materials on this site are
platform-independent Jupyter notebooks, so several options work.

!!! tip "Need a hub without adopting curriculum?"

    Cal-ICOR and Cloudbank can provision computing infrastructure independently - you
    don't need to adopt a course or module to get a JupyterHub. For Cal-ICOR, email
    [calicor@berkeley.edu](mailto:calicor@berkeley.edu) or fill out the
    [interest form](https://forms.gle/fH5HSAqzDyGpKVXs6). For Cloudbank, email
    [Sean Morris](mailto:sean.smorris@berkeley.edu).

## Notebook delivery options

### Campus JupyterHub

If your institution already runs a JupyterHub, students sign in with campus single sign-on
and notebooks open directly. You'll use the
[Canvas JupyterHub rewriter](canvas-import.md#2-point-assignments-at-your-jupyterhub) to
point assignment links at your hub.

### Cal-ICOR

[Cal-ICOR](https://www.cal-icor.org/) (California Interactive Computing Open Resource) provides cloud-hosted computing infrastructure for California public colleges
and universities. If your institution is in California and doesn't already run its own hub,
Cal-ICOR can provision one configured to your campus sign-on. Provisioning is scheduled, so
start early. Email [calicor@berkeley.edu](mailto:calicor@berkeley.edu) or fill out the
[interest form](https://forms.gle/fH5HSAqzDyGpKVXs6).

### Cloudbank

[Cloudbank](https://www.cloudbank.org/) is an NSF-funded program that provisions cloud
computing infrastructure, including JupyterHubs, for institutions nationwide. If your
institution is outside California or needs broader cloud resources, Cloudbank is a good
fit. Provisioning is scheduled, so start early.

### Other options

For piloting or smaller deployments, the notebooks also run on Google Colab or Binder.
These are good temporary options while a hub is being prepared. Longer term, other
platforms such as NRP, Jetstream, Vocareum, and Codespaces may also be supported.

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
