# BlockyPenguin Mods
## Hello!

This is a placeholder site. More stuff may be coming here soon, if I get around to it...

{% assign doclist = site.pages | sort: 'url' %}
<ul>
  {% for doc in doclist %}
  {% if doc.name contains '.md' or doc.name contains '.html' %}
  <li><a href="{{ site.baseurl }}{{ doc.url }}">{{ doc.url }}</a></li>
  {% endif %}
  {% endfor %}
</ul>