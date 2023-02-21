{% assign redirect_clarifier = page.name | remove: '.md' | capitalize %}
{% if redirect_clarifier == 'Index' %}
  {% assign redirect_clarifier = 'Home' %}
{% endif %}

# PenguinCore
## {{redirect_clarifier}}

If you do not get redirected soon, click [here](https://github.com/PenguinMods/PenguinCore/wiki)

<script type="text/javascript">
  setTimeout(() => window.location.replace(document.querySelector('a').href), 3 * 1000);
</script>