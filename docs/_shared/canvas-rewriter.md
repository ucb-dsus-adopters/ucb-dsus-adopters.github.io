<!-- Shared block: point Canvas assignment links at the adopter's JupyterHub.
     Host page selects a course into `c` (e.g. c = courses.data8) before including. -->
The default template links assignment URLs to `{{ default_hub }}`. If your
institution uses a different JupyterHub, use the
[Canvas JupyterHub rewriter]({{ rewriter_url }}) to update the zip or `.imscc`
file **before** importing:

- Upload your Canvas template (zip or `.imscc` file) to the rewriter
- Enter your JupyterHub URL (e.g., `{{ default_hub }}/hub` or your institution's hub URL)
- Enter the materials repository URL: use **your fork** of the student materials, not the
  upstream Berkeley repo. Fork [{{ c.materials_repo_name }}]({{ c.materials_repo }}) first,
  then enter your fork URL (e.g.,
  `https://github.com/YOUR_GITHUB_USERNAME/{{ c.materials_repo_name.split('/')[-1] }}`).
  For {{ c.title }}, fork from `{{ c.materials_repo }}`.
- Scan and preview to see how links will change
- Confirm that old links are being rewritten to your hub and that the repo points to your
  fork
- Rewrite and download the updated file

<div class="video-wrapper">
<iframe src="https://www.youtube.com/embed/xbvQF5HmwUw" title="JupyterHub rewriter walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
