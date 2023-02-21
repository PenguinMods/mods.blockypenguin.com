# PenguinMods Index

{% assign doclist = site.pages | sort: 'url' %}

<ul>
  {% for doc in doclist %}
    {% if doc.name contains '.md' %}
      {% assign linkname = doc.name | split: '.' | slice: 0 %}
      {% if linkname == 'index' %}
        {% assign linkname = '' %}
      {% endif %}

      {% assign linkname = doc.title | append: linkname %}

      {% assign url = doc.url %}
      {% if doc.url contains '.html' %}
        {% assign url = url | split: '.' | slice: 0 %}
      {% endif %}
      <li><a href="{{ site.baseurl }}{{ url }}">{{ linkname }}</a></li>
    {% endif %}
  {% endfor %}
</ul>