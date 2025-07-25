---
title: Aktualności
layout: layout.njk
language: pl
---

{% import "../_includes/post-tiles.njk" as pt %}
{{ pt.post_tiles(collections.posts | reverse | selectLang('pl')) }}