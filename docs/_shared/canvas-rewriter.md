<!-- Shared block: point Canvas assignment links at the adopter's JupyterHub.
     Host page selects a course into `c` (e.g. c = courses.data8) before including. -->
!!! tip "Canvas JupyterHub rewriter: quick start"

    - Open the [Canvas JupyterHub rewriter]({{ rewriter_url }})
    - Upload your Canvas template (`.zip` or `.imscc` file)
    - Enter your JupyterHub URL (e.g., `{{ default_hub }}/hub` or your institution's hub URL)
    - Enter your **fork** of the student materials. Fork
      [{{ c.materials_repo_name }}]({{ c.materials_repo }}) first, then use your fork URL
      (e.g., `https://github.com/YOUR_GITHUB_USERNAME/{{ c.materials_repo_name.split('/')[-1] }}`)
    - Scan and preview to see how links will change
    - Confirm links point to your hub and your fork, then rewrite and download

!!! note "When do you need this?"

    The default template links assignment URLs to `{{ default_hub }}`. If your institution
    uses a different JupyterHub, run the template through the rewriter **before** importing
    into Canvas so assignment links open on your hub and pull notebooks from your fork, not
    the upstream Berkeley repo. A video walkthrough is below.

<div class="video-wrapper">
<iframe src="https://www.youtube.com/embed/xbvQF5HmwUw" title="JupyterHub rewriter walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
