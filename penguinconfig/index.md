# PenguinConfig

{% assign pagename = page.name | remove: '.md' %}
{% assign redirect_clarifier = pagename | capitalize %}
{% if redirect_clarifier == 'Index' %}
  {% assign redirect_clarifier = 'Home' %}
{% endif %}

## {{redirect_clarifier}}

If you do not get redirected soon, click [here](https://www.modrinth.com/mod/penguinconfig)

<script type="text/javascript">
  setTimeout(() => window.location.replace(document.querySelector('a').href), 3 * 1000);
</script>