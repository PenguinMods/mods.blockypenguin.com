{% assign redirect_clarifier = page.name | remove: '.md' | capitalize %}
{% if redirect_clarifier == 'Index' %}
  {% assign redirect_clarifier = 'Home' %}
{% endif %}

# LabKore
## {{redirect_clarifier}}

If you do not get redirected soon, click [here](https://www.curseforge.com/minecraft/mc-mods/labkit-labkore/issues)

<script type="text/javascript">
  setTimeout(() => window.location.replace(document.querySelector('a').href), 3 * 1000);
</script>