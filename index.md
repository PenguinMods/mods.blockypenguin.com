# PenguinMods Index

{% assign doclist = site.pages | sort: 'url' %}

<ul>
  {% for doc in doclist %}
    {% if doc.name contains '.md' %}
      {% assign linkname = doc.name | split: "." | slice: 0 %}
      {% if linkname == "index" %}
        {% assign linkname = doc.title %}
      {% endif %}
      <li><a href="{{ site.baseurl }}{{ doc.url }}">{{ linkname }}</a></li>
    {% endif %}
  {% endfor %}
</ul>