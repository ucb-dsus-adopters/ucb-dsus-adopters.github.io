---
hide:
  - toc
---
{% set c = courses.data8 %}
# Data 8 Inspired Curriculum

Institutions around the world that have adopted or adapted Data 8 into their own
curriculum. Select a partner in the list to locate it on the map.

<div class="inspired-map-section" markdown="0">
  <p class="inspired-map-hint"><span id="inspired-count">—</span> institutions</p>

  <div class="inspired-toolbar">
    <label class="inspired-search">
      <span class="inspired-search-icon" aria-hidden="true"></span>
      <input id="inspired-search-input" type="search" placeholder="Search institutions" aria-label="Search institutions" autocomplete="off">
    </label>
  </div>

  <div class="inspired-split">
    <div class="inspired-panel inspired-panel--list">
      <ul id="inspired-institution-list" class="inspired-partner-list" aria-label="Institutions with Data 8 inspired curriculum"></ul>
      <p id="inspired-list-footer" class="inspired-list-footer" aria-live="polite"></p>
    </div>
    <div class="inspired-panel inspired-panel--map">
      <div class="inspired-map-block" id="inspired-map">
        <div class="inspired-map-wrapper">
          <div
            id="inspired-map-canvas"
            class="inspired-map-canvas"
            role="application"
            aria-label="Interactive map of institutions with Data 8 inspired curriculum"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>

## Adopt Data 8 at your institution

Interested in offering a Data 8–inspired course? Start with the
[Data 8 adoption package](adoption.md), or complete the
[Data 8 Instructor Interest Form]({{ c.interest_form }}).
