# PenguinMods Index

{% assign doclist = site.pages | sort: 'url' %}

<ul>
  {% for doc in doclist %}
    {% if doc.name contains '.md' %}
      {% if page.url == doc.url %}
        {% continue %}
      {% endif %}
      
      {% assign linkname = doc.name | remove: '.md' | capitalize %}
      {% if linkname == 'Index' %}
        {% assign linkname = 'Home' %}
      {% endif %}

      {% assign linkname = doc.title | append: ' - ' | append: linkname %}

      {% assign url = doc.url %}
      {% if doc.url contains '.html' %}
        {% assign url = url | split: '.' | slice: 0 %}
      {% endif %}
      
      <li><a href="{{ site.baseurl }}{{ url }}" target="_blank">{{ linkname }}</a></li>
    {% endif %}
  {% endfor %}
</ul>